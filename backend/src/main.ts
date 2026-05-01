import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import CookieParser from "cookie-parser";
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap(expressInstance: any) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(CookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', 'https://domain-kamu.vercel.app'], // Tambahkan domain prod kamu nanti
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.init();
  return app;
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap(server).then(() => {
    const port = process.env.PORT ?? 3000;
    server.listen(port, () => console.log(`Server running on port ${port}`));
  });
}

// 5. Export untuk Vercel
export default server;