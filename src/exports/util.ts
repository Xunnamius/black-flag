import { CommandNotImplementedError } from 'universe:error.ts';

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

export { BfErrorMessage } from 'universe:error.ts';
export const { isError: isCommandNotImplementedError } = CommandNotImplementedError;

export { AssertionFailedError, CommandNotImplementedError } from 'universe:error.ts';

export type { CliErrorOptions } from 'universe:error.ts';

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

// * Adapted from Yargs source:

/**
 * @see https://yargs.js.org/docs/#api-reference
 */
export function hideBin(argv: string[]) {
  return argv.slice(getProcessArgvBinIndex() + 1);
}

function getProcessArgvBinIndex() {
  if (isBundledElectronApp()) {
    return 0;
  }

  return 1;
}

function isBundledElectronApp() {
  return (
    isElectronApp() && !(process as typeof process & Record<string, unknown>).defaultApp
  );
}

function isElectronApp() {
  return !!process.versions.electron;
}
