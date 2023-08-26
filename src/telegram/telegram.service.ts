import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { GptRole, OpenAiService } from 'src/openai/openai.service';
import { Context } from './interfaces/telegram.interface';

@Injectable()
export class TelegramService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly fileService: FilesService,
  ) {}

  // ---------- Return answer from GPT ---------- //

  async answerGpt(msg: string, ctx: Context & any): Promise<string> {
    ctx.session.messages ??= [];

    ctx.session.messages.push({ role: GptRole.USER, content: msg });

    const gptReply = await this.openAiService.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: GptRole.ASSISTANT,
      content: gptReply,
    });
    return gptReply;
  }

  // ---------- Voice transcription ---------- //

  async getTextVoice(voiceLink: string, fileName: string): Promise<string> {
    const oggPath = await this.fileService.createVoice(voiceLink, fileName);
    const mp3Path = await this.fileService.toMp3(oggPath, fileName);

    return await this.openAiService.transcription(mp3Path);
  }

  // ---------- Generate image ---------- //

  async imageGenerate(msg: string) {
    return await this.openAiService.imageGeneration(msg);
  }
}
