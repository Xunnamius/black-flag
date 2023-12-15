// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

let called = false;

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}`,
  builder: (_blackFlag) => {
    if (called) {
      throw new Error('error #2 thrown in builder');
    } else {
      called = true;
    }
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
