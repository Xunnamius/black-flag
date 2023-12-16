// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

let called = false;

/**
 * @type {Type.ConfigModule}
 */
module.exports = async function () {
  const GracefulEarlyExitError = (await import('universe/error')).GracefulEarlyExitError;

  return {
    usage: `usage text for root program ${name}`,
    builder: (_blackFlag) => {
      if (called) {
        throw new GracefulEarlyExitError();
      } else {
        called = true;
      }
    },
    handler: (argv) => {
      argv.handled_by = __filename;
    }
  };
};
