// @ts-check
/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.ConfigModule}
 */
module.exports = async function () {
  const GracefulEarlyExitError = (await import('universe:error.ts')).GracefulEarlyExitError;

  return {
    usage: `usage text for root program ${name}`,
    builder: (_blackFlag) => {
      throw new GracefulEarlyExitError();
    },
    handler: (argv) => {
      argv.handled_by = __filename;
    }
  };
};
