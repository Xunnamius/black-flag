// @ts-check

import { sharedBuilder, sharedHandler } from '../shared.js';

/**
 * @type {() => import('@black-flag/core').RootConfiguration}
 */
export default function command() {
  return {
    builder: sharedBuilder({
      flag: { string: true, description: 'An option specific to this command' }
    }),

    handler: sharedHandler((argv) => {
      console.log('(custom functionality) argv:', argv);
    })
  };
}
