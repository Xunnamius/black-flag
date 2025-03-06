import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export default {
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
