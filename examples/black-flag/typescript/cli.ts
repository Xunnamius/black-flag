import { dirname } from 'node:path';

import { runProgram } from '@black-flag/core';

import type { GlobalExecutionContext } from './configure.js';

export default runProgram<GlobalExecutionContext>(
  dirname(require.resolve('./commands')),
  require('./configure.js')
);
