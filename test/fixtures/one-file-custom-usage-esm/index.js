import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  name: 'custom-name',
  description: 'custom-description $0 $1 $1 $0',
  command: '$0 <custom1|custom2> [custom3..]',
  usage: 'Usage: $0 - $1 - $000',
  builder: (blackFlag) => {
    return blackFlag.option(name, { boolean: true });
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
