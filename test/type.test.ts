/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// * These tests ensure the exported types under test function as expected.

import { createDebugLogger } from 'rejoinder';
import { expect, test } from 'tstyche';

import type {
  $executionContext,
  Arguments,
  ChildConfiguration,
  ConfigurationHooks,
  ImportedConfigurationModule,
  ParentConfiguration,
  RootConfiguration
} from 'universe:exports/index.ts';

import type {
  DescriptorToProgram,
  EffectorProgram,
  ExecutionContext,
  Executor,
  FrameworkArguments,
  HelperProgram,
  PreExecutionContext,
  ProgramDescriptor,
  ProgramMetadata,
  Programs,
  ProgramType,
  RouterProgram
} from 'universe:exports/util.ts';

test('exports/index', async () => {
  expect({
    configureArguments(argv: string[]) {
      return argv;
    },
    configureErrorHandlingEpilogue(meta, argv, context) {
      void meta, argv, context;
      return undefined;
    },
    configureExecutionContext(context: ExecutionContext) {
      return context;
    },
    configureExecutionEpilogue(argv: Arguments, context: ExecutionContext) {
      void context;
      return argv;
    },
    configureExecutionPrologue(rootPrograms: Programs, context: ExecutionContext) {
      void rootPrograms, context;
      return undefined;
    }
  } satisfies ConfigurationHooks).type.toBeAssignableTo<ConfigurationHooks>();

  expect({ name: 'something' }).type.toBeAssignableTo<ChildConfiguration>();

  expect({
    aliases: ['alias'],
    builder: {},
    command: '$0',
    deprecated: false,
    description: '',
    handler: () => undefined,
    name: 'something',
    usage: 'usage'
  } satisfies ChildConfiguration).type.toBeAssignableTo<ChildConfiguration>();

  expect({ name: 'something' }).type.toBeAssignableTo<ImportedConfigurationModule>();
  expect({ name: 'something' }).type.toBeAssignableTo<ParentConfiguration>();
  expect({ name: 'something' }).type.toBeAssignableTo<RootConfiguration>();
});

test('exports/util', async () => {
  expect({} as EffectorProgram).type.toBeAssignableTo<DescriptorToProgram<'effector'>>();
  expect({} as DescriptorToProgram<'effector'>).type.toBeAssignableTo<EffectorProgram>();

  expect(
    {} as { commands: any; debug: any; state: any }
  ).type.toBeAssignableTo<ExecutionContext>();

  expect(() => Promise.resolve({} as Arguments)).type.toBeAssignableTo<Executor>();
  expect({} as { [$executionContext]: any }).type.toBeAssignableTo<FrameworkArguments>();
  expect({} as DescriptorToProgram<'helper'>).type.toBeAssignableTo<HelperProgram>();

  expect({
    commands: new Map(),
    debug: createDebugLogger({ namespace: 'namespace' }),
    state: {
      rawArgv: [],
      initialTerminalWidth: 5,
      isGracefullyExiting: true,
      didAlreadyHandleError: true,
      isHandlingHelpOption: false,
      globalHelpOption: {
        name: '',
        description: ''
      },
      isHandlingVersionOption: true,
      globalVersionOption: undefined,
      showHelpOnFail: false,
      firstPassArgv: undefined,
      deepestParseResult: undefined,
      didOutputHelpOrVersionText: true,
      finalError: undefined,
      somethingExtra: 1
    },
    somethingExtra: 1,
    rootPrograms: { effector: {}, helper: {}, router: {} } as Programs,
    execute: () => Promise.resolve({} as Arguments),
    executionContext: {} as ExecutionContext
  }).type.toBeAssignableTo<PreExecutionContext>();

  expect('effector').type.toBeAssignableTo<ProgramDescriptor>();
  expect('parent-child').type.toBeAssignableTo<ProgramType>();

  expect({
    filename: '',
    filenameWithoutExtension: '',
    filepath: '',
    hasChildren: false,
    isImplemented: true,
    parentDirName: '',
    fullUsageText: '',
    reservedCommandNames: [],
    type: 'parent-child'
  } satisfies ProgramMetadata).type.toBeAssignableTo<ProgramMetadata>();

  expect({
    effector: {} as EffectorProgram,
    helper: {} as HelperProgram,
    router: {} as RouterProgram
  }).type.toBeAssignableTo<Programs>();

  expect({} as DescriptorToProgram<'router'>).type.toBeAssignableTo<RouterProgram>();
});
