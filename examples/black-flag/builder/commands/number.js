// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').ChildConfiguration<{ ints?: unknown[] }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      `This command demonstrates: number and nargs

This command also demonstrates the use of the yargs::check method.
`,

    builder(bf) {
      bf.example('$0 --ints 1 2 3', '');
      bf.example('$0 --ints 1 2 3.5', '(will exit with an error)');

      bf.check((argv) => !argv.ints || argv.ints.every((v) => Number.isInteger(v)));

      return {
        ints: { number: true, nargs: 3 }
      };
    },

    handler(argv) {
      console.log('ints:', argv.ints);
    }
  };
}
