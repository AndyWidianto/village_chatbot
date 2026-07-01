import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/prisma/prisma.module';
import { ApiModule } from './api/api.module';
import { EventModule } from './event/event.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './lib/cloudinary/cloudinary.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    PrismaModule,
    ApiModule,
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    CloudinaryModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({ 
        store: await redisStore({
          url: configService.get<string>('REDIS_URL'),
          ttl: 5 * 60 * 1000,
        })
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
