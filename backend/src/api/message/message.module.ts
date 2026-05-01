import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";
import { MessageController } from "./message.controller";
import { EventModule } from "../../event/event.module";


@Module({
    providers: [MessageService, AccessTokenStrategy],
    controllers: [MessageController],
    imports: [
        EventModule
    ],
    exports: [MessageService]
})
export class MessageModule {}