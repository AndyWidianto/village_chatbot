import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";


@Module({
    providers: [NotificationService, AccessTokenStrategy],
    controllers: [NotificationController]
})
export class NotificationModule {}