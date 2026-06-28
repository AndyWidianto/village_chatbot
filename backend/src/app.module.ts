import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma/prisma.module';
import { ApiModule } from './api/api.module';
import { EventModule } from './event/event.module';
import { GuardModule } from './lib/guards/guards.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './lib/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    ApiModule,
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
