import OpenAI from 'openai';

export interface IMessages
  extends OpenAI.Chat.CreateChatCompletionRequestMessage {}

export interface IResponseGpt extends OpenAI.Chat.ChatCompletion {}
