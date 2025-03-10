import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export const aliases = ['root'];

export const builder = { option: { description: 'Some description', boolean: true } };

export const deprecated = true;

export const name = 'nsf';

export const command = '$0 [test-positional]';

export const usage = 'USAGE: root program usage text';

export const description = 'root program description text';

export const handler = async (argv) => {
  argv.handled_by = filepath;
  argv[(await import('universe:constant.ts')).$executionContext].mutated_by = filepath;
};
