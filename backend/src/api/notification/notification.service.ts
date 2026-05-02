import { PrismaService } from "../../lib/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";


@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getAll(userId: string, lastId?: string, limitStr?: string) {
        let limit = 4;
        let query: Prisma.NotificationFindManyArgs = {};
        if (lastId) {
            query = {
                ...query,
                cursor: { id: lastId },
            }
        }
        if (limitStr) {
            limit = Number(limitStr);
        }
        query = {
            ...query,
            take: limit + 1,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileUrl: true
                    }
                }
            }
        }
        return this.prisma.notification.findMany({
            ...query
        });
    }

    async countUnread(userId: string) {
        const totalUnread = await this.prisma.notification.count({
            where: {
                isRead: false
            }
        });
        return {
            totalUnread: totalUnread
        }
    }
}