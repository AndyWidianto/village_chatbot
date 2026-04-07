import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { PrismaService } from "../../lib/prisma/prisma.service";



@Module({
  providers: [PrismaService, DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}