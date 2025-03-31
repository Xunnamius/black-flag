// @ts-check

import { $executionContext } from '@black-flag/core';
import { defaultUsageText } from '@black-flag/core/util';

// This is all much less cumbersome and verbose if you're using TypeScript!

/**
 * @type {Extract<import('@black-flag/core').ChildConfiguration<{ name: string, id:
 * string, force: boolean }>['builder'], function>}
 */
export function builder(blackFlag, _, argv) {
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
}

/**
 * @type {import('@black-flag/core').ChildConfiguration['command']}
 */
export const command = '$0 <name> <id>';

/**
 * @type {import('@black-flag/core').ChildConfiguration['description']}
 */
export const description = 'Add a new remote';

export async function handler(
  /** @type {import('@black-flag/core').Arguments<{ name: string; id: string; force: boolean; }, import('@black-flag/core/util').ExecutionContext>} */ {
    name,
    id,
    force,
    [$executionContext]: context
  }
) {
  if (force) {
    console.log('Running with --force, recommended protections DISABLED!');
  }

  console.log(`Added new remote "${name}": ${id}`);
  console.log('Saw context.somethingSpecial:', context.somethingSpecial);
}

/**
 * @type {import('@black-flag/core').ChildConfiguration['usage']}
 */
export const usage = `${defaultUsageText}.

You can also provide long-form explanatory text here that will only be displayed when --help is given. Long-form usage text will not be shown when errors occur by default, but this can be configured using \`configureExecutionContext\`.

See the documentation for more details.`;
