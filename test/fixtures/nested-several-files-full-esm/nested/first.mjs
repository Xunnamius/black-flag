import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);

export const aliases = ['child-1'];

export const builder = () => ({ 'child-option1': { boolean: true } });

export const deprecated = true;

export const name = 'f';

export const command = '$0 test-positional';

export const usage = 'USAGE: child program usage text';

export const description = 'child program description text';

export const handler = (argv) => {
  argv.handled_by = filepath;
};
