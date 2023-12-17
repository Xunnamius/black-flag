// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  command: '$0 dummy-positional1',
  builder: (blackFlag) => {
    blackFlag.positional('dummy-positional1', { desc: 'Dummy description1' });
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
