// @ts-check

/**
 * @type {import('@black-flag/core').RootConfiguration['builder']}
 */
export const builder = (bf) => {
  bf.example('$0 --help', '');
  bf.example('$0 recommended --help', '');
  bf.example('$0 recommended cjs --help', '');
};
