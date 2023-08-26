import { FilesService } from '../../files/files.service';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFfmpeg } from '../mocks/ ffmpeg.mock';
import { FluentFfmpegModule } from '@mrkwskiti/fluent-ffmpeg-nestjs';

describe('FilesService', () => {
  let filesService: FilesService;
  let mockFfmpeg: MockFfmpeg;

  beforeEach(async () => {
    mockFfmpeg = new MockFfmpeg();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [FluentFfmpegModule.forRoot()],
      providers: [
        FilesService,
        { provide: 'FluentFfmpegToken', useValue: mockFfmpeg },
      ],
    }).compile();

    filesService = moduleRef.get<FilesService>(FilesService);
  });
  it('should be defined fileServices', () => {
    expect(filesService).toBeDefined();
  });

  // ---------- toMp3 method test ---------- //

  describe('toMp3', () => {
    // const input = 'input';
    // const output = 'output';
    it('should convert audio file to mp3', async () => {});
  });
});
