import { Context } from '../../telegram/interfaces/telegram.interface';

export class MockContext implements Partial<Context> {
  session: {
    __scenes: any;
    messages: any[];
  } = {
    __scenes: {},
    messages: [],
  };
}
