// @ts-check
/// <reference path="../../../../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.ParentConfig}
 */
module.exports = {
  description: `description for parent program ${name}`,
  builder: (blackFlag) => {
    return blackFlag.option(name, { count: true });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
