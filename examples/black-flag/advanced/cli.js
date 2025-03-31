#!/usr/bin/env node

import { runProgram } from '@black-flag/core';

export default runProgram(import.meta.resolve('./commands'), import('./configure.js'));
