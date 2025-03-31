#!/usr/bin/env node

import { runProgram } from '@black-flag/core';

export default runProgram(import.meta.resolve('./commands'), {
  configureErrorHandlingEpilogue(...args) {
    if (args[2].state.didOutputHelpOrVersionText) {
      console.log('\n--\n');
    }

    console.log('handled error in error handling hook');
    console.log('hook args entries (reversed):', Object.entries(args).reverse());
  }
});
