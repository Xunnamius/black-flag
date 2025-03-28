// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').ChildConfiguration<{ values: unknown[] }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      `This command demonstrates: array, coerce, default, defaultDescription
`,

    builder(bf) {
      bf.example('$0 --values one two three', '');
      bf.example('$0 --values a b c', '');
      bf.example('$0 --values three --values four', '');
      bf.example('$0 --values "something else"', '');

      return {
        values: {
          array: true,
          default: ['nothing'],
          defaultDescription: 'the string "nothing"',
          coerce(args) {
            return args.map((arg) => {
              switch (arg) {
                case 'one': {
                  return 1;
                }

                case 'two': {
                  return 2;
                }

                case 'three': {
                  return 3;
                }
              }

              return arg;
            });
          }
        }
      };
    },

    handler(argv) {
      console.log('argv:', argv);
    }
  };
}
