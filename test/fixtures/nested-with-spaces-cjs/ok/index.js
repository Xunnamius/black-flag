// @ts-check
/// <reference path="../../index.d.ts"/>

/**
 * @type {Type.ParentConfig}
 */
module.exports = {
  name: 's p a c e d name',
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
