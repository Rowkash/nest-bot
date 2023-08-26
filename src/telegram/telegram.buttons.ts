import {
  EXIT_GENERATE_IMAGE_SCENE,
  GENERATE_IMAGE_START,
  GPT_START,
  GPT_STOP,
  RESET_SESSION,
} from './telegram.constants';
import { ReplyKeyboardMarkup } from 'telegraf/types';

// ---------- Main Scene ---------- //

export function startButtons(): ReplyKeyboardMarkup {
  return {
    keyboard: [[{ text: GPT_START }, { text: GENERATE_IMAGE_START }]],
    resize_keyboard: true,
  };
}

// ---------- GPT Scene ---------- //

export function gptSceneButtons() {
  return {
    keyboard: [[{ text: GPT_STOP }, { text: RESET_SESSION }]],
    resize_keyboard: true,
  };
}

// ---------- Image Generate Scene ---------- //

export function generateImageButtons(): any {
  return {
    keyboard: [[{ text: EXIT_GENERATE_IMAGE_SCENE }]],
    resize_keyboard: true,
  };
}
