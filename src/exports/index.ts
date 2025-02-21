export { configureProgram } from 'universe';
export { runProgram } from 'universe:util.ts';

export { $executionContext, FrameworkExitCode } from 'universe:constant.ts';

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
} from 'typeverse:configure.ts';

export type {
  ChildConfiguration,
  Configuration,
  ImportedConfigurationModule,
  ParentConfiguration,
  RootConfiguration
} from 'typeverse:module.ts';

export type { Arguments, NullArguments } from 'typeverse:program.ts';
