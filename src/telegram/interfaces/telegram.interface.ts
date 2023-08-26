import { Context as ContextTelegraf } from 'telegraf';
import { Message } from 'telegraf/types';
import { SceneContext, SceneSession } from 'telegraf/typings/scenes';

// ---------- Custom interface Context ---------- //

export interface Context extends ContextTelegraf, SceneContext {
  session: ISessionCustom;
}

export interface ISessionCustom extends SceneSession {
  messages: any[];
}

// ---------- Custom Message type ---------- //

interface IMessage {
  text: string;
}

export type TMessage = IMessage & Message;
