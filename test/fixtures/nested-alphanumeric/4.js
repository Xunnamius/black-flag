// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.ChildConfig}
 */
module.exports = {
  name: 'four',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
