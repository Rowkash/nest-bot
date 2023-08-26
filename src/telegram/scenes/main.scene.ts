import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../interfaces/telegram.interface';
import { startButtons } from '../telegram.buttons';
import {
  GENERATE_IMAGE_SCENE,
  GENERATE_IMAGE_START,
  GPT_SCENE,
  GPT_START,
  MAIN_SCENE,
} from '../telegram.constants';

@Scene(MAIN_SCENE)
export class MainScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.reply('What do you want now', { reply_markup: startButtons() });
  }

  // ---------- GPT action start ---------- //

  @Hears(GPT_START)
  async startTalk(@Ctx() ctx: Context) {
    await ctx.scene.enter(GPT_SCENE);
  }

  // ---------- Image generate action start ---------- //

  @Hears(GENERATE_IMAGE_START)
  async startImageGenerate(@Ctx() ctx: Context) {
    await ctx.scene.enter(GENERATE_IMAGE_SCENE);
  }
}
