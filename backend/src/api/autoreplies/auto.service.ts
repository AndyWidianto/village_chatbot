import { PrismaService } from "../../lib/prisma/prisma.service";
import { TypeNotification } from "../../lib/shared/notification";
import { CreateAutoreplies, PayloadJWT, UpdateAutoreplies } from "../../lib/types";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class AutoreplyService {
    constructor(private prisma: PrismaService) { }

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
        })
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

        const [autoreplies, totalAutoreply] = await this.prisma.$transaction([
            this.prisma.autoreply.findMany(query),
            this.prisma.autoreply.count()
        ]);
        const totalPage = Math.ceil(totalAutoreply / limit);
        const nextCursor = autoreplies.length === limit ? autoreplies[autoreplies.length - 1].id : null;

        return {
            autoreplies,
            totalPage,
            nextCursor,
            totalData: totalAutoreply
        };
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