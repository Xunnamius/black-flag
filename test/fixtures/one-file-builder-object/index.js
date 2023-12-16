// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}`,
  builder: () => {
    return { option: { number: true } };
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
