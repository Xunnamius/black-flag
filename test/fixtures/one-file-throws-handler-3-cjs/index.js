// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}\n\nSecond line.\n\nThird Line.\n\n`,
  builder: (blackFlag) => {
    return blackFlag.option(name, { boolean: true });
  },
  handler: async (_argv) => {
    throw new (await import('universe:error.ts')).CliError('dead');
  }
};
