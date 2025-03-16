import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  usage: `usage text for root program ${name}`,
  builder: (blackFlag) => {
    blackFlag.parserConfiguration({ 'unknown-options-as-args': true });

    return {
      'script-options': {
        alias: 'options',
        array: true,
        default: [],
        description: 'Command-line arguments passed through npm to the script being run'
      },
      'skip-packages': {
        alias: ['skip', 'skip-package'],
        string: true,
        array: true,
        default: [],
        description: 'Exclude one or more packages (by name) via regular expression'
      }
    };
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
