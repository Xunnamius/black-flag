export { configureProgram } from 'universe/index';
export { runProgram } from 'universe/util';

export {
  $executionContext,
  FrameworkExitCode,
  defaultUsageText
} from 'universe/constant';

export {
  AssertionFailedError,
  CliError,
  CommandNotImplementedError,
  ErrorMessage,
  GracefulEarlyExitError,
  type CliErrorOptions
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

export type {
  Arguments,
  ExecutionContext,
  Executor,
  FrameworkArguments,
  NullArguments,
  PreExecutionContext,
  Program,
  ProgramMetadata
} from 'types/program';
