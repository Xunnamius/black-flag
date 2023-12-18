// @ts-check
/// <reference path="../../index.d.ts"/>

const { dirname, basename } = require('node:path');
const name = basename(dirname(__filename));

/**
 * @type {Type.RootConfig}
 */
module.exports = {
  usage: `usage text for parent program ${name}`,
  deprecated: 'deprecation message 2',
  handler: () => {
    console.log('ran', name);
  }
};
