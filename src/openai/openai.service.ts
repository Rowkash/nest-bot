import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import OpenAI from 'openai';
import { FilesService } from 'src/files/files.service';
import { IMessages } from './interface/openai.interface';

export enum GptRole {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

@Injectable()
export class OpenAiService {
  constructor(
    private readonly fileService: FilesService,
    private openAi: OpenAI,
  ) {
    this.openAi.baseURL = process.env.OPENAI_PATH;
  }

  // ---------- Chat with GPT ---------- //

  async chat(messages: IMessages[]): Promise<string> {
    try {
      const response = await this.openAi.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return response.choices[0].message.content;
    } catch (error) {
      // console.log('Error chatting with GPT', error.message);
      throw new Error('Error chatting with GPT');
    }
  }

  // ---------- Voice Transcription ---------- //

  async transcription(filepath: string): Promise<string> {
    try {
      const file: any = createReadStream(filepath);
      const response = await this.openAi.audio.transcriptions.create({
        file,
        model: 'whisper-1',
      });
      await this.fileService.removeFile(filepath);

      return response.text;
    } catch (error) {
      // console.log('Error transcription', error.message);
      throw new Error('Error transcription');
    }
  }

  // ---------- Image Generation ---------- //

  async imageGeneration(msg: string): Promise<string> {
    try {
      const response = await this.openAi.images.generate({
        prompt: msg,
        n: 1,
        size: '1024x1024',
      });

      return response.data[0].url;
    } catch (error) {
      // console.log('Error Image Generating', error.status);
      throw new Error('Error Image Generating');
    }
  }
}
