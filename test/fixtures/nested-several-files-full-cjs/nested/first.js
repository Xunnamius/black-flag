// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ChildConfig}
 */
const commandModule = {
  aliases: ['child-1'],
  builder: () => ({ 'child-option1': { boolean: true } }),
  deprecated: true,
  name: 'f',
  command: '$0 [test-positional]',
  usage: 'USAGE: child program usage text',
  description: 'child program description text',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};

module.exports = commandModule;
