// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ParentConfig}
 */
const commandModule = {
  aliases: ['parent', 'p'],
  builder: { option: { boolean: true } },
  deprecated: true,
  name: 'n',
  command: '$0 test-positional',
  usage: 'parent program usage text',
  description: 'parent program description text',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};

module.exports = commandModule;
