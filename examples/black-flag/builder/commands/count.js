// @ts-check

import { defaultUsageText } from '@black-flag/core/util';

/**
 * @type {(context: import('@black-flag/core/util').ExecutionContext) =>
 * import('@black-flag/core').ChildConfiguration<{ u: number, v: number, w:
 * number, x?: unknown, y?: unknown }>}
 */
export default function command() {
  return {
    usage:
      defaultUsageText +
      `This command demonstrates: count, group, hidden, implies
`,

    builder(bf) {
      bf.example('$0 -vvv', '');
      bf.example('$0 -u -v -ww', '');
      bf.example('$0 -x -y', '');
      bf.example('$0 -y', '');

      return {
        u: { count: true, group: 'Count Options:' },
        v: { count: true, group: 'Count Options:' },
        w: { count: true, group: 'Count Options:', hidden: true },
        x: { implies: 'y' },
        y: {}
      };
    },

    handler(argv) {
      console.log('u:', argv.u);
      console.log('v:', argv.v);
      console.log('w:', argv.w);
      console.log('x:', argv.x);
      console.log('y:', argv.y);
    }
  };
}
