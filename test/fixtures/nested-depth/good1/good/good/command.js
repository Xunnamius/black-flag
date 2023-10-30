// @ts-check
/// <reference path="../../../../index.d.ts"/>

const filename = require('node:path').basename(__filename);

/**
 * @type {Type.ChildConfig}
 */
module.exports = {
  description: `description for child program ${filename}`,
  builder: (yargs) => {
    return yargs.option(filename.split('.')[0], { count: true });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
