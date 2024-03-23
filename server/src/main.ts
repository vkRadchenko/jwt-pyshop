import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const configService = app.get(ConfigService);
  //const port = configService.get('port');

  app.enableCors();
  await app.listen(9090);
}

bootstrap();
