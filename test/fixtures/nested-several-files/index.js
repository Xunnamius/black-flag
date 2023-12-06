// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
const commandModule = {
  aliases: ['root'],
  builder: { option: { boolean: true } },
  deprecated: false,
  name: 'nsf',
  command: '$0 test-positional',
  usage: 'root program usage text',
  description: 'root program description text',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};

module.exports = commandModule;
