import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { OpenAiModule } from 'src/openai/openai.module';
import { FilesModule } from 'src/files/files.module';
import { TelegramUpdate } from './telegram.update';
import { GptScene } from './scenes/gpt.scene';
import { MainScene } from './scenes/main.scene';
import { ImageGenerateScene } from './scenes/generate-image.scene';
import { TelegrafConfigService } from '../config/telegraf.config';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  imports: [
    OpenAiModule,
    FilesModule,
    TelegrafModule.forRootAsync({
      useClass: TelegrafConfigService,
    }),
  ],
  providers: [
    TelegramService,
    TelegramUpdate,
    GptScene,
    MainScene,
    ImageGenerateScene,
  ],
})
export class TelegramModule {}
