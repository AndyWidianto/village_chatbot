import { Module } from "@nestjs/common";
import { CitizenController } from "./citizen.controller";
import { CitizenService } from "./citizen.service";


@Module({
    providers: [CitizenService],
    controllers: [CitizenController],
    exports: [CitizenService]
})
export class CitizenModule {}