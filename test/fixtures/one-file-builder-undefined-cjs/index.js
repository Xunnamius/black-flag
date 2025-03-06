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
    blackFlag.options({ option: { number: true } });
    return undefined;
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
