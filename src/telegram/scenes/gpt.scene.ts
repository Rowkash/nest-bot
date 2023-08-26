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
import { Context } from '../interfaces/telegram.interface';
import {
  GPT_SCENE,
  GPT_STOP,
  MAIN_SCENE,
  RESET_SESSION,
} from '../telegram.constants';
import { gptSceneButtons } from '../telegram.buttons';
import { TelegramService } from '../telegram.service';
import { Voice } from 'telegraf/types';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/filter/telegraf-exception.filter';

@UseFilters(new TelegrafExceptionFilter())
@Scene(GPT_SCENE)
export class GptScene {
  constructor(private readonly telegramService: TelegramService) {}

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: Context) {
    ctx.session.messages ??= [];
    ctx.reply('Ask questions', { reply_markup: gptSceneButtons() });
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: Context) {
    await ctx.reply('You leaved chat');
  }

  // ---------- Reset command ---------- //

  @Command('reset')
  async resetCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_SCENE);
  }

  // ---------- GPT stop chat button ---------- //

  @Hears(GPT_STOP)
  async stopTalk(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_SCENE);
  }

  // ---------- Reset chat history with GPT ---------- //

  @Hears(RESET_SESSION)
  async resetChat(@Ctx() ctx: Context) {
    if (ctx.session.messages && ctx.session.messages.length > 0) {
      ctx.session.messages = [];
      ctx.reply('Message history deleted');
    } else {
      ctx.reply('Message history empty');
    }
  }

  // ---------- Chat with GPT ---------- //

  @On('text')
  async handleMessage(@Message('text') msg: string, @Ctx() ctx: Context) {
    await ctx.sendChatAction('typing');
    const response = await this.telegramService.answerGpt(msg, ctx);

    ctx.reply(response);
  }

  // ---------- Voices transcription and send to GPT ---------- //

  @On('voice')
  async voiceTranscription(
    @Message('voice') linkUrl: Voice,
    @Ctx() ctx: Context,
  ) {
    const link = await ctx.telegram.getFileLink(linkUrl);
    const userId = String(ctx.message.from.id);

    ctx.sendChatAction('typing');

    const textVoice = await this.telegramService.getTextVoice(
      link.href,
      userId,
    );
    const answerGPT = await this.telegramService.answerGpt(textVoice, ctx);
    ctx.reply(answerGPT);
  }
}
