// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ParentConfig}
 */
module.exports = {
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
