import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma/prisma.module';
import { DeviceModule } from './api/device/device.module';

@Module({
  imports: [
    PrismaModule,
    DeviceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
