// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext & { custom:
 * { usage: string, choices: string[] } }) =>
 * import('@black-flag/core').RootConfiguration<{ value: string },
 * import('@black-flag/core/util').ExecutionContext & { custom: { usage: string,
 * choices: string[] } }>}
 */
export default function command(context) {
  return {
    usage:
      defaultUsageText +
      `Context value one: ${context.custom.usage}
`,

    builder() {
      return {
        value: { choices: context.custom.choices }
      };
    },

    handler(argv) {
      console.log('custom context:', context.custom);
      console.log('value:', argv.ints);
    }
  };
}
