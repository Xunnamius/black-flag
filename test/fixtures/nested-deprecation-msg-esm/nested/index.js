import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  usage: `usage text for parent program ${name}`,
  deprecated: 'deprecation message 2',
  handler: () => {
    console.log('ran', name);
  }
};
