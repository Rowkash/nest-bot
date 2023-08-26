import {
  Command,
  Ctx,
  Hears,
  Message,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import {
  EXIT_GENERATE_IMAGE_SCENE,
  GENERATE_IMAGE_SCENE,
  MAIN_SCENE,
} from '../telegram.constants';
import { Context } from '../interfaces/telegram.interface';
import { TelegramService } from '../telegram.service';
import { generateImageButtons } from '../telegram.buttons';
import { Voice } from 'telegraf/types';
import { TelegrafExceptionFilter } from 'src/filter/telegraf-exception.filter';
import { UseFilters } from '@nestjs/common';

@UseFilters(new TelegrafExceptionFilter())
@Scene(GENERATE_IMAGE_SCENE)
export class ImageGenerateScene {
  constructor(private readonly telegramService: TelegramService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    ctx.replyWithMarkdownV2('Describe the image I need to generate', {
      reply_markup: generateImageButtons(),
    });
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context) {
    await ctx.reply('You leaved service');
  }

  // ---------- Reset command ---------- //

  @Command('reset')
  async resetCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_SCENE);
  }

  // ---------- Generate Image Service stop button ---------- //

  @Hears(EXIT_GENERATE_IMAGE_SCENE)
  async stopService(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_SCENE);
  }

  // ---------- Generate Image ---------- //

  @On('text')
  async handleMessage(@Message('text') msg: string, @Ctx() ctx: Context) {
    await ctx.sendChatAction('typing');

    const response = await this.telegramService.imageGenerate(msg);

    ctx.replyWithPhoto(response);
  }

  // ---------- Voices transcription and send to Img generate service ---------- //

  @On('voice')
  async voiceTranscription(
    @Message('voice') linkUrl: Voice,
    @Ctx() ctx: Context,
  ) {
    const link = await ctx.telegram.getFileLink(linkUrl);
    const userId = String(ctx.message.from.id);

    const textVoice = await this.telegramService.getTextVoice(
      link.href,
      userId,
    );

    ctx.sendChatAction('typing');

    const imgGenerate = await this.telegramService.imageGenerate(textVoice);
    ctx.replyWithPhoto(imgGenerate);
  }
}
