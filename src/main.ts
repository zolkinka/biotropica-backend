import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const version = '1.0.0';

  const config = new DocumentBuilder()
    .setTitle('Biotropica documentation')
    .setDescription('Biotropica documentation REST API')
    .setVersion(version)
    .addTag('Biotropica')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/docs/v/${version}`, app, document);

  await app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
}
bootstrap();
