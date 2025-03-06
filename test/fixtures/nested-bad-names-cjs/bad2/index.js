// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ChildConfig}
 */
module.exports = {
  name: '$111',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
