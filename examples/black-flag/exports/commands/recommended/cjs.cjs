// @ts-check

const { defaultUsageText } = require('@black-flag/core/util');

// This is my preferred command export syntax 🚀
// For the TypeScript version, see:
// examples/black-flag/typescript

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * Promise<import('@black-flag/core').ChildConfiguration<{ name: string, id:
 * string, force: boolean }>>}
 */
module.exports = async function command(context) {
  return {
    command: '$0 <name> <id>',
    description: 'Add a new remote',

    usage: `${defaultUsageText}.

You can also provide long-form explanatory text here that will only be displayed when --help is given. Long-form usage text will not be shown when errors occur by default, but this can be configured using \`configureExecutionContext\`.

See the documentation for more details.`,

    builder(blackFlag, _, argv) {
      blackFlag.positional('name', {
        description: `The name of the remote to${argv?.force ? ' forcibly' : ''} add`
      });

      blackFlag.positional('id', { description: 'The remote identifier' });

      return {
        force: {
          alias: 'f',
          boolean: true,
          description: 'Override protections',
          default: false
        }
      };
    },

    async handler({ name, id, force }) {
      if (force) {
        console.log('Running with --force, recommended protections DISABLED!');
      }

      console.log(`Added new remote "${name}": ${id}`);
      console.log('Saw context.somethingSpecial:', context.somethingSpecial);
    }
  };
};
