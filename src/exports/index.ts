export { configureProgram, makeProgram } from 'universe/index';
export { runProgram } from 'universe/util';

export {
  $executionContext,
  DEFAULT_USAGE_TEXT,
  FrameworkExitCode
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
  ConfigureArguments,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext,
  ConfigureExecutionEpilogue,
  ConfigureExecutionPrologue,
  ConfigureHooks
} from 'types/configure';

export type {
  AnyConfiguration,
  ChildConfiguration,
  Configuration,
  ImportedConfigurationModule,
  ParentConfiguration,
  RootConfiguration
} from 'types/module';

export type {
  AnyArguments,
  AnyProgram,
  Arguments,
  ExecutionContext,
  Executor,
  FrameworkArguments,
  PreExecutionContext,
  Program,
  ProgramMetadata
} from 'types/program';
