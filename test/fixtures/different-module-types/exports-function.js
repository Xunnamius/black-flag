// @ts-check
/// <reference path="../index.d.ts"/>

// * We're also making sure ImportedConfigurationModule works as advertised

/**
 * @type {Type.ConfigModule}
 */
module.exports = async (context) => {
  const filename = require('node:path').basename(__filename);

  context.affected = true;

  return {
    description: `description for child program ${filename}`,
    builder: (yargs) => {
      return yargs.option(filename.split('.')[0], { count: true });
    },
    handler: (argv) => {
      argv.handled_by = __filename;
    }
  };
};
