// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').ChildConfiguration<{ type: string, value: unknown
 * }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      `This command demonstrates: alias, choices, demandOption, type

This command also demonstrates the use of dynamic options: the "type" (e.g. boolean, string, count, number, etc) of --value changes depending on the value of --type.
`,

    builder(bf, _, argv) {
      bf.example('$0 --type boolean --value false', '');
      bf.example('$0 --type string --value something', '');
      bf.example('$0 --type count --value --value', '');
      bf.example('$0 --type number --value 5', '');

      if (argv?.type) {
        return {
          type: { alias: 't', demandOption: true },
          value: { alias: 'v', type: argv.type, demandOption: true }
        };
      }

      return {
        type: {
          alias: 't',
          choices: ['array', 'boolean', 'count', 'number', 'string'],
          demandOption: true
        },
        value: { alias: 'v', demandOption: true }
      };
    },

    handler(argv) {
      console.log('type:', argv.type);
      console.log('value:', argv.value);
    }
  };
}
