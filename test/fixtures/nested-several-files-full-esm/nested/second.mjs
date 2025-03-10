import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export default {
  aliases: ['child-2'],
  builder: { 'child-option2': { boolean: true } },
  deprecated: false,
  name: 's',
  command: '$0 [test-positional]',
  usage: 'USAGE: child program usage text',
  description: 'child program description text',
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
