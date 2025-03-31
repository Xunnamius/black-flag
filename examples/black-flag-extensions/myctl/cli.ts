import { dirname } from 'node:path';

import { runProgram } from '@black-flag/core';

export default runProgram(dirname(require.resolve('./commands')));
