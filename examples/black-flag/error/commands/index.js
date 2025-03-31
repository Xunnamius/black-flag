// @ts-check

import { CliError, GracefulEarlyExitError } from '@black-flag/core';
import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {() => import('@black-flag/core').RootConfiguration<{ 'fail-style':
 * 'short' | 'full', 'fail-for-yargs': boolean, 'fail-for-cli': boolean,
 * 'fail-for-other': boolean, 'no-show-help': boolean, throw?: 'graceful' |
 * 'cli' | 'other' }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      'Use --throw to throw a specific type of error. To throw a Yargs error, enter an unknown argument.',

    builder(bf, _, argv) {
      bf.example('$0 --throw graceful', '');
      bf.example('$0 --throw cli', '');
      bf.example('$0 --fake', '');
      bf.example('$0 --fake --no-show-help', '');
      bf.example('$0 --throw other', '');
      bf.example('$0 --throw other --fail-for-other', '');
      bf.example('$0 --fake --fail-for-yargs false', '');

      bf.parserConfiguration({ 'boolean-negation': false });

      if (argv) {
        bf.showHelpOnFail(
          argv.noShowHelp
            ? false
            : {
                outputStyle: argv.failStyle,
                showFor: {
                  cli: argv.failForCli,
                  yargs: argv.failForYargs,
                  other: argv.failForOther
                }
              }
        );
      }

      return {
        'fail-style': { choices: ['short', 'full'], default: 'short' },
        'fail-for-yargs': { boolean: true, default: true },
        'fail-for-cli': { boolean: true, default: false },
        'fail-for-other': { boolean: true, default: false },
        'no-show-help': {
          boolean: true,
          default: false
          // We could do this in Black Flag Extensions, but vanilla Yargs does
          // not support this otherwise-intuitive use of `conflicts`!
          // conflicts: [
          //   'fail-for-style',
          //   'fail-for-yargs',
          //   'fail-for-cli',
          //   'fail-for-other'
          // ]
        },
        throw: {
          choices: ['graceful', 'cli', 'other']
        }
      };
    },

    handler(argv) {
      switch (argv.throw) {
        case 'graceful': {
          throw new GracefulEarlyExitError('thrown GracefulEarlyExit error');
          break;
        }

        case 'cli': {
          throw new CliError('thrown CLI error');
          break;
        }

        case 'other': {
          throw new Error('thrown error');
          break;
        }

        default: {
          console.log('hello, world!');
          break;
        }
      }
    }
  };
}
