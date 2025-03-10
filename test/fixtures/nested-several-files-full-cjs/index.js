// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
const commandModule = {
  aliases: ['root'],
  builder: { option: { description: 'Some description', boolean: true } },
  deprecated: true,
  name: 'nsf',
  command: '$0 [test-positional]',
  usage: 'USAGE: root program usage text',
  description: 'root program description text',
  handler: async (argv) => {
    argv.handled_by = __filename;
    argv[(await import('universe:constant.ts')).$executionContext].mutated_by = __filename;
  }
};

module.exports = commandModule;
