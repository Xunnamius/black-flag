// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}`,
  builder: (yargs) => {
    return yargs.option(name, { boolean: true });
  },
  handler: async (_argv) => {
    throw new (await import('universe/error')).GracefulEarlyExitError();
  }
};
