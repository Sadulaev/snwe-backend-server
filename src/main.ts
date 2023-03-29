import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import fs from 'fs'

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('../etc/ssl/temp.key'),
      cert: fs.readFileSync('../etc/ssl/temp.crt'),
    }
  });
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: 'https://80.78.253.83:443'
  });
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
