import { Module } from "@nestjs/common";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { EvolutionModule } from "../../lib/evolutions/evolutions.module";
import { AccessTokenStrategy } from "../../lib/guards/access.strategy";



@Module({
  providers: [PrismaService, DeviceService, AccessTokenStrategy],
  controllers: [DeviceController],
  imports: [EvolutionModule]
})
export class DeviceModule {}