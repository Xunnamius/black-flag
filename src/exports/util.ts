/* eslint-disable unicorn/prefer-export-from */

import { hideBin as hideBin_ } from 'yargs/helpers';

export {
  isArguments,
  isAssertionSystemError,
  isNullArguments,
  isPreExecutionContext,
  makeRunner
} from 'universe:util.ts';

export {
  defaultHelpOptionName,
  defaultHelpTextDescription,
  defaultUsageText,
  defaultVersionOptionName,
  defaultVersionTextDescription
} from 'universe:constant.ts';

export {
  AssertionFailedError,
  CommandNotImplementedError,
  ErrorMessage,
  isCommandNotImplementedError,
  type CliErrorOptions
} from 'universe:error.ts';

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
  ProgramType,
  Programs,
  RouterProgram
} from 'typeverse:program.ts';

/**
 * @see https://yargs.js.org/docs/#api-reference
 */
export const hideBin = hideBin_;
