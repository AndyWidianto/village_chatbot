import { PrismaService } from "@/lib/prisma/prisma.service";
import { TypeNotification } from "@/lib/shared/notification";
import { CreateAutoreplies, PayloadJWT, UpdateAutoreplies } from "@/lib/types";
import { Injectable, NotFoundException } from "@nestjs/common";


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

        const newAuto = await this.prisma.autoreply.create({
            data: { ...data }
        });
        await this.prisma.notification.create({
            data: {
                title: `${user.name} CREATE AUTOREPLY`,
                content: data.name,
                type: TypeNotification.success,
                isRead: false
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

        const updateAutoreply = await this.prisma.autoreply.update({
            where: { id },
            data: { ...data }
        })
        const updateDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ');

        await this.prisma.notification.create({
            data: {
                title: `${user.name} UPDATE AUTOREPLY`,
                content: updateDetails || 'No changes detected',
                type: TypeNotification.success,
                isRead: false
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
        const existing = await this.getOne(id);
        await this.prisma.autoreply.delete({
            where: { id: existing.id }
        })

        await this.prisma.notification.create({
            data: {
                title: `${user.name} DELETE AUTOREPLY`,
                content: `Delete autoreply ${existing.name}`,
                type: TypeNotification.success,
                isRead: false
            }
        });
        return { message: "Delete Autoreply successfully" };
    }
}