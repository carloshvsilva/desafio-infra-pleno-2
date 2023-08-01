import { NestFactory } from '@nestjs/core';
import { ChallengeModule } from './challenge.module';

async function bootstrap() {
  const app = await NestFactory.create(ChallengeModule);
  await app.listen(3000);
}

bootstrap();
