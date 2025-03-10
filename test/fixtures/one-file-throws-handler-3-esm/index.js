import { dirname, basename } from 'node:path';

const name = basename(dirname(__filename));

export default {
  usage: `usage text for root program ${name}\n\nSecond line.\n\nThird Line.\n\n`,
  builder: (blackFlag) => {
    return blackFlag.option(name, { boolean: true });
  },
  handler: async (_argv) => {
    throw new (await import('universe:error.ts')).CliError('dead');
  }
};
