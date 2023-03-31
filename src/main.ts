import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs'

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('../../../etc/ssl/ab-energy_key.key'),
      cert: fs.readFileSync('../../../etc/ssl/ab-energy.crt'),
    }
  });
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['https://www.ab-energy.ru', 'https://ab-energy.ru']
  });
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
