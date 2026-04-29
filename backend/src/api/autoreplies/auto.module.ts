import { Module } from "@nestjs/common";
import { AutoreplyService } from "./auto.service";
import { AutoreplyController } from "./auto.controller";


@Module({
    providers: [AutoreplyService],
    controllers: [AutoreplyController]
})
export class AutoreplyModule {}