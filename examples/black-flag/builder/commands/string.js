// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').ChildConfiguration<{ message?: string, path?:
 * string, config?: object, configCustom?: object }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      `This command demonstrates: string, config, configParser, normalize
`,

    builder(bf) {
      bf.example('$0 --config ./config.json', '');
      bf.example('$0 --config-custom ./config.json', '');
      bf.example(String.raw`$0 --path ./some/./path/../component`, '');
      bf.example('$0 --message "some output message"', '');

      return {
        config: {
          config: true
        },
        'config-custom': {
          config: true,
          configParser() {
            return { message: 'hello from custom JSON config landia!' };
          }
        },
        path: {
          string: true,
          normalize: true
        },
        message: {
          string: true
        }
      };
    },

    handler(argv) {
      console.log('config:', argv.config);
      console.log('config-custom:', argv.configCustom);
      console.log('path:', argv.path);
      console.log('message:', argv.message);
    }
  };
}
