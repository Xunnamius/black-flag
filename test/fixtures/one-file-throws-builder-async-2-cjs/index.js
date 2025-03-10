// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  builder: (_blackFlag) => { return Promise.resolve() },
  handler: () => {
    throw new Error('should never get this far')
  }
};
