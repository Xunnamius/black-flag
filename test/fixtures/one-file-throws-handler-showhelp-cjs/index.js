/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}\n\nSecond line.\n\nThird Line.`,
  builder: (blackFlag) => {
    return blackFlag.option('show-help', {
      choices: ['true', 'false', 'default', 'short', 'full', 'undefined'],
      demandOption: true
    });
  },
  handler: async (argv) => {
    const showHelp = argv.showHelp === 'true'
    ? true
    : argv.showHelp === 'false'
      ? false
      : argv.showHelp === 'undefined'
        ? undefined
        : argv.showHelp;

    throw new (await import('universe:error.ts')).CliError('problems!', {
      showHelp: argv.showHelp
    });
  }
};
