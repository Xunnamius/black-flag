/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const BfcErrorMessage = {
  BadType(name: string, expected: string, actual: string) {
    return `expected the ${name} option to be of type "${expected}", given "${actual}"`;
  },
  OptionMustBeNonNegative(name: string) {
    return `option "${name}" must have a non-negative value`;
  },
  OptionMustNotBeFalsy(name: string) {
    return `option "${name}" must have a non-empty (non-falsy) value`;
  },
  OptionValueMustBeAlone(option: string, noun: string) {
    return `the "${option}" ${noun} must not be given alongside any others`;
  },
  OptionValueMustBeAloneWhenBaseline(option: string, noun: string) {
    return (
      BfcErrorMessage.OptionValueMustBeAlone(option, noun) + ' when using --baseline'
    );
  },
  OptionRequiresMinArgs(name: string, adjective?: string) {
    return `array option "${name}" requires at least one ${adjective ? `${adjective} ` : ''} value`;
  },
  OptionRequiresNoConflicts(name: string, tuple: unknown[]) {
    return `array option "${name}" allows only one of the following values: ${tuple.join(', ')}`;
  },
  OptionRequiresUniqueArgs(name: string) {
    return `array option "${name}" must contain only unique values`;
  }
};
