import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma/prisma.module';
import { ApiModule } from './api/api.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    PrismaModule,
    ApiModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
