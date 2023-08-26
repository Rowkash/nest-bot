import { path } from '@ffmpeg-installer/ffmpeg';

export class MockFfmpeg {
  constructor() {
    this.setFfmpegPath(path);
  }

  setFfmpegPath = jest.fn();

  inputOption = jest.fn().mockReturnThis();

  output = jest.fn().mockReturnThis();

  on = jest.fn().mockReturnThis();

  run = jest.fn();
}
