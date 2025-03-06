import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export default function command() {
  return {
    aliases: ['parent', 'p'],
    builder: { option2: { boolean: true } },
    deprecated: true,
    name: 'n',
    command: '$0 test-positional',
    usage: 'USAGE: parent program usage text',
    description: 'parent program description text',
    handler: (argv) => {
      argv.handled_by = filepath;
    }
  };
}
