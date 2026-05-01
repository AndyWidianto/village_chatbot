import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { AuthGuard } from "@nestjs/passport";
import type { RequestAndPayload } from "@/lib/types";



@Controller("api/notifications")
export class NotificationController {
    constructor(private service: NotificationService) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getNotifications(@Req() req: RequestAndPayload, @Query() query: { lastId: string, limit: string }) {
        const userId = req.user.id;
        return this.service.getAll(userId, query.lastId, query.limit);
    }

    @Get("unread")
    @UseGuards(AuthGuard("jwt"))
    async totalUnread(@Req() req: RequestAndPayload) {
        const userId = req.user.id;
        return this.service.countUnread(userId);
    }
}