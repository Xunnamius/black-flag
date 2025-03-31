/**
 * @type {import('@black-flag/core').ConfigureExecutionPrologue}
 */
export function configureExecutionPrologue(_, { commands }) {
  for (const {
    programs: { effector }
  } of commands.values()) {
    effector.strict(false).parserConfiguration({ 'unknown-options-as-args': true });
  }
}
