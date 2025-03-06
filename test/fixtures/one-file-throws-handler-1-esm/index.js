import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  usage: `usage text for root program ${name}`,
  builder: (blackFlag) => {
    return blackFlag.option(name, { boolean: true });
  },
  handler: (_argv) => {
    throw new Error('error thrown in handler');
  }
};
