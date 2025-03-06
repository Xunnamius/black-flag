// @ts-check
/// <reference path="../index.d.ts"/>

// * Exports async function to test handling async exports...
/**
 * @type {Type.ConfigModule}
 */
module.exports = async (context) => {
  const { dirname, basename } = require('node:path');
  const name = basename(dirname(__filename));

  /**
   * @type {Type.RootConfig}
   */
  const commandModule = {
    usage: `usage text for root program ${name}`,
    description: `description for root program ${name}`,
    builder: (blackFlag) => {
      return blackFlag.option(name, { count: true });
    },
    handler: (argv) => {
      argv.handled_by = __filename;
    }
  };

  // * ... as well as accessing/mutating global context
  context.effected = true;

  return commandModule;
};
