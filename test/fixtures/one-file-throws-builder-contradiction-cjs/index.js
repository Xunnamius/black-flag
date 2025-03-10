/// <reference path="../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for root program ${name}`,
  builder: (blackFlag) => {
    return blackFlag.option(name, {
      choices: ['true', 'false'],
      // ? Unlike when using BFE, this will cause BF to crash due to yargs
      // ? seeing true !== 'true'. BF will attempt to generate help text with
      // ? respect to the argv context, which will throw again. This type of
      // ? cascading failure needs to be handled properly!
      default: true
    });
  },
  handler: async (argv) => {
    throw new Error('bad bad is not good');
  }
};
