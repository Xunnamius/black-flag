// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
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
    argv.handled_by = __filename;
  }
};
