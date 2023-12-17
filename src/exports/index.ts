export { configureProgram } from 'universe/index';
export { runProgram } from 'universe/util';

export { $executionContext, FrameworkExitCode } from 'universe/constant';

export {
  CliError,
  GracefulEarlyExitError,
  isCliError,
  isGracefulEarlyExitError
} from 'universe/error';

export type {
  ConfigurationHooks,
  ConfigureArguments,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext,
  ConfigureExecutionEpilogue,
  ConfigureExecutionPrologue
} from 'types/configure';

export type {
  ChildConfiguration,
  Configuration,
  ImportedConfigurationModule,
  ParentConfiguration,
  RootConfiguration
} from 'types/module';

export type { Arguments, NullArguments } from 'types/program';
