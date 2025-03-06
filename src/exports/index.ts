export { configureProgram, runProgram } from 'universe';

export { $executionContext, FrameworkExitCode } from 'universe:constant.ts';

export type { RunProgramParameters, RunProgramReturnType } from 'universe';

export {
  CliError,
  GracefulEarlyExitError,
  isCliError,
  isGracefulEarlyExitError
} from 'universe:error.ts';

export type {
  ConfigurationHooks,
  ConfigureArguments,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext,
  ConfigureExecutionEpilogue,
  ConfigureExecutionPrologue
} from 'universe:types/configure.ts';

export type {
  ChildConfiguration,
  Configuration,
  ImportedConfigurationModule,
  ParentConfiguration,
  RootConfiguration
} from 'universe:types/module.ts';

export type { Arguments, NullArguments } from 'universe:types/program.ts';
