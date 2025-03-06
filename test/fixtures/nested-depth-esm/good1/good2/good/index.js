import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  description: `description for parent program ${name}`,
  builder: (blackFlag) => {
    return blackFlag.option(name, { count: true });
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
