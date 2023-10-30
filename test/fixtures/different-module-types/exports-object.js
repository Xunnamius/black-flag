// @ts-check
/// <reference path="../index.d.ts"/>

const filename = require('node:path').basename(__filename);

/**
 * @type {Type.ChildConfig}
 */
const commandModule = {
  command: '$0 test-positional',
  description: `description for child program ${filename}`,
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};

module.exports = commandModule;
