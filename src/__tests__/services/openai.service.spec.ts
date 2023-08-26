import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService, GptRole } from '../../openai/openai.service';
import OpenAI from 'openai';
import { OpenAIApiMock } from '../mocks/openai.mock';
import { FilesService } from 'src/files/files.service';
import { MockFilesService } from 'src/__tests__/mocks/files.service.mock';

describe('OpenAiService', () => {
  let openAiService: OpenAiService;
  let mockFilesService: MockFilesService;
  let mockOpenAIApi: OpenAIApiMock;

  beforeEach(async () => {
    mockOpenAIApi = new OpenAIApiMock();
    mockFilesService = new MockFilesService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        OpenAiService,
        { provide: OpenAI, useValue: mockOpenAIApi },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile();

    openAiService = moduleRef.get<OpenAiService>(OpenAiService);
  });

  it('should be defined openAiService', () => {
    expect(openAiService).toBeDefined();
  });

  // ---------- Chat test ---------- //

  describe('chat', () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Hello, this is a response.',
          },
        },
      ],
    };

    const messages = [
      {
        role: GptRole.USER,
        content: 'You are a helpful assistant.',
      },
    ];

    const errMsg = 'Error chatting with GPT';
    // ---------- Success Chat test ---------- //

    it('should return response content on success', async () => {
      mockOpenAIApi.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await openAiService.chat(messages);

      expect(result).toEqual('Hello, this is a response.');
      expect(mockOpenAIApi.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages,
      });
    });

    // ---------- Error Chat test ---------- //

    it('should throw an error on failure', async () => {
      mockOpenAIApi.chat.completions.create.mockRejectedValue(
        new Error(errMsg),
      );
      await expect(openAiService.chat(messages)).rejects.toThrow(errMsg);
    });
  });

  // ---------- Image Generation test ---------- //

  describe('imageGeneration', () => {
    const mockResponse = {
      data: [
        {
          url: 'https://test.png',
        },
      ],
    };
    const message = 'Cat at sunrise';
    const errMsg = 'Error Image Generating';

    // ---------- Success Image Generation test ---------- //

    it('Should return image url', async () => {
      mockOpenAIApi.images.generate.mockResolvedValue(mockResponse);
      const result = await openAiService.imageGeneration(message);

      expect(result).toEqual(mockResponse.data[0].url);
      expect(mockOpenAIApi.images.generate).toHaveBeenCalledWith({
        prompt: message,
        n: 1,
        size: '1024x1024',
      });
    });

    // ---------- Error Image Generation test ---------- //

    it('should throw an error on failure', async () => {
      mockOpenAIApi.images.generate.mockRejectedValue(new Error(errMsg));
      await expect(openAiService.imageGeneration(message)).rejects.toThrow(
        errMsg,
      );
    });
  });

  // ---------- Transcription test ---------- //

  describe('transcription', () => {
    const mockRes = {
      text: 'Transcription successful',
    };
    const filePath = 'test';
    const errMsg = 'Error transcription';
    // ---------- Success Transcription test ---------- //

    it('Should return voice transcription', async () => {
      mockOpenAIApi.audio.transcriptions.create.mockResolvedValueOnce(mockRes);

      const res = await openAiService.transcription(filePath);
      expect(res).toEqual('Transcription successful');
      expect(mockFilesService.removeFile).toHaveBeenCalledWith(filePath);
      expect(mockOpenAIApi.audio.transcriptions.create).toHaveBeenCalledWith({
        file: expect.anything(),
        model: 'whisper-1',
      });
    });

    // ---------- Error Transcription test ---------- //

    it('Should throw an error on failure transcription', async () => {
      mockOpenAIApi.audio.transcriptions.create.mockRejectedValue(
        new Error(errMsg),
      );

      await expect(openAiService.transcription('test')).rejects.toThrow(errMsg);
    });
  });
});
