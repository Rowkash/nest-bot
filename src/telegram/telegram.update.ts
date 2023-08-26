import { Start, Update, Ctx, Command } from 'nestjs-telegraf';
import { Context } from './interfaces/telegram.interface';
import { MAIN_SCENE } from './telegram.constants';

@Update()
export class TelegramUpdate {
  constructor() {}

  // ---------- /start command ---------- //

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    ctx.reply('Hello my friend');
    await ctx.scene.enter(MAIN_SCENE);
  }

  // ---------- Reset command ---------- //

  @Command('reset')
  async resetCommand(@Ctx() ctx: Context) {
    await ctx.scene.enter(MAIN_SCENE);
  }
}
