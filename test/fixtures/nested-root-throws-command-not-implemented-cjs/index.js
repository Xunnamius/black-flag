// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  handler: async () => {
    throw new (await import('universe:error.ts')).CommandNotImplementedError();
  }
};
