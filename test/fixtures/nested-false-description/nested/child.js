// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ChildConfig}
 */
module.exports = {
  description: false,
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
