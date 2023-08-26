import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { dirname, resolve } from 'path';
import axios from 'axios';
import { InjectFluentFfmpeg, Ffmpeg } from '@mrkwskiti/fluent-ffmpeg-nestjs';
import { path } from '@ffmpeg-installer/ffmpeg';
import { unlink } from 'fs/promises';

@Injectable()
export class FilesService {
  constructor(@InjectFluentFfmpeg() private readonly ffmpeg: Ffmpeg) {
    ffmpeg.setFfmpegPath(path);
  }

  // ---------- Create Voice File ---------- //

  async createVoice(url: string, fileName: string): Promise<string> {
    return this.downloadFile(url, fileName, 'ogg');
  }

  // ---------- Download and save File ---------- //

  async downloadFile(
    url: string,
    fileName: string,
    fileExt: string,
  ): Promise<string> {
    try {
      const filePath = resolve(
        __dirname,
        `../../files`,
        `${fileName}.${fileExt}`,
      );

      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      return new Promise(resolve => {
        const stream = createWriteStream(filePath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(filePath));
      });
    } catch (error) {
      console.log(`Error creating ${fileExt} file`, error.message);
      throw Error(`Error creating ${fileExt} file`);
    }
  }

  // ---------- Converting ogg to mp3 ---------- //

  async toMp3(input: string, output: string): Promise<string> {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);

      return new Promise((resolve, reject) => {
        this.ffmpeg(input)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', () => {
            this.removeFile(input);
            resolve(outputPath);
          })
          .on('error', err => reject(err.message))
          .run();
      });
    } catch (error) {
      console.log('Error creating mp3', error.message);
      throw Error('Error creating mp3');
    }
  }

  // ---------- Remove Created File File ---------- //

  async removeFile(path: string) {
    try {
      await unlink(path);
    } catch (error) {
      console.log('Error removing files', error.message);
      throw Error('Error removing files');
    }
  }
}
