#!/usr/bin/env node
// @ts-check

import { runProgram } from '@black-flag/core';

export default runProgram(import.meta.resolve('./commands'), {
  configureArguments(rawArgv, context) {
    console.log('configureArguments -> rawArgv:', rawArgv);
    console.log('configureArguments -> context:', context);
    return rawArgv;
  },
  configureErrorHandlingEpilogue(meta, argv, _context) {
    console.log('configureErrorHandlingEpilogue -> meta:', meta);
    console.log('configureErrorHandlingEpilogue -> argv:', argv);
    console.log('configureErrorHandlingEpilogue -> context:', '(the same)');
  },
  configureExecutionContext(context) {
    context.customContextKey = { custom: 'value' };
    console.log('configureExecutionContext -> context:', context);
    return context;
  },
  configureExecutionEpilogue(argv, _context) {
    console.log('configureExecutionEpilogue -> argv:', argv);
    console.log('configureExecutionEpilogue -> context:', '(the same)');
    return argv;
  },
  configureExecutionPrologue(rootPrograms, _context) {
    console.log('configureExecutionPrologue -> rootPrograms:', rootPrograms);
    console.log('configureExecutionPrologue -> context:', '(the same)');
  }
});
