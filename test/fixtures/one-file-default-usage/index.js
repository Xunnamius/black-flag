// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  name: 'custom-name',
  description: 'custom-description',
  command: '$0 <custom-param-1|custom-param-2> [custom-param-3..]',
  builder: (yargs) => {
    return yargs.option(name, { boolean: true });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
