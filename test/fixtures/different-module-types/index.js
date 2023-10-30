// @ts-check
/// <reference path="../index.d.ts"/>

// * Exports async function to test handling async exports...
module.exports = async (context) => {
  const {dirname, basename } = require('node:path');
  const name = basename(dirname(__filename));

  /**
   * @type {Type.RootConfig}
   */
  const commandModule = {
    description: `description for root program ${name}`,
    builder: (yargs) => {
      return yargs.option(name, { count: true });
    },
    handler: (argv) => {
      argv.handled_by = __filename;
    }
  };

  // * ... as well as accessing/mutating global context
  context.effected = true;

  return commandModule;
};
