// @ts-check

export const command = '$0 <type> <value>';

/**
 * @type {Extract<import('@black-flag/core').ChildConfiguration<{ type: 'string' | 'boolean', value: string, force: boolean }>['builder'], function>}
 */
export function builder(blackFlag, _, argv) {
  blackFlag.positional('type', {
    description: 'The type of the value you want to pass in',
    choices: ['string', 'boolean']
  });

  blackFlag.positional('value', {
    description: 'The value you want to pass in',
    ...(argv?.type ? { type: argv.type } : {})
  });

  return {
    force: {
      alias: 'f',
      boolean: true,
      description: 'Override protections',
      default: false
    }
  };
}

export async function handler(
  /** @type {import('@black-flag/core').Arguments<{ type: 'string' | 'boolean',
   * value: string, force: boolean },
   * import('@black-flag/core/util').ExecutionContext>} */ { type, value, force }
) {
  if (force) {
    console.log('Running with --force, recommended protections DISABLED!');
  }

  console.log(`Doing something with ${type} value: ${value}`);
}
