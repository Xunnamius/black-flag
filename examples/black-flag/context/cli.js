#!/usr/bin/env node

import { runProgram } from '@black-flag/core';

export default runProgram(import.meta.resolve('./commands'), {
  configureExecutionContext(
    /** @type {import('@black-flag/core/util').ExecutionContext & { custom: { usage: string, choices: string[] } }} */ context
  ) {
    context.custom = {
      choices: ['context-choice-1', 'context-choice-2'],
      usage: 'usage text from context'
    };

    return context;
  }
});
