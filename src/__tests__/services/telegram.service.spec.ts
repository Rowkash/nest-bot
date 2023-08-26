import { Test } from '@nestjs/testing';
import { TelegramService } from '../../telegram/telegram.service';
import { MockFilesService } from '../mocks/files.service.mock';
import { TestingModule } from '@nestjs/testing';
import { GptRole, OpenAiService } from '../../openai/openai.service';
import { FilesService } from '../../files/files.service';
import { MockOpenAIService } from '../mocks/openai.service.mock';
import { MockContext } from '../mocks/context.mock';

describe('TelegramService', () => {
  let telegramService: TelegramService;
  let mockOpenAiService: MockOpenAIService;
  let mockFilesService: MockFilesService;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockOpenAiService = new MockOpenAIService();
    mockFilesService = new MockFilesService();
    mockCtx = new MockContext();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TelegramService,
        { provide: FilesService, useValue: mockFilesService },
        { provide: OpenAiService, useValue: mockOpenAiService },
      ],
    }).compile();

    telegramService = moduleRef.get<TelegramService>(TelegramService);
  });
  it('should be defined telegramService', () => {
    expect(telegramService).toBeDefined();
  });

  // ---------- imageGenerate method test ---------- //

  describe('imageGenerate', () => {
    const mockRes = 'url';
    const msg = 'cat';
    it('should return image url', async () => {
      mockOpenAiService.imageGeneration.mockResolvedValue(mockRes);
      const result = await telegramService.imageGenerate(msg);
      expect(result).toEqual(mockRes);
      expect(mockOpenAiService.imageGeneration).toHaveBeenCalledWith(msg);
    });
  });

  // ---------- getTextVoice method test ---------- //

  describe('getTextVoice', () => {
    const mockRes = 'transcription';
    const oggPath = 'oggPath';
    const mp3Path = 'mp3Path';
    const voiceUrl = 'voiceUrl';
    const fileName = 'fileName';
    it('should return voice transcription', async () => {
      mockFilesService.createVoice.mockResolvedValue(oggPath);
      mockFilesService.toMp3.mockResolvedValue(mp3Path);
      mockOpenAiService.transcription.mockResolvedValue(mockRes);

      const result = await telegramService.getTextVoice(voiceUrl, fileName);
      expect(result).toEqual(mockRes);
      expect(mockFilesService.createVoice).toHaveBeenCalledWith(
        voiceUrl,
        fileName,
      );
      expect(mockFilesService.toMp3).toHaveBeenCalledWith(oggPath, fileName);
      expect(mockOpenAiService.transcription).toHaveBeenCalledWith(mp3Path);
    });
  });

  // ---------- answerGpt method test ---------- //

  describe('answerGpt', () => {
    const mockRes = "Hello. I'm GPT";
    const mockMsg = 'Hello';

    it('should return answer from GPT to User', async () => {
      mockOpenAiService.chat.mockResolvedValue(mockRes);

      const result = await telegramService.answerGpt(mockMsg, mockCtx);

      expect(result).toEqual(mockRes);
      expect(mockCtx.session.messages).toEqual([
        { role: GptRole.USER, content: mockMsg },
        { role: GptRole.ASSISTANT, content: mockRes },
      ]);
      expect(mockOpenAiService.chat).toHaveBeenCalledWith(
        mockCtx.session.messages,
      );
    });
  });
});
