// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {() => import('@black-flag/core').RootConfiguration<{ key: 'one' |
 * 'two' | 'three'; value: string }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      '. Try using --help along with various values of --key for specialized help text.',

    description: "Demonstrate Black Flag's dynamic options support",

    builder(bf, _, argv) {
      bf.example('$0 --help', '');
      bf.example('$0 --key one --help', '');
      bf.example('$0 --key two --help', '');
      bf.example('$0 --key three --value three-2', '');

      bf.group(['key', 'value'], 'Important Options:');

      if (argv?.key === 'one') {
        return {
          key: { choices: ['one'] },
          value: { choices: ['one-1', 'one-2', 'one-3'] }
        };
      } else if (argv?.key === 'two') {
        return {
          key: { choices: ['two'] },
          value: { choices: ['two-1', 'two-2', 'two-3'] }
        };
      } else if (argv?.key === 'three') {
        return {
          key: { choices: ['three'] },
          value: { choices: ['three-1', 'three-2', 'three-3'] }
        };
      }

      return {
        key: { choices: ['one', 'two', 'three'], demandOption: true },
        value: { string: true }
      };

      // For an easier time setting dynamic defaults, see:
      // ./examples/black-flag-extensions/myctl
    },

    handler(argv) {
      console.log('key:', argv.key);
      console.log('value:', argv.value);
    }
  };
}
