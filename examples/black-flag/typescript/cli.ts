import { runProgram } from '@black-flag/core';

import type { GlobalExecutionContext } from './configure.js';

export default runProgram<GlobalExecutionContext>(
  require.resolve('./commands'),
  require('./configure.js')
);
