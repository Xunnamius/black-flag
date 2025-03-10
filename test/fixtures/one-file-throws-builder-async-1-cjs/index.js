// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  builder: async (_blackFlag) => {},
  handler: () => {
    throw new Error('should never get this far')
  }
};
