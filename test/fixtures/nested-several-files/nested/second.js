// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ChildConfig}
 */
const commandModule = {
  aliases: ['child-2'],
  builder: { 'child-option': { boolean: true } },
  deprecated: false,
  name: 's',
  command: '$0 test-positional',
  usage: 'child program usage text',
  description: 'child program description text',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};

module.exports = commandModule;
