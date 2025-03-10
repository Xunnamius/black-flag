// @ts-check
/// <reference path="../index.d.ts"/>

const $executionContext = require('universe:exports/index.ts').$executionContext;

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  command: '$0 <custom1|custom2> [custom3] [custom4..]',
  builder: (bf, __, argv) => {
    bf.positional('custom1', { description: 'custom one' });
    bf.positional('custom2', { description: 'custom two' });
    bf.positional('custom3', { description: 'custom three' });
    bf.positional('custom4', { description: 'custom four' });

    if (argv) {
      argv[$executionContext].from_builder = {
        custom1: argv?.custom1,
        custom2: argv?.custom2,
        custom3: argv?.custom3,
        custom4: argv?.custom4
      };
    }
  },
  handler: () => {}
};
