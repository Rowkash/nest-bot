export class OpenAIApiMock {
  chat = {
    completions: {
      create: jest.fn(),
    },
  };
  images = {
    generate: jest.fn(),
  };
  audio = {
    transcriptions: {
      create: jest.fn(),
    },
  };
}
