// @ts-check

/**
 * @type {Extract<import('@black-flag/core').RootConfiguration['builder'], Function>}
 */
export function builder(bf) {
  bf.example('$0', '');
  bf.example('$0 --help', '');
  bf.example('$0 --something "goes here"', '');
  bf.example('$0 --error-on-purpose', '');

  return {
    something: {
      string: true
    }
  };
}

export function handler() {
  console.log('ran command');
}
