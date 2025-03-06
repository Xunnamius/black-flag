import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export default {
  aliases: ['child-3'],
  builder: { 'child-option3': { boolean: true } },
  deprecated: false,
  name: 't',
  command: '$0 test-positional',
  usage: 'USAGE: child program usage text',
  description: 'child program description text',
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
