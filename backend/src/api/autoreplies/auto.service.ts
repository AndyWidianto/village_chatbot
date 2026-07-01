import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { TypeNotification } from "../../lib/shared/notification";
import { CreateAutoreplies, PayloadJWT, UpdateAutoreplies } from "../../lib/types";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { Autoreply } from "@prisma/client";


@Injectable()
export class AutoreplyService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async create(user: PayloadJWT, data: CreateAutoreplies) {
        if (data.type === "ai_rag" && !data.aiPrompt) {
            throw new NotFoundException("ai prompt is required");
        }
        if (data.type === "keyword" && !data.replyContent) {
            throw new NotFoundException("content is required");
        }

        if (user.role === "review") {
            throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
        }

        const newAuto = await this.prisma.autoreply.create({
            data: { ...data }
        });
        if (newAuto.type === "ai_rag") {
            const existing = await this.cacheManager.get<Autoreply[]>(`autoreply:ai_rag`);
            if (existing) {
                const updated = [...existing, newAuto];
                await this.cacheManager.set(`autoreply:ai_rag`, updated, 10 * 60 * 1000);
            }
        }
        await this.prisma.notification.create({
            data: {
                title: 'create autoreply',
                content: JSON.stringify(data),
                type: TypeNotification.success,
                isRead: false,
                userId: user.id
            }
        })
        return newAuto;
    }
    async update(user: PayloadJWT, id: string, data: UpdateAutoreplies) {
        if (data.type === "ai_rag" && !data.aiPrompt) {
            throw new NotFoundException("ai prompt is required");
        }
        if (data.type === "keyword" && !data.replyContent) {
            throw new NotFoundException("content is required");
        }
        if (user.role === "review") {
            throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
        }

        const updateAutoreply = await this.prisma.autoreply.update({
            where: { id },
            data: { ...data }
        });
        if (updateAutoreply.type === "ai_rag") {
            const existing = await this.cacheManager.get<Autoreply[]>(`autoreply:ai_rag`);
            if (existing) {
                const updated = existing.map(a => a.id === updateAutoreply.id ? updateAutoreply : a);
                await this.cacheManager.set(`autoreply:ai_rag`, updated, 10 * 60 * 1000);
            }
        }
        await this.prisma.notification.create({
            data: {
                title: `update autoreply`,
                content: JSON.stringify(updateAutoreply),
                type: TypeNotification.success,
                isRead: false,
                userId: user.id
            }
        });

        return updateAutoreply;
    }
    async getAll(lastId?: string, limitStr?: string, search?: string) {
        let limit = 10;
        if (limitStr && limitStr.trim()) {
            limit = Number(limitStr);
        }

        const query: any = {
            take: limit,
            orderBy: { id: 'asc' },
        };

        if (lastId) {
            query.cursor = { id: lastId };
            query.skip = 1;
        }
        if (search) {
            query.where = {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        replyContent: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        aiPrompt: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            };
        }
        const existingCache = await this.cacheManager.get<Autoreply[]>(`autoreply:lastId:${lastId || "first"}:limit:${limit}:search:${search || "none"}`);
        if (existingCache) {
            return existingCache;
        }
        const [autoreplies, totalAutoreply] = await this.prisma.$transaction([
            this.prisma.autoreply.findMany(query),
            this.prisma.autoreply.count()
        ]);
        const totalPage = Math.ceil(totalAutoreply / limit);
        const nextCursor = autoreplies.length === limit ? autoreplies[autoreplies.length - 1].id : null;
        const sendData = {
            autoreplies,
            totalPage,
            nextCursor,
            totalData: totalAutoreply
        }
        await this.cacheManager.set(`autoreply:lastId:${lastId || "first"}:limit:${limit}:search:${search || "none"}`, sendData, 10 * 60 * 1000);
        return sendData;
    }
    async getOne(id: string) {
        const existing = await this.prisma.autoreply.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("Autoreply is not found");
        }
        return existing;
    }
    async delete(user: PayloadJWT, id: string) {
        if (user.role === "review") {
            throw new BadRequestException("Akses ditolak. Role Review hanya diperbolehkan melihat data.")
        }
        const existing = await this.getOne(id);
        if (existing.type === "ai_rag") {
            const existingCache = await this.cacheManager.get<Autoreply[]>(`autoreply:ai_rag`);
            if (existingCache) {
                const updated = existingCache.filter(a => a.id !== existing.id);
                await this.cacheManager.set(`autoreply:ai_rag`, updated, 10 * 60 * 1000);
            }
        }
        if (existing.type === "keyword") {
            const existingCache = await this.cacheManager.get<Autoreply>(`autoreply:${existing.name}`);
            if (existingCache) {
                await this.cacheManager.del(`autoreply:${existing.name}`);
            }
        }
        await this.prisma.autoreply.delete({
            where: { id: existing.id }
        })

        await this.prisma.notification.create({
            data: {
                title: `delete autoreply`,
                content: JSON.stringify(existing),
                type: TypeNotification.success,
                isRead: false,
                userId: user.id
            }
        });
        return { message: "Delete Autoreply successfully" };
    }
}