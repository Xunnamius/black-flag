// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.ChildConfig}
 */
module.exports = {
  usage: 'usage text for child program',
  builder: (blackFlag) => {
    return blackFlag.option(name, { boolean: true });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
