import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const filename = basename(filepath);

export const command = '$0 [test-positional]';

export const description = `description for child program ${filename}`;

export const handler = async (argv) => {
  argv.handled_by = filepath;
};
