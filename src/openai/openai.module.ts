import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { FilesModule } from 'src/files/files.module';
import OpenAI from 'openai';

@Module({
  imports: [FilesModule],
  providers: [OpenAiService, OpenAI],
  exports: [OpenAiService],
})
export class OpenAiModule {}
