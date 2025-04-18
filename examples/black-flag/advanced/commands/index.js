// @ts-check

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').RootConfiguration}
 */
export default function command() {
  return {
    handler(argv) {
      console.log(argv.$0 + ':', argv._);
    }
  };
}
