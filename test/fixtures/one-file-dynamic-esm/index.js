import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export default {
  builder: (blackFlag, __, argv) => {
    blackFlag.parserConfiguration({ 'parse-numbers': false });

    if (argv) {
      if (argv.lang === 'node') {
        return {
          lang: { choices: ['node'] },
          version: { choices: ['19.8', '20.9', '21.1'] }
        };
      } else {
        return {
          lang: { choices: ['python'] },
          version: {
            choices: ['3.10', '3.11', '3.12']
          }
        };
      }
    } else {
      return {
        lang: { choices: ['node', 'python'] },
        version: { string: true }
      };
    }
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
