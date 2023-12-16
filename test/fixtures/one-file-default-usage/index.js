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
  command: '$0 <custom1|custom2> [custom3..]',
  builder: (blackFlag) => {
    return blackFlag.option(name, { boolean: true });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
