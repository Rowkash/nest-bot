import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import RedisSession from 'telegraf-session-redis-upd';

const session = new RedisSession({
  store: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

@Injectable()
export class TelegrafConfigService implements TelegrafOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTelegrafOptions(): TelegrafModuleOptions {
    return {
      token: this.configService.get('TELEGRAM_BOT_TOKEN'),
      middlewares: [session.middleware()],
    };
  }
}
