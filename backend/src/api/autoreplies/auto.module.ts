import { Module } from "@nestjs/common";
import { AutoreplyService } from "./auto.service";
import { AutoreplyController } from "./auto.controller";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";


@Module({
    providers: [AutoreplyService, AccessTokenStrategy],
    controllers: [AutoreplyController]
})
export class AutoreplyModule {}