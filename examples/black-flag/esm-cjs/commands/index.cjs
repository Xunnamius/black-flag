// @ts-check

/**
 * @type {() => import('@black-flag/core').RootConfiguration}
 */
module.exports = function command() {
  return {
    handler() {
      console.log('ran command at', __filename);
    }
  };
};
