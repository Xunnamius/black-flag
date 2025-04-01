export function sharedBuilder(
  /** @type {import('@black-flag/core').Configuration['builder']} */ customBuilder
) {
  /**
   * @type {Extract<import('@black-flag/core').Configuration['builder'], function>}
   */
  return function (bf, helpOfVersionSet, argv) {
    bf.group(['help', 'standard'], 'Global Options:');

    const incomingBuilder =
      typeof customBuilder === 'function'
        ? customBuilder(bf, helpOfVersionSet, argv) || {}
        : customBuilder;

    bf.updateStrings({ 'Options:': 'Local Options:' });

    return {
      standard: { number: true, description: 'An option common to all commands' },
      ...incomingBuilder
    };
  };
}

export function sharedHandler(
  /** @type {(argv: import('@black-flag/core').Arguments) => void | Promise<void>} */ customHandler
) {
  return function (/** @type {import('@black-flag/core').Arguments} */ argv) {
    console.log('standard functionality');
    return customHandler(argv);
  };
}
