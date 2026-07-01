import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Cache } from "cache-manager";


@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async getAll(userId: string, lastId?: string, limitStr?: string) {
        let limit = 4;
        let query: Prisma.NotificationFindManyArgs = {};
        if (lastId) {
            query = {
                ...query,
                cursor: { id: lastId },
                skip: 1
            }
        }
        if (limitStr) {
            limit = Number(limitStr);
        }
        query = {
            ...query,
            take: limit,
            orderBy: {
                id: 'desc'
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
        const existingCache = await this.cacheManager.get(`notification:lastId:${lastId || "first"}:limit:${limit}`);
        if (existingCache) {
            return existingCache;
        }
        const notifications = await this.prisma.notification.findMany({
            ...query
        });
        await this.cacheManager.set(`notification:lastId:${lastId || "first"}:limit:${limit}`, notifications, 10 * 60 * 1000);
        return notifications;
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