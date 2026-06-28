import { Module } from "@nestjs/common";
import { ComplaintService } from "./complaint.service";
import { ComplaintController } from "./complaint.controller";


@Module({
    providers: [ComplaintService],
    controllers: [ComplaintController],
    exports: [ComplaintService]
})
export class ComplaintModule {}