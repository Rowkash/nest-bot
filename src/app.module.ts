import { Module } from '@nestjs/common';
import { OpenAiModule } from './openai/openai.module';
import { TelegramModule } from './telegram/telegram.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    OpenAiModule,
    TelegramModule,
    FilesModule,
  ],
})
export class AppModule {}
