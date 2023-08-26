import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FluentFfmpegModule } from '@mrkwskiti/fluent-ffmpeg-nestjs';

@Module({
  imports: [FluentFfmpegModule.forRoot()],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
