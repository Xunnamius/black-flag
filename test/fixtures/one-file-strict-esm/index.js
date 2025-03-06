import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const filepath = fileURLToPath(import.meta.url);
const name = basename(dirname(filepath));

export default {
  usage: `usage text for root program ${name}`,
  builder: (blackFlag) => {
    blackFlag.strict(true).demandOption('good4');
    blackFlag.option('good1', { demandOption: true, boolean: true });
    blackFlag.options({
      good2: { demandOption: 'gotta love it!', boolean: true },
      good3: { demandOption: true, boolean: true },
      good4: { boolean: true },
    });

    return { good: { boolean: true, demandOption: 'gotta have it!' } };
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
