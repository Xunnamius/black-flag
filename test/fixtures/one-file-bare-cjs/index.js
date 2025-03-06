// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
