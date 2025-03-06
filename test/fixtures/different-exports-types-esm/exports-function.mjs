import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

export default function command(context) {
  const filepath = fileURLToPath(import.meta.url);
  const filename = basename(filepath);

  context.affected = true;

  return {
    description: `description for child program ${filename}`,
    builder: (_blackFlag) => {
      return { [filename.split('.')[0]]: { count: true } };
    },
    handler: async (argv) => {
      argv.handled_by = filepath;
    }
  };
}
