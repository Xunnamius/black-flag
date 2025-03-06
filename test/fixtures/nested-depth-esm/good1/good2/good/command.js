import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const filename = basename(filepath);

export default {
  description: `description for child program ${filename}`,
  builder: (blackFlag) => {
    return blackFlag.option(filename.split('.')[0], { count: true });
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
