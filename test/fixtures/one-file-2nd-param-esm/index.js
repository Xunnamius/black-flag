import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  usage: `usage text for root program ${name}`,
  builder: (_, arg) => {
    console.log(arg);
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
