// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  description: `description for root program ${name}`,
  builder: (yargs) => {
    return yargs.option(name, { boolean: true });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
