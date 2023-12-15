// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}`,
  builder: (_blackFlag) => {
    throw new Error('error #1 thrown in builder');
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
