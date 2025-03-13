/* eslint-disable unicorn/prefer-export-from */

import { hideBin as hideBin_ } from 'yargs/helpers';

export { makeRunner } from 'universe';

export {
  expectedHelpTextRegExp,
  getDeepestErrorCause,
  isArguments,
  isAssertionSystemError,
  isNullArguments,
  isPreExecutionContext
} from 'universe:util.ts';

export {
  defaultHelpOptionName,
  defaultHelpTextDescription,
  defaultUsageText,
  defaultVersionOptionName,
  defaultVersionTextDescription,
  nullArguments$0
} from 'universe:constant.ts';

export {
  AssertionFailedError,
  BfErrorMessage,
  CommandNotImplementedError,
  isCommandNotImplementedError,
  type CliErrorOptions
} from 'universe:error.ts';

export type { FactoriedRunProgramParameters, MakeRunnerOptions } from 'universe';

export type {
  DescriptorToProgram,
  EffectorProgram,
  ExecutionContext,
  Executor,
  FrameworkArguments,
  HelperProgram,
  PreExecutionContext,
  Program,
  ProgramDescriptor,
  ProgramMetadata,
  Programs,
  ProgramType,
  RouterProgram
} from 'universe:types/program.ts';

/**
 * @see https://yargs.js.org/docs/#api-reference
 */
export const hideBin = hideBin_;
