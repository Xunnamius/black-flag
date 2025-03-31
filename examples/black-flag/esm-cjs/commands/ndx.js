// @ts-check

/**
 * @type {() => import('@black-flag/core').RootConfiguration}
 */
export default function command() {
  return {
    handler() {
      console.log('ran command at', import.meta.filename);
    }
  };
}
