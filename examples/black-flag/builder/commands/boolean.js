// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').ChildConfiguration<{ value?: boolean,
 * 'other-value'?: boolean }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      `This command demonstrates: boolean, conflicts, deprecated, description
`,

    builder(bf) {
      bf.example('$0 --value', '');
      bf.example('$0 --other-value', '');

      return {
        value: {
          boolean: true,
          conflicts: 'other-value',
          description: 'The latest version of --value'
        },
        'other-value': {
          boolean: true,
          deprecated: true,
          description: 'The old version of --value'
        }
      };
    },

    handler(argv) {
      console.log('argv:', argv);
    }
  };
}
