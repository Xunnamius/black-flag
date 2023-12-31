/* eslint-disable unicorn/prefer-export-from */

import { hideBin as hideBin_ } from 'yargs/helpers';

export {
  isArguments,
  isAssertionSystemError,
  isNullArguments,
  isPreExecutionContext,
  makeRunner
} from 'universe/util';

export {
  defaultHelpOptionName,
  defaultHelpTextDescription,
  defaultUsageText,
  defaultVersionOptionName,
  defaultVersionTextDescription
} from 'universe/constant';

export {
  AssertionFailedError,
  CommandNotImplementedError,
  ErrorMessage,
  isCommandNotImplementedError,
  type CliErrorOptions
} from 'universe/error';

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
} from 'types/program';

/**
 * @see https://yargs.js.org/docs/#api-reference
 */
export const hideBin = hideBin_;
