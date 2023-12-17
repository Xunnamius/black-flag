// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ChildConfig}
 */
module.exports = {
  command: '$0 dummy-positional3',
  builder: (blackFlag) => {
    blackFlag.positional('dummy-positional3', { desc: 'Dummy description3' });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
