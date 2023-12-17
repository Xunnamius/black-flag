// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ParentConfig}
 */
const commandModule = {
  aliases: ['parent', 'p'],
  builder: { option2: { boolean: true } },
  deprecated: true,
  name: 'n',
  command: '$0 test-positional',
  usage: 'USAGE: parent program usage text',
  description: 'parent program description text',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};

module.exports = commandModule;
