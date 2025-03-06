import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export const usage = `usage text for root program ${name}`;

export const builder = (blackFlag, helpOrVersionSet, argv) => {
  console.log('builder called', blackFlag, helpOrVersionSet, argv);
  return { option: { boolean: true } };
};

export const handler = (argv) => {
  argv.handled_by = filepath;
};
