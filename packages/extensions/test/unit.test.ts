/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

// * These tests ensure the exported interface under test functions as expected.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { isDeepStrictEqual } from 'node:util';
import { isNativeError } from 'node:util/types';

import { extractExamplesFromDocument, JSONC } from '@-xun/project';
import { $executionContext, CliError, isCliError } from '@black-flag/core';
import { isCommandNotImplementedError } from '@black-flag/core/util';
import deepMerge from 'lodash.merge';

import {
  getInvocableExtendedHandler,
  withBuilderExtensions,
  withUsageExtensions
} from 'universe+extensions';

import { BfeErrorMessage } from 'universe+extensions:error.ts';
import { $artificiallyInvoked, $exists } from 'universe+extensions:symbols.ts';

import type { Arguments } from '@black-flag/core';
import type { ExecutionContext } from '@black-flag/core/util';
import type { PartialDeep } from 'type-fest';
// ? We use the version of yargs bundled with black flag
// {@symbiote/notInvalid yargs}
import type { ParserConfigurationOptions } from 'yargs';
import type { AsStrictExecutionContext, BfeBuilderObject } from 'universe+extensions';

const [_readmeExamplesJs, readmeExamplesJson] = extractExamplesFromDocument
  .sync(`${__dirname}/../README.md`, { useCached: true })
  .entries()
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce<
    [
      Record<string, string>,
      Record<string, BfeBuilderObject<Record<string, unknown>, ExecutionContext>>
    ]
  >(
    ([js, jsonc], [k, v]) => {
      if (k.endsWith('-jsonc')) {
        jsonc[k] = JSONC.parse(v);
      } else {
        js[k] = v;
      }

      return [js, jsonc];
    },
    [{}, {}]
  );

describe('::withBuilderExtensions', () => {
  describe('"requires" configuration', () => {
    it('takes into account yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      const customBuilder = {
        'x-y': { alias: 'x-y-alias', requires: 'a-b-c' },
        'a-b-c': { alias: ['a', 'b-c'] }
      };

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      function customHandler({
        $0: __,
        _,
        [$executionContext]: ___,
        ...argv
      }: Arguments) {
        _argv = argv;
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x-y', [['a-b-c', $exists]])
          });
        }
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x-y', [['a-b-c', $exists]])
          });
        }
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x-y', [['a-b-c', $exists]])
          });
        }
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x-y', [['a-b-c', $exists]])
          });
        }
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        {
          // ? strip-dashed should have no effect if camel-case-expansion is false
          const { handlerResult } = await runnerAll({
            'x-y': 1,
            'a-b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'a-b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerAll({
            'x-y': 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x-y', [['a-b-c', $exists]])
          });
        }
      }
    });

    it('searches for arg-vals in given argument when configured as an array', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { requires: { y: 5 } },
          y: { array: true }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.RequiresViolation('x', [['y', 5]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.RequiresViolation('x', [['y', 5]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 2] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.RequiresViolation('x', [['y', 5]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: [5] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 5, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }
    });

    describe('readme examples', () => {
      test('example requires implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['requires-1-jsonc']
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x', [['y', $exists]])
          });
        }
      });

      test('example requires implementation #2', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['requires-2-jsonc']
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'string' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'string', z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'one', z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'one', z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x', [
              ['y', 'one'],
              ['z', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('z', [['y', $exists]])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'string' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x', [
              ['y', 'one'],
              ['z', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'one' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x', [['z', $exists]])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true, y: 'string' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x', [['y', 'one']])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('x', [['y', 'one']])
          });
        }
      });
    });
  });

  describe('"conflicts" configuration', () => {
    it('takes into account yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      const customBuilder = {
        'x-y': { alias: 'x-y-alias', conflicts: 'a-b-c' },
        'a-b-c': { alias: ['a', 'b-c'] }
      };

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      function customHandler({
        $0: __,
        _,
        [$executionContext]: ___,
        ...argv
      }: Arguments) {
        _argv = argv;
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x-y', [['a-b-c', $exists]])
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'x-y-alias': 1
          });
        }
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x-y', [['a-b-c', $exists]])
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            xY: 1
          });
        }
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x-y', [['a-b-c', $exists]])
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            xYAlias: 1
          });
        }
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1,
            aBC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x-y', [['a-b-c', $exists]])
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1
          });
        }
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        {
          // ? strip-dashed should have no effect if camel-case-expansion is false
          const { handlerResult } = await runnerAll({
            'x-y': 1,
            'a-b-c': 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x-y', [['a-b-c', $exists]])
          });
        }

        {
          const { handlerResult } = await runnerAll({
            'x-y': 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1
          });
        }
      }
    });

    it('searches for arg-vals in given argument when configured as an array', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { conflicts: { y: 5 } },
          y: { array: true }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [5] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ConflictsViolation('x', [['y', 5]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 5, 2] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ConflictsViolation('x', [['y', 5]])
        });
      }
    });

    describe('readme examples', () => {
      test('example conflicts implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['conflicts-1-jsonc']
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x', [['y', $exists]])
          });
        }
      });

      test('example conflicts implementation #2', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['conflicts-2-jsonc']
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'string' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('z', [['y', $exists]])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'one' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x', [['y', 'one']])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true, y: 'one' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x', [
              ['y', 'one'],
              ['z', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ConflictsViolation('x', [['z', $exists]])
          });
        }
      });
    });
  });

  describe('"implies" configuration', () => {
    let _argv: Record<string, unknown> | undefined = undefined;

    function getArgv() {
      const argv = _argv;
      _argv = undefined;
      return argv;
    }

    function customHandler({ $0: __, _, [$executionContext]: ___, ...argv }: Arguments) {
      _argv = argv;
    }

    it('updates argv with respect to aliases and yargs-parser configuration', async () => {
      expect.hasAssertions();

      const customBuilder = {
        'x-y': { alias: 'x-y-alias', implies: { 'a-b-c': 5 } },
        'a-b-c': { alias: ['a', 'b-c'] }
      };

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 5,
            a: 5,
            'b-c': 5
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('x-y', [['a-b-c', 2]])
          });
        }
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            xY: 1,
            'a-b-c': 5,
            aBC: 5
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('x-y', [['a-b-c', 2]])
          });
        }
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            xYAlias: 1,
            aBC: 5,
            a: 5,
            bC: 5
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('x-y', [['a-b-c', 2]])
          });
        }
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            aBC: 5
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1,
            aBC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('x-y', [['a-b-c', 2]])
          });
        }
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        {
          // ? strip-dashed should have no effect if camel-case-expansion is false
          const { handlerResult } = await runnerAll({
            'x-y': 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'a-b-c': 5
          });
        }

        {
          const { handlerResult } = await runnerAll({
            'x-y': 1,
            'a-b-c': 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('x-y', [['a-b-c', 2]])
          });
        }
      }
    });

    it('overrides configured defaults', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler,
        customBuilder: {
          x: { implies: { y: true } },
          y: { default: false }
        }
      });

      {
        const { firstPassResult, secondPassResult } = await runner({ y: false }, ['y']);

        expect(firstPassResult).toStrictEqual({
          x: {},
          y: { default: false }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
        expect(getArgv()).toStrictEqual({ y: false });
      }

      {
        const { firstPassResult, secondPassResult } = await runner({ x: true }, ['y']);

        expect(firstPassResult).toStrictEqual({
          x: {},
          y: { default: false }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
        expect(getArgv()).toStrictEqual({ x: true, y: true });
      }
    });

    it(`does not throw when an arg's value conflicts with an implication but "looseImplications" is enabled`, async () => {
      expect.hasAssertions();

      {
        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: {
            x: { implies: { y: true } },
            y: {}
          }
        });

        const { handlerResult } = await runner({ x: true, y: false });

        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ImpliesViolation('x', [['y', false]])
        });
      }

      {
        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: {
            x: { implies: { y: true }, looseImplications: true },
            y: {}
          }
        });

        await runner({ x: true, y: false });
        expect(getArgv()).toStrictEqual({ x: true, y: false });
      }
    });

    it('does not throw when an arg with a false value has a conflicting implication', async () => {
      expect.hasAssertions();

      {
        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: {
            x: { implies: { y: true } },
            y: {}
          }
        });

        await runner({ x: false, y: false });
        expect(getArgv()).toStrictEqual({ x: false, y: false });

        await runner({ x: false, y: true });
        expect(getArgv()).toStrictEqual({ x: false, y: true });

        await runner({ x: true, y: true });
        expect(getArgv()).toStrictEqual({ x: true, y: true });
      }

      {
        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: {
            x: { array: true, boolean: true, implies: { y: true } },
            y: {}
          }
        });

        const { handlerResult } = await runner({ x: [false], y: false });

        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ImpliesViolation('x', [['y', false]])
        });
      }

      {
        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: {
            x: { number: true, implies: { y: true } },
            y: {}
          }
        });

        const { handlerResult } = await runner({ x: 0, y: false });

        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ImpliesViolation('x', [['y', false]])
        });
      }
    });

    it('throws when an arg with a false value has a conflicting implication and "vacuousImplications" is enabled', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler,
        customBuilder: {
          x: { implies: { y: true }, vacuousImplications: true },
          y: {}
        }
      });

      {
        const { handlerResult } = await runner({ x: false, y: false });

        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ImpliesViolation('x', [['y', false]])
        });
      }

      {
        await runner({ x: false, y: true });
        expect(getArgv()).toStrictEqual({ x: false, y: true });
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'hello' });

        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.ImpliesViolation('x', [['y', 'hello']])
        });
      }
    });

    it('throws when attempting to imply a value for a non-existent option', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler,
        customBuilder: {
          x: { implies: { 'y-y': true } },
          yY: {}
        }
      });

      const { firstPassResult } = await runner({ x: true });
      expect(firstPassResult).toMatchObject({
        message: expect.stringContaining(
          ': ' + BfeErrorMessage.ReferencedNonExistentOption('x', 'y-y')
        )
      });
    });

    describe('readme examples', () => {
      test('example implies implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: readmeExamplesJson['implies-1-jsonc']
        });

        {
          await runner({});
          expect(getArgv()).toStrictEqual({});
        }

        {
          await runner({ y: true });
          expect(getArgv()).toStrictEqual({ y: true });
        }

        {
          await runner({ y: false });
          expect(getArgv()).toStrictEqual({ y: false });
        }

        {
          await runner({ x: true });
          expect(getArgv()).toStrictEqual({ x: true, y: true });
        }

        {
          await runner({ x: true, y: true });
          expect(getArgv()).toStrictEqual({ x: true, y: true });
        }
      });

      test('example implies implementation #2', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: readmeExamplesJson['implies-2-jsonc']
        });

        {
          const { handlerResult } = await runner({ x: true, y: false });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('x', [['y', false]])
          });
        }
      });

      test('example implies implementation #3', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: readmeExamplesJson['implies-3-jsonc']
        });

        {
          await runner({ x: true });
          expect(getArgv()).toStrictEqual({ x: true, y: true });
        }

        {
          await runner({ x: false, y: true });
          expect(getArgv()).toStrictEqual({ x: false, y: true });
        }

        {
          await runner({ x: false, y: false });
          expect(getArgv()).toStrictEqual({ x: false, y: false });
        }
      });

      test('example implies implementation #4', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customHandler,
          customBuilder: readmeExamplesJson['implies-4-jsonc']
        });

        {
          await runner({ patch: true });
          expect(getArgv()).toStrictEqual({
            patch: true,
            'only-patch': false,
            onlyPatch: false
          });

          await runner({ 'only-patch': false, onlyPatch: false });
          expect(getArgv()).toStrictEqual({
            patch: true,
            'only-patch': false,
            onlyPatch: false
          });
        }

        {
          await runner({ patch: false });
          expect(getArgv()).toStrictEqual({
            patch: false,
            'only-patch': false,
            onlyPatch: false
          });

          await runner({ patch: false, 'only-patch': false, onlyPatch: false });
          expect(getArgv()).toStrictEqual({
            patch: false,
            'only-patch': false,
            onlyPatch: false
          });
        }

        {
          await runner({ 'only-patch': true, onlyPatch: true });
          expect(getArgv()).toStrictEqual({
            patch: true,
            'only-patch': true,
            onlyPatch: true
          });

          await runner({ patch: true, 'only-patch': true, onlyPatch: true });
          expect(getArgv()).toStrictEqual({
            patch: true,
            'only-patch': true,
            onlyPatch: true
          });
        }

        {
          const { handlerResult } = await runner({
            patch: false,
            'only-patch': true,
            onlyPatch: true
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.ImpliesViolation('only-patch', [['patch', false]])
          });
        }
      });
    });
  });

  describe('"demandThisOptionIf" configuration', () => {
    it('takes into account yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      const customBuilder = {
        'x-y': { alias: 'x-y-alias' },
        'a-b-c': { alias: ['a', 'b-c'], demandThisOptionIf: 'x-y' }
      };

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      function customHandler({
        $0: __,
        _,
        [$executionContext]: ___,
        ...argv
      }: Arguments) {
        _argv = argv;
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('a-b-c', ['x-y', $exists])
          });
        }
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('a-b-c', ['x-y', $exists])
          });
        }
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('a-b-c', ['x-y', $exists])
          });
        }
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('a-b-c', ['x-y', $exists])
          });
        }
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        {
          // ? strip-dashed should have no effect if camel-case-expansion is false
          const { handlerResult } = await runnerAll({
            'x-y': 1,
            'a-b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'a-b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerAll({
            'x-y': 1
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('a-b-c', ['x-y', $exists])
          });
        }
      }
    });

    it('searches for arg-vals in given argument when configured as an array', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionIf: { y: 5 } },
          y: { array: true }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [5] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 5, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [5] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandIfViolation('x', ['y', 5])
        });
      }

      {
        const { handlerResult } = await runner({ y: [1, 5, 2] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandIfViolation('x', ['y', 5])
        });
      }
    });

    describe('readme examples', () => {
      test('example demandThisOptionIf implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOptionIf-1-jsonc']
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('y', ['x', $exists])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('z', ['x', $exists])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('y', ['x', $exists])
          });
        }
      });

      test('example demandThisOptionIf implementation #2', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOptionIf-2-jsonc']
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'string' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'string' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('x', ['z', $exists])
          });
        }

        {
          const { handlerResult } = await runner({ y: 'one' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('x', ['y', 'one'])
          });
        }

        {
          const { handlerResult } = await runner({ y: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('x', ['z', $exists])
          });
        }

        {
          const { handlerResult } = await runner({ y: 'one', z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandIfViolation('x', ['y', 'one'])
          });
        }
      });
    });
  });

  describe('"demandThisOption" configuration', () => {
    describe('readme examples', () => {
      test('example demandThisOption implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOption-1-jsonc']
        });

        const { firstPassResult, secondPassResult, handlerResult } = await runner({});

        expect(firstPassResult).toStrictEqual({
          x: { demandOption: true },
          y: { demandOption: false }
        });

        expect(secondPassResult).toStrictEqual({
          x: { demandOption: true },
          y: { demandOption: false }
        });

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      });
    });
  });

  describe('"demandThisOptionOr" configuration', () => {
    it('takes into account yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      const customBuilder = {
        'x-y': { alias: 'x-y-alias', demandThisOptionOr: 'a-b-c' },
        'a-b-c': { alias: ['a', 'b-c'] }
      };

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      function customHandler({
        $0: __,
        _,
        [$executionContext]: ___,
        ...argv
      }: Arguments) {
        _argv = argv;
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        {
          // ? strip-dashed should have no effect if camel-case-expansion is false
          const { handlerResult } = await runnerAll({
            'x-y': 1,
            'a-b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'a-b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerAll({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }
    });

    it('searches for arg-vals in given argument when configured as an array', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionOr: { y: 5 } },
          y: { array: true }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandOrViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandOrViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [1] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandOrViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [1, 2] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandOrViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [5] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1, 5, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [5] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1, 5, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }
    });

    describe('readme examples', () => {
      test('example demandThisOptionOr implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOptionOr-1-jsonc']
        });

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['y', $exists],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }
      });

      test('example demandThisOptionOr implementation #2', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOptionOr-2-jsonc']
        });

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'one' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'string' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'string', z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['y', 'one'],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['y', 'one'],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ y: 'string' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandOrViolation([
              ['y', 'one'],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }
      });
    });
  });

  describe('"demandThisOptionXor" configuration', () => {
    it('takes into account yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      const customBuilder = {
        'x-y': { alias: 'x-y-alias', demandThisOptionXor: 'a-b-c' },
        'a-b-c': { alias: ['a', 'b-c'] }
      };

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      function customHandler({
        $0: __,
        _,
        [$executionContext]: ___,
        ...argv
      }: Arguments) {
        _argv = argv;
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1,
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['a-b-c', $exists],
              ['x-y', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'x-y': 1,
            'x-y-alias': 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            'x-y-alias': 1
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'a-b-c': 2,
            a: 2,
            'b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerNoCamelCaseExpansion({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1,
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['a-b-c', $exists],
              ['x-y', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({
            'x-y': 1,
            xY: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1,
            xY: 1
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({
            'a-b-c': 2,
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'a-b-c': 2,
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripAliases({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1,
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['a-b-c', $exists],
              ['x-y', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({
            xY: 1,
            xYAlias: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1,
            xYAlias: 1
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({
            aBC: 2,
            a: 2,
            bC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            aBC: 2,
            a: 2,
            bC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripDashes({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1,
            aBC: 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['a-b-c', $exists],
              ['x-y', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({
            xY: 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            xY: 1
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({
            aBC: 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            aBC: 2
          });
        }

        {
          const { handlerResult } = await runnerStripBoth({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customHandler,
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        {
          // ? strip-dashed should have no effect if camel-case-expansion is false
          const { handlerResult } = await runnerAll({
            'x-y': 1,
            'a-b-c': 2
          });

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['a-b-c', $exists],
              ['x-y', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runnerAll({
            'x-y': 1
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'x-y': 1
          });
        }

        {
          const { handlerResult } = await runnerAll({
            'a-b-c': 2
          });

          expect(handlerResult).toBeUndefined();
          expect(getArgv()).toStrictEqual({
            'a-b-c': 2
          });
        }

        {
          const { handlerResult } = await runnerAll({});

          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['a-b-c', $exists],
              ['x-y', $exists]
            ])
          });
        }
      }
    });

    it('searches for arg-vals in given argument when configured as an array', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionXor: { y: 5 } },
          y: { array: true }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandGenericXorViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandGenericXorViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [1] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandGenericXorViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [1, 2] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandGenericXorViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: [] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [1, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: [5] });
        expect(handlerResult).toMatchObject({
          message: BfeErrorMessage.DemandGenericXorViolation([
            ['y', 5],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: [1, 5, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [5] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: [1, 5, 2] });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }
    });

    describe('readme examples', () => {
      test('example demandThisOptionXor implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOptionXor-1-jsonc']
        });

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, w: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true, z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true, w: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['w', $exists],
              ['z', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['w', $exists],
              ['z', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ w: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', $exists],
              ['x', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ z: true, w: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', $exists],
              ['x', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', $exists],
              ['x', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, w: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', $exists],
              ['x', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true, w: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['w', $exists],
              ['z', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ y: true, z: true, w: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['w', $exists],
              ['z', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: true, z: true, w: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', $exists],
              ['x', $exists]
            )
          });
        }
      });

      test('example demandThisOptionXor implementation #2', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: readmeExamplesJson['demandThisOptionXor-2-jsonc']
        });

        {
          const { handlerResult } = await runner({ x: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'one' });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: true, y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: 'string', z: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', 'one'],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', 'one'],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ y: 'string' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandGenericXorViolation([
              ['y', 'one'],
              ['z', $exists],
              ['x', $exists]
            ])
          });
        }

        {
          const { handlerResult } = await runner({ x: true, y: 'one' });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', 'one'],
              ['x', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['z', $exists],
              ['x', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ y: 'one', z: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['y', 'one'],
              ['z', $exists]
            )
          });
        }

        {
          const { handlerResult } = await runner({ x: true, z: true, y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.DemandSpecificXorViolation(
              ['z', $exists],
              ['x', $exists]
            )
          });
        }
      });
    });
  });

  describe('"check" configuration', () => {
    it('re-throws thrown CliErrors as-is, wraps others', async () => {
      expect.hasAssertions();

      {
        const errorMessage = `"x" must be between 0 and 10 (inclusive), saw: -1`;

        const runner = makeMockBuilderRunner({
          customBuilder: {
            x: {
              check: function (currentXArgValue: number) {
                if (currentXArgValue < 0 || currentXArgValue > 10) {
                  throw new Error(errorMessage);
                }

                return true;
              }
            }
          }
        });

        {
          const { handlerResult } = await runner({ x: 5 });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: -1 });
          expect(handlerResult).toBeInstanceOf(CliError);
          expect(handlerResult).toMatchObject({ message: errorMessage });
        }
      }

      {
        const error = new CliError(`"x" must be between 0 and 10 (inclusive), saw: -1`);

        const runner = makeMockBuilderRunner({
          customBuilder: {
            x: {
              check: function (currentXArgValue: number) {
                if (currentXArgValue < 0 || currentXArgValue > 10) {
                  throw error;
                }

                return true;
              }
            }
          }
        });

        {
          const { handlerResult } = await runner({ x: 5 });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: -1 });
          expect(handlerResult).toBe(error);
        }
      }
    });

    it('throws returned exceptions as-is', async () => {
      expect.hasAssertions();

      const error = new Error(`"x" must be between 0 and 10 (inclusive), saw: -1`);

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                return error;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toSatisfy(isCliError);
        expect(handlerResult).toMatchObject({
          message: `"x" must be between 0 and 10 (inclusive), saw: -1`
        });
      }
    });

    it('throws CliError(string) if string is returned', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                return `"x" must be between 0 and 10 (inclusive), saw: -1`;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toSatisfy(isCliError);
        expect(handlerResult).toMatchObject({
          message: `"x" must be between 0 and 10 (inclusive), saw: -1`
        });
      }
    });

    it('throws CliError if an otherwise non-truthy (or void) value is returned', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                return;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toSatisfy(isCliError);
        expect(handlerResult).not.toSatisfy(isCommandNotImplementedError);
      }
    });

    it('runs checks in definition order', async () => {
      expect.hasAssertions();

      const runOrder: number[] = [];

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function () {
              // ? Make this function take longer than the others to prove sync
              const hash = createHash('sha512');

              hash.update(
                readFileSync(
                  require.resolve('rootverse+extensions:package.json'),
                  'utf8'
                )
              );

              hash.digest('hex');
              runOrder.push(1);
              return true;
            }
          },
          y: {
            check: function () {
              runOrder.push(2);
              return true;
            }
          },
          z: {
            check: function () {
              runOrder.push(3);
              return true;
            }
          }
        }
      });

      {
        await runner({ x: true, y: true, z: true });
        expect(runOrder).toStrictEqual([1, 2, 3]);
      }
    });

    it('skips checks for arguments that are not given', async () => {
      expect.hasAssertions();

      const runOrder: number[] = [];

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function () {
              runOrder.push(1);
              return true;
            }
          },
          y: {
            check: function () {
              runOrder.push(2);
              return true;
            }
          },
          z: {
            check: function () {
              runOrder.push(3);
              return true;
            }
          }
        }
      });

      {
        await runner({ y: true });
        expect(runOrder).toStrictEqual([2]);
      }
    });

    it('sees defaults and their aliases/expansions depending on yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      const customBuilder = {
        'x-y': { default: 1, alias: ['x', 'x-y-alias'] },
        z: {
          alias: 'z-z',
          check: (
            _2: any,
            { $0: _3, _, [$executionContext]: _4, ...argv_ }: Arguments
          ) => {
            _argv = argv_;
            return true;
          }
        }
      };

      {
        const runner = makeMockBuilderRunner({ customBuilder });

        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          {
            'x-y': 1,
            xY: 1,
            x: 1,
            'x-y-alias': 1,
            xYAlias: 1,
            z: true,
            'z-z': true,
            zZ: true
          },
          ['x-y']
        );

        expect(firstPassResult).toStrictEqual({
          'x-y': { default: 1, alias: ['x', 'x-y-alias'] },
          z: { alias: 'z-z' }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);

        expect(getArgv()).toStrictEqual({
          'x-y': 1,
          xY: 1,
          x: 1,
          'x-y-alias': 1,
          xYAlias: 1,
          z: true,
          'z-z': true,
          zZ: true
        });
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        const { handlerResult } = await runnerNoCamelCaseExpansion(
          {
            'x-y': 1,
            x: 1,
            'x-y-alias': 1,
            z: true,
            'z-z': true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          'x-y': 1,
          x: 1,
          'x-y-alias': 1,
          z: true,
          'z-z': true
        });
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        const { handlerResult } = await runnerStripAliases(
          {
            'x-y': 1,
            xY: 1,
            z: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          'x-y': 1,
          xY: 1,
          z: true
        });
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        const { handlerResult } = await runnerStripDashes(
          {
            xY: 1,
            x: 1,
            xYAlias: 1,
            z: true,
            zZ: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          xY: 1,
          x: 1,
          xYAlias: 1,
          z: true,
          zZ: true
        });
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        const { handlerResult } = await runnerStripBoth(
          {
            xY: 1,
            z: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          xY: 1,
          z: true
        });
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        const { handlerResult } = await runnerAll(
          {
            'x-y': 1,
            z: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          'x-y': 1,
          z: true
        });
      }
    });

    it('supports async checks', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { default: 1 },
          y: {
            check: async (_, argv) => argv.x !== 1
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { y: true },
        ['x']
      );

      expect(firstPassResult).toStrictEqual({
        x: { default: 1 },
        y: {}
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCliError);
      expect(handlerResult).not.toSatisfy(isCommandNotImplementedError);
    });

    it('accepts an array of (potentially async) checks', async () => {
      expect.hasAssertions();

      const runOrder: number[] = [];

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { default: 1 },
          y: {
            check: [
              function (y, argv) {
                runOrder.push(1);
                return y === true && argv.y === true && argv.x === 1;
              },
              async (y, argv) => {
                await delay(100);
                runOrder.push(2);
                return y === true && argv.y === true && argv.x === 1;
              },
              function (y, argv) {
                runOrder.push(3);
                return y === true && argv.y === true && argv.x === 1;
              }
            ]
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { y: true },
        ['x']
      );

      expect(firstPassResult).toStrictEqual({
        x: { default: 1 },
        y: {}
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(runOrder).toStrictEqual([1, 3, 2]);
    });

    it('sees implications (final arv) and their aliases/expansions depending on yargs-parser configuration', async () => {
      expect.hasAssertions();

      let _argv: Record<string, unknown> | undefined = undefined;

      function getArgv() {
        const argv = _argv;
        _argv = undefined;
        return argv;
      }

      const customBuilder = {
        'x-y': { default: 1, alias: ['x', 'x-y-alias'] },
        z: {
          alias: 'z-z',
          implies: { 'x-y': 5 },
          check: (
            _2: any,
            { $0: _3, _, [$executionContext]: _4, ...argv_ }: Arguments
          ) => {
            _argv = argv_;
            return true;
          }
        }
      };

      {
        const runner = makeMockBuilderRunner({
          customBuilder: {
            'x-y': { alias: customBuilder['x-y'].alias },
            z: customBuilder.z
          }
        });

        const { firstPassResult, secondPassResult, handlerResult } = await runner({
          z: true,
          'z-z': true,
          zZ: true
        });

        expect(firstPassResult).toStrictEqual({
          'x-y': { alias: ['x', 'x-y-alias'] },
          z: { alias: 'z-z' }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);

        expect(getArgv()).toStrictEqual({
          'x-y': 5,
          xY: 5,
          x: 5,
          'x-y-alias': 5,
          xYAlias: 5,
          z: true,
          'z-z': true,
          zZ: true
        });
      }

      {
        const runner = makeMockBuilderRunner({ customBuilder });

        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          {
            'x-y': 1,
            xY: 1,
            x: 1,
            'x-y-alias': 1,
            xYAlias: 1,
            z: true,
            'z-z': true,
            zZ: true
          },
          ['x-y']
        );

        expect(firstPassResult).toStrictEqual({
          'x-y': { default: 1, alias: ['x', 'x-y-alias'] },
          z: { alias: 'z-z' }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);

        expect(getArgv()).toStrictEqual({
          'x-y': 5,
          xY: 5,
          x: 5,
          'x-y-alias': 5,
          xYAlias: 5,
          z: true,
          'z-z': true,
          zZ: true
        });
      }

      {
        const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'camel-case-expansion': false }
        });

        const { handlerResult } = await runnerNoCamelCaseExpansion(
          {
            'x-y': 1,
            x: 1,
            'x-y-alias': 1,
            z: true,
            'z-z': true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          'x-y': 5,
          x: 5,
          'x-y-alias': 5,
          z: true,
          'z-z': true
        });
      }

      {
        const runnerStripAliases = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'strip-aliased': true }
        });

        const { handlerResult } = await runnerStripAliases(
          {
            'x-y': 1,
            xY: 1,
            z: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          'x-y': 5,
          xY: 5,
          z: true
        });
      }

      {
        const runnerStripDashes = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'strip-dashed': true }
        });

        const { handlerResult } = await runnerStripDashes(
          {
            xY: 1,
            x: 1,
            xYAlias: 1,
            z: true,
            zZ: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          xY: 5,
          x: 5,
          xYAlias: 5,
          z: true,
          zZ: true
        });
      }

      {
        const runnerStripBoth = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
        });

        const { handlerResult } = await runnerStripBoth(
          {
            xY: 1,
            z: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          xY: 5,
          z: true
        });
      }

      {
        const runnerAll = makeMockBuilderRunner({
          customBuilder,
          parserConfiguration: {
            'camel-case-expansion': false,
            'strip-dashed': true,
            'strip-aliased': true
          }
        });

        const { handlerResult } = await runnerAll(
          {
            'x-y': 1,
            z: true
          },
          ['x-y']
        );

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        expect(getArgv()).toStrictEqual({
          'x-y': 5,
          z: true
        });
      }
    });

    describe('readme examples', () => {
      test('example check implementation #1', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: {
            x: {
              number: true,
              check: function (currentXArgValue /*, fullArgv*/) {
                if (currentXArgValue < 0 || currentXArgValue > 10) {
                  throw new Error(
                    `"x" must be between 0 and 10 (inclusive), saw: ${currentXArgValue}`
                  );
                }

                return true;
              }
            },
            y: {
              boolean: true,
              default: false,
              requires: 'x',
              check: function (currentYArgValue, fullArgv) {
                if (currentYArgValue && (fullArgv.x as number) <= 5) {
                  throw new Error(
                    `"x" must be greater than 5 to use 'y', saw: ${fullArgv.x}`
                  );
                }

                return true;
              }
            }
          }
        });

        {
          const { firstPassResult, secondPassResult, handlerResult } = await runner(
            {
              x: 1
            },
            ['y']
          );

          expect(firstPassResult).toStrictEqual({
            x: {
              number: true
            },
            y: {
              boolean: true,
              default: false
            }
          });

          expect(firstPassResult).toStrictEqual(secondPassResult);
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ y: true });
          expect(handlerResult).toMatchObject({
            message: BfeErrorMessage.RequiresViolation('y', [['x', $exists]])
          });
        }

        {
          const { handlerResult } = await runner({ x: 2, y: false });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: 6, y: true });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: 3, y: true });
          expect(handlerResult).toMatchObject({
            message: `"x" must be greater than 5 to use 'y', saw: 3`
          });
        }

        {
          const { handlerResult } = await runner({ x: -1 }, ['y']);
          expect(handlerResult).toMatchObject({
            message: `"x" must be between 0 and 10 (inclusive), saw: -1`
          });
        }
      });

      test('example check implementation #2', async () => {
        expect.hasAssertions();

        function checkArgBetween0And10(argName: string) {
          return function (argValue: number /* , fullArgv */) {
            return (
              (argValue >= 0 && argValue <= 10) ||
              `"${argName}" must be between 0 and 10 (inclusive), saw: ${argValue}`
            );
          };
        }

        function checkArgGreaterThan5(argName: string) {
          return function (argValue: number /* , fullArgv */) {
            return (
              argValue > 5 || `"${argName}" must be greater than 5, saw: ${argValue}`
            );
          };
        }

        const runner = makeMockBuilderRunner({
          customBuilder: {
            x: {
              number: true,
              check: [checkArgBetween0And10('x'), checkArgGreaterThan5('x')]
            },
            y: {
              number: true,
              check: checkArgBetween0And10('y')
            },
            z: {
              number: true,
              check: checkArgGreaterThan5('z')
            }
          }
        });

        {
          const { handlerResult } = await runner({});
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: 6, y: 5, z: 6 });
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { handlerResult } = await runner({ x: 6, y: 5, z: 4 });
          expect(handlerResult).toMatchObject({
            message: `"z" must be greater than 5, saw: 4`
          });
        }

        {
          const { handlerResult } = await runner({ x: 4, y: 5, z: 6 });
          expect(handlerResult).toMatchObject({
            message: `"x" must be greater than 5, saw: 4`
          });
        }

        {
          const { handlerResult } = await runner({ x: 11, y: 5, z: 6 });
          expect(handlerResult).toMatchObject({
            message: `"x" must be between 0 and 10 (inclusive), saw: 11`
          });
        }
      });
    });
  });

  describe('"subOptionOf" configuration', () => {
    it('supports both invocation signatures for updater objects (array and object forms)', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: {
                  description: 'This is a switch specifically for the "a" choice'
                }
              }
            }
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag',
            subOptionOf: {
              x: [
                {
                  when: (currentXArgValue) => currentXArgValue === 'a',
                  update: (oldXArgumentConfig) => {
                    return {
                      ...oldXArgumentConfig,
                      description: 'This is a switch specifically for the "a" choice'
                    };
                  }
                },
                {
                  when: (currentXArgValue) => currentXArgValue === 'a',
                  update: (oldXArgumentConfig) => ({
                    ...oldXArgumentConfig,
                    string: true
                  })
                }
              ]
            }
          }
        }
      });

      {
        const { firstPassResult, secondPassResult } = await runner({ x: 'b' });

        expect(firstPassResult).toStrictEqual({
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number'
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag'
          }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
      }

      {
        const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

        expect(firstPassResult).toStrictEqual({
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number'
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag'
          }
        });

        expect(secondPassResult).toStrictEqual({
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            description: 'This is a switch specifically for the "a" choice'
          },
          z: {
            boolean: true,
            description: 'This is a switch specifically for the "a" choice',
            string: true
          }
        });
      }
    });

    it('overwrites previous configuration entirely with updater result', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: {
                  description: 'This is a switch specifically for the "a" choice'
                }
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          description: 'This is a switch specifically for the "a" choice'
        }
      });
    });

    it('facilitates object spread when overwriting previous configuration via updater result', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: (oldConfig) => ({
                  ...oldConfig,
                  description: 'This is a switch specifically for the "a" choice'
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'This is a switch specifically for the "a" choice'
        }
      });
    });

    it('ignores subOptionOf updater objects when corresponding super-arg is not given alongside sub-arg', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: (oldConfig) => ({
                  ...oldConfig,
                  description: 'This is a switch specifically for the "a" choice'
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ y: 4 });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual(firstPassResult);
    });

    it('ignores nested/returned subOptionOf keys in resolved configurations', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: (oldConfig) => ({
                  ...oldConfig,
                  description: 'This is a switch specifically for the "a" choice',
                  subOptionOf: {
                    x: { bad: true }
                  }
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'This is a switch specifically for the "a" choice'
        }
      });
    });

    it('allows options to be a sub-option of itself', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c'],
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue !== 'a',
                update: () => ({
                  description: 'This is a switch specifically for the "a" choice',
                  string: true
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'c' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          description: 'This is a switch specifically for the "a" choice',
          string: true
        }
      });
    });

    describe('readme examples', () => {
      test('example declarative dynamic options', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: {
            x: {
              choices: ['a', 'b', 'c'],
              demandThisOption: true,
              description: 'A choice'
            },
            y: {
              number: true,
              description: 'A number'
            },
            z: {
              boolean: true,
              description: 'A useful context-sensitive flag',
              subOptionOf: {
                x: [
                  {
                    when: (currentXArgValue) => currentXArgValue === 'a',
                    update: (oldXArgumentConfig) => {
                      return {
                        ...oldXArgumentConfig,
                        description: 'This is a switch specifically for the "a" choice'
                      };
                    }
                  },
                  {
                    when: (currentXArgValue) => currentXArgValue !== 'a',
                    update: {
                      string: true,
                      description: 'This former-flag now accepts a string instead'
                    }
                  }
                ],
                y: {
                  when: (currentYArgValue, fullArgv) =>
                    fullArgv.x === 'a' && currentYArgValue > 5,
                  update: {
                    array: true,
                    demandThisOption: true,
                    description:
                      'This former-flag now accepts an array of two or more strings',
                    check: function (currentZArgValue) {
                      return (
                        currentZArgValue.length >= 2 ||
                        `"z" must be an array of two or more strings, only saw: ${currentZArgValue.length ?? 0}`
                      );
                    }
                  }
                },
                'does-not-exist': []
              }
            }
          }
        });

        const expectedXY = {
          x: {
            choices: ['a', 'b', 'c'],
            demandOption: true,
            description: 'A choice'
          },
          y: {
            number: true,
            description: 'A number'
          }
        };

        const expectedXYZFirstPass = {
          ...expectedXY,
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag'
          }
        };

        {
          const { firstPassResult, secondPassResult } = await runner({
            x: 'a'
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              boolean: true,
              description: 'This is a switch specifically for the "a" choice'
            }
          });
        }

        {
          const { firstPassResult, secondPassResult } = await runner({
            x: 'b'
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              string: true,
              description: 'This former-flag now accepts a string instead'
            }
          });
        }

        {
          const { firstPassResult, secondPassResult } = await runner({
            y: 1
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual(expectedXYZFirstPass);
        }

        {
          const { firstPassResult, secondPassResult } = await runner({
            z: true
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual(expectedXYZFirstPass);
        }

        {
          const { firstPassResult, secondPassResult } = await runner({
            x: 'a',
            y: 5
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              boolean: true,
              description: 'This is a switch specifically for the "a" choice'
            }
          });
        }

        {
          const { firstPassResult, secondPassResult, handlerResult } = await runner({
            x: 'a',
            y: 10
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              array: true,
              demandOption: true,
              description: 'This former-flag now accepts an array of two or more strings'
            }
          });

          // ? Since z isn't given, z's checks are skipped (otherwise they'd fail)
          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }

        {
          const { firstPassResult, secondPassResult, handlerResult } = await runner({
            x: 'a',
            y: 10,
            z: true
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              array: true,
              demandOption: true,
              description: 'This former-flag now accepts an array of two or more strings'
            }
          });

          expect(handlerResult).toMatchObject({
            message: '"z" must be an array of two or more strings, only saw: 0'
          });
        }

        {
          const { firstPassResult, secondPassResult, handlerResult } = await runner({
            x: 'a',
            y: 10,
            z: ['str1']
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              array: true,
              demandOption: true,
              description: 'This former-flag now accepts an array of two or more strings'
            }
          });

          expect(handlerResult).toMatchObject({
            message: '"z" must be an array of two or more strings, only saw: 1'
          });
        }

        {
          const { firstPassResult, secondPassResult, handlerResult } = await runner({
            x: 'a',
            y: 10,
            z: ['str1', 'str2']
          });

          expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
          expect(secondPassResult).toStrictEqual({
            ...expectedXY,
            z: {
              array: true,
              demandOption: true,
              description: 'This former-flag now accepts an array of two or more strings'
            }
          });

          expect(handlerResult).toSatisfy(isCommandNotImplementedError);
        }
      });

      test('example rewrite of demo init command', async () => {
        expect.hasAssertions();

        const runner = makeMockBuilderRunner({
          customBuilder: () => {
            return {
              lang: {
                // ▼ These two are fallback or "baseline" configurations for --lang
                choices: ['node', 'python'],
                default: 'python',

                subOptionOf: {
                  // ▼ Yep, --lang is also a suboption of --lang
                  lang: [
                    {
                      when: (lang) => lang === 'node',
                      // ▼ Remember: updates completely overwrite baseline config...
                      update: {
                        choices: ['node'],
                        default: 'node'
                      }
                    },
                    {
                      when: (lang) => lang !== 'node',
                      // ▼ ... though we can still reuse the "old" baseline config
                      update(oldOptionConfig) {
                        return {
                          ...oldOptionConfig,
                          choices: ['python']
                        };
                      }
                    }
                  ]
                }
              },

              version: {
                // ▼ These two are fallback or "baseline" configurations for --version
                string: true,
                default: '3.13',

                subOptionOf: {
                  // ▼ --version is a suboption of --lang
                  lang: [
                    {
                      when: (lang) => lang === 'node',
                      update: {
                        choices: ['20.18', '22.12', '23.3'],
                        default: '23.3'
                      }
                    },
                    {
                      when: (lang) => lang !== 'node',
                      update(oldOptionConfig) {
                        return {
                          ...oldOptionConfig,
                          choices: ['3.11', '3.12', '3.13']
                        };
                      }
                    }
                  ]
                }
              }
            };
          }
        });

        const expectedFirstPass = {
          lang: {
            choices: ['node', 'python'],
            default: 'python'
          },
          version: {
            string: true,
            default: '3.13'
          }
        };

        {
          const { firstPassResult, secondPassResult } = await runner(
            { lang: 'python', version: '3.13' },
            ['lang', 'version']
          );

          expect(firstPassResult).toStrictEqual(expectedFirstPass);
          expect(secondPassResult).toStrictEqual(expectedFirstPass);
        }

        {
          const { firstPassResult, secondPassResult } = await runner({ lang: 'node' });

          expect(firstPassResult).toStrictEqual(expectedFirstPass);
          expect(secondPassResult).toStrictEqual({
            lang: {
              choices: ['node'],
              default: 'node'
            },
            version: {
              choices: ['20.18', '22.12', '23.3'],
              default: '23.3'
            }
          });
        }

        {
          const { firstPassResult, secondPassResult } = await runner({ lang: 'python' });

          expect(firstPassResult).toStrictEqual(expectedFirstPass);
          expect(secondPassResult).toStrictEqual({
            lang: {
              choices: ['python'],
              default: 'python'
            },
            version: {
              string: true,
              choices: ['3.11', '3.12', '3.13'],
              default: '3.13'
            }
          });
        }
      });
    });
  });

  // ? yargs needs to see the default key to generate proper help text, but
  // ? we need to make sure defaults play nice with requires/implies/conflicts
  test('yargs/BF sees "default" key but custom builder functions do not see defaulted args or their aliases', async () => {
    expect.assertions(5);

    const runner = makeMockBuilderRunner({
      customBuilder: (_bf, _, argv) => {
        expect(argv).toSatisfy((x) => {
          return (
            x === undefined ||
            // ? Doing Object.fromEntries(Object.entries(x)) lets us skip symbols
            isDeepStrictEqual(Object.fromEntries(Object.entries(x)), {
              _: [],
              $0: 'fake'
            })
          );
        });

        return { x: { default: 1, alias: ['x-x', 'x-y-alias'] } };
      }
    });

    {
      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { x: 1, 'x-x': 1, xX: 1, 'x-y-alias': 1, xYAlias: 1 },
        ['x']
      );

      expect(firstPassResult).toStrictEqual({
        x: { default: 1, alias: ['x-x', 'x-y-alias'] }
      });

      expect(secondPassResult).toStrictEqual(firstPassResult);
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }
  });

  test('yargs/BF sees final non-vacuous implication as "default" key when handling help option', async () => {
    expect.hasAssertions();

    {
      const runner = makeMockBuilderRunner({
        context: { state: { isHandlingHelpOption: true } },
        customBuilder: (_, __, argv) => {
          return {
            x: {
              number: true,
              default: argv ? 11 : 1,
              implies: { y: 5 },
              alias: 'x-alias'
            },
            y: { number: true, default: argv ? 22 : 2, alias: 'y-alias' }
          };
        }
      });

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          { x: 1, y: 2, 'x-alias': 1, 'y-alias': 2 },
          ['y']
        );

        expect(firstPassResult).toStrictEqual({
          x: { number: true, default: 1, alias: 'x-alias' },
          y: { number: true, default: 2, alias: 'y-alias' }
        });

        expect(secondPassResult).toStrictEqual({
          x: { number: true, default: 11, alias: 'x-alias' },
          y: { number: true, default: 5, alias: 'y-alias' }
        });

        // ? Not called whe help text is generated
        expect(handlerResult).toBeUndefined();
      }
    }

    {
      const runner = makeMockBuilderRunner({
        context: { state: { isHandlingHelpOption: true } },
        customBuilder: (_, __, argv) => {
          return {
            x: {
              number: true,
              default: argv ? 11 : 1,
              implies: { y: 5 },
              alias: 'x-alias'
            },
            y: { number: true, default: argv ? 22 : 2, alias: 'y-alias' }
          };
        }
      });

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          { x: 1, y: 2, 'x-alias': 1, 'y-alias': 2 },
          ['x', 'y']
        );

        expect(firstPassResult).toStrictEqual({
          x: { number: true, default: 1, alias: 'x-alias' },
          y: { number: true, default: 2, alias: 'y-alias' }
        });

        expect(secondPassResult).toStrictEqual({
          x: { number: true, default: 11, alias: 'x-alias' },
          y: { number: true, default: 22, alias: 'y-alias' }
        });

        // ? Not called whe help text is generated
        expect(handlerResult).toBeUndefined();
      }
    }

    {
      const runner = makeMockBuilderRunner({
        context: { state: { isHandlingHelpOption: false } },
        customBuilder: (_, __, argv) => {
          return {
            x: {
              number: true,
              default: argv ? 11 : 1,
              implies: { y: 5 },
              alias: 'x-alias'
            },
            y: { number: true, default: argv ? 22 : 2, alias: 'y-alias' }
          };
        }
      });

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          { x: 1, y: 2, 'x-alias': 1, 'y-alias': 2 },
          ['y']
        );

        expect(firstPassResult).toStrictEqual({
          x: { number: true, default: 1, alias: 'x-alias' },
          y: { number: true, default: 2, alias: 'y-alias' }
        });

        expect(secondPassResult).toStrictEqual({
          x: { number: true, default: 11, alias: 'x-alias' },
          y: { number: true, default: 22, alias: 'y-alias' }
        });

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }
    }
  });

  test('yargs/BF sees final vacuous implication as "default" key when handling help option', async () => {
    expect.hasAssertions();

    {
      const runner = makeMockBuilderRunner({
        context: { state: { isHandlingHelpOption: true } },
        customBuilder: () => {
          return {
            x: { boolean: true, implies: { y: true }, vacuousImplications: true },
            y: { boolean: true, default: false }
          };
        }
      });

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          { x: false, y: true },
          ['y']
        );

        expect(firstPassResult).toStrictEqual({
          x: { boolean: true },
          y: { boolean: true, default: false }
        });

        expect(secondPassResult).toStrictEqual({
          x: { boolean: true },
          y: { boolean: true, default: true }
        });

        // ? Not called whe help text is generated
        expect(handlerResult).toBeUndefined();
      }
    }

    {
      const runner = makeMockBuilderRunner({
        context: { state: { isHandlingHelpOption: true } },
        customBuilder: () => {
          return {
            x: { boolean: true, implies: { y: true }, vacuousImplications: false },
            y: { boolean: true, default: false }
          };
        }
      });

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          { x: false, y: false },
          ['y']
        );

        expect(firstPassResult).toStrictEqual({
          x: { boolean: true },
          y: { boolean: true, default: false }
        });

        expect(secondPassResult).toStrictEqual({
          x: { boolean: true },
          y: { boolean: true, default: false }
        });

        // ? Not called whe help text is generated
        expect(handlerResult).toBeUndefined();
      }
    }
  });

  test('checks (except "check") ignore (coexist peacefully with) defaults coming in from yargs-parser', async () => {
    expect.hasAssertions();

    {
      const runner = makeMockBuilderRunner({
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            check: (_h, _argv) => true,
            default: 8
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 },
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
      );

      expect(firstPassResult).toStrictEqual({
        a: { default: 1 },
        b: { default: 2 },
        c: { default: 3 },
        d: { default: 4 },
        e: { default: 5, demandOption: true },
        f: { default: 6 },
        g: { default: 7 },
        h: { default: 8 },
        i: { default: 9 }
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.DemandOrViolation([
          ['d', $exists],
          ['f', $exists]
        ])
      });
    }

    {
      const runner = makeMockBuilderRunner({
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            check: (_h, _argv) => true,
            default: 8
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { a: 1, b: 2, c: 3, d: 4, e: 5, f: -6, g: 7, h: 8, i: 9 },
        ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i']
      );

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.DemandGenericXorViolation([
          ['h', $exists],
          ['g', $exists]
        ])
      });
    }

    {
      const runner = makeMockBuilderRunner({
        customHandler(argv) {
          expect(argv).toStrictEqual({
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: -6,
            g: -7,
            h: 8,
            i: 9,
            _: expect.anything(),
            $0: expect.anything(),
            [$executionContext]: expect.anything()
          });
        },
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            check: (_h, _argv) => true,
            default: 8
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { a: 1, b: 2, c: 3, d: 4, e: 5, f: -6, g: -7, h: 8, i: 9 },
        ['a', 'b', 'c', 'd', 'e', 'h', 'i']
      );

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toBeUndefined();
    }

    {
      const runner = makeMockBuilderRunner({
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            default: 8,
            check: (_h, argv) => {
              expect(argv).toStrictEqual({
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: -6,
                g: 7,
                h: -8,
                i: 9,
                _: expect.anything(),
                $0: expect.anything(),
                [$executionContext]: expect.anything()
              });

              return true;
            }
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { a: 1, b: 2, c: 3, d: 4, e: 5, f: -6, g: 7, h: -8, i: 9 },
        ['a', 'b', 'c', 'd', 'e', 'g', 'i']
      );

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }
  });

  test('defaults do not override implications/argv (including for aliases)', async () => {
    expect.assertions(2);

    const runner = makeMockBuilderRunner({
      customHandler(argv) {
        expect(argv).toStrictEqual({
          x: true,
          z: 4,
          a: 4,
          'z-z': 4,
          zZ: 4,
          y: 1,
          w: 10,
          'w-w': 10,
          wW: 10,
          b: 100,
          _: expect.anything(),
          $0: expect.anything(),
          [$executionContext]: expect.anything()
        });
      },
      customBuilder: {
        x: { implies: { y: 1, z: 4, w: 10 } },
        y: { default: 2 },
        z: { default: 3, alias: ['z-z', 'a'] },
        w: { default: 5, alias: 'w-w' },
        b: { default: 6 }
      }
    });

    {
      const { handlerResult } = await runner(
        { x: true, w: 10, 'w-w': 10, wW: 10, y: 2, z: 3, 'z-z': 3, zZ: 3, a: 3, b: 100 },
        ['y', 'z']
      );

      expect(handlerResult).toBeUndefined();
    }
  });

  it('defaults respect aliases and yargs-parser configuration', async () => {
    expect.hasAssertions();

    let _argv: Record<string, unknown> | undefined = undefined;

    function getArgv() {
      const argv = _argv;
      _argv = undefined;
      return argv;
    }

    const customBuilder = {
      'x-y': { default: 1, alias: ['x', 'x-y-alias'] },
      z: { alias: 'z-z' }
    };

    const customHandler = ({
      $0: _3,
      _,
      [$executionContext]: _4,
      ...argv_
    }: Arguments) => {
      _argv = argv_;
    };

    {
      const runner = makeMockBuilderRunner({ customHandler, customBuilder });

      await runner(
        {
          'x-y': 1,
          xY: 1,
          x: 1,
          'x-y-alias': 1,
          xYAlias: 1,
          z: true,
          'z-z': true,
          zZ: true
        },
        ['x-y']
      );

      expect(getArgv()).toStrictEqual({
        'x-y': 1,
        xY: 1,
        x: 1,
        'x-y-alias': 1,
        xYAlias: 1,
        z: true,
        'z-z': true,
        zZ: true
      });
    }

    {
      const runnerNoCamelCaseExpansion = makeMockBuilderRunner({
        customHandler,
        customBuilder,
        parserConfiguration: { 'camel-case-expansion': false }
      });

      await runnerNoCamelCaseExpansion(
        {
          'x-y': 1,
          x: 1,
          'x-y-alias': 1,
          z: true,
          'z-z': true
        },
        ['x-y']
      );

      expect(getArgv()).toStrictEqual({
        'x-y': 1,
        x: 1,
        'x-y-alias': 1,
        z: true,
        'z-z': true
      });
    }

    {
      const runnerStripAliases = makeMockBuilderRunner({
        customHandler,
        customBuilder,
        parserConfiguration: { 'strip-aliased': true }
      });

      await runnerStripAliases(
        {
          'x-y': 1,
          xY: 1,
          z: true
        },
        ['x-y']
      );

      expect(getArgv()).toStrictEqual({
        'x-y': 1,
        xY: 1,
        z: true
      });
    }

    {
      const runnerStripDashes = makeMockBuilderRunner({
        customHandler,
        customBuilder,
        parserConfiguration: { 'strip-dashed': true }
      });

      await runnerStripDashes(
        {
          xY: 1,
          x: 1,
          xYAlias: 1,
          z: true,
          zZ: true
        },
        ['x-y']
      );

      expect(getArgv()).toStrictEqual({
        xY: 1,
        x: 1,
        xYAlias: 1,
        z: true,
        zZ: true
      });
    }

    {
      const runnerStripBoth = makeMockBuilderRunner({
        customHandler,
        customBuilder,
        parserConfiguration: { 'strip-dashed': true, 'strip-aliased': true }
      });

      await runnerStripBoth(
        {
          xY: 1,
          z: true
        },
        ['x-y']
      );

      expect(getArgv()).toStrictEqual({
        xY: 1,
        z: true
      });
    }

    {
      const runnerAll = makeMockBuilderRunner({
        customHandler,
        customBuilder,
        parserConfiguration: {
          'camel-case-expansion': false,
          'strip-dashed': true,
          'strip-aliased': true
        }
      });

      await runnerAll(
        {
          'x-y': 1,
          z: true
        },
        ['x-y']
      );

      expect(getArgv()).toStrictEqual({
        'x-y': 1,
        z: true
      });
    }
  });

  test('custom command handlers see final argv (including defaults and their aliases)', async () => {
    expect.assertions(2);

    const runner = makeMockBuilderRunner({
      customHandler(argv) {
        expect(argv).toStrictEqual({
          x: true,
          'x-x': true,
          xX: true,
          y: 1,
          z: 1,
          'Z-Z': 1,
          zZ: 1,
          a: 1,
          'a-a': 1,
          aA: 1,
          c: 1,
          _: expect.anything(),
          $0: expect.anything(),
          [$executionContext]: expect.anything()
        });
      },
      customBuilder: {
        x: {
          alias: 'x-x',
          subOptionOf: { x: { when: () => true, update: { implies: { a: 1 } } } }
        },
        y: { subOptionOf: { x: { when: () => true, update: { default: 1 } } } },
        z: { default: 1, alias: 'Z-Z' },
        w: { implies: { b: 1 } },
        a: { alias: ['a-a', 'c'] },
        b: {}
      }
    });

    {
      const { handlerResult } = await runner(
        { x: true, 'x-x': true, xX: true, y: 1, z: 1, 'Z-Z': 1, zZ: 1 },
        ['y', 'z']
      );

      expect(handlerResult).toBeUndefined();
    }
  });

  test('arg-vals are successively overridden', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner({
      customBuilder: {
        a: { requires: [{ b: 1 }, { b: 2 }, { b: 3 }] },
        b: { conflicts: [{ c: 1 }, { c: 2 }, { c: 3 }] },
        c: { implies: [{ d: 1 }, { d: 2 }, { d: 3 }] },
        d: { demandThisOptionIf: [{ e: 1 }, { e: 2 }, { e: 3 }] },
        e: { demandThisOptionOr: [{ f: 1 }, { f: 2 }, { f: 3 }] },
        f: { demandThisOptionXor: [{ g: 1 }, { g: 2 }, { g: 3 }] },
        g: {}
      }
    });

    {
      const { handlerResult } = await runner({});

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.DemandOrViolation([
          ['f', 3],
          ['e', $exists]
        ])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.RequiresViolation('a', [['b', 3]])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true, b: 3, c: 3 });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.ConflictsViolation('b', [['c', 3]])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true, b: 3, c: true, d: true });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.ImpliesViolation('c', [['d', true]])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true, b: 3, c: true, e: 3 });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.DemandIfViolation('d', ['e', 3])
      });
    }

    {
      const { handlerResult } = await runner({
        a: true,
        b: 3,
        c: true,
        d: 3,
        e: 3
      });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.DemandGenericXorViolation([
          ['g', 3],
          ['f', $exists]
        ])
      });
    }

    {
      const { handlerResult } = await runner({
        a: true,
        b: 3,
        c: true,
        d: 3,
        e: 3,
        g: 3
      });

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }
  });

  test('multi arg-vals are supported', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner({
      customBuilder: {
        a: { requires: { b: 1, c: 2, d: 3 } },
        b: { conflicts: { e: 1, f: 2, g: 3 } },
        c: {},
        d: {},
        e: {},
        f: {},
        g: {}
      }
    });

    {
      const { handlerResult } = await runner({});
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }

    {
      const { handlerResult } = await runner({ a: true });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.RequiresViolation('a', [
          ['b', 1],
          ['c', 2],
          ['d', 3]
        ])
      });
    }

    {
      const { handlerResult } = await runner({ b: true, e: 1, f: 2, g: 3 });

      expect(handlerResult).toMatchObject({
        message: BfeErrorMessage.ConflictsViolation('b', [
          ['e', 1],
          ['f', 2],
          ['g', 3]
        ])
      });
    }
  });

  test('passing undefined to withHandlerExtensions throws CommandNotImplementedError', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner();
    const { handlerResult } = await runner({});
    expect(handlerResult).toSatisfy(isCommandNotImplementedError);
  });

  test('coerce always receives an array when its option is configured as such', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner({
      customBuilder: {
        a: {
          string: true,
          coerce(arg) {
            return arg;
          }
        },
        b: {
          string: true,
          array: true,
          coerce(arg) {
            return arg;
          }
        },
        c: {
          array: true,
          coerce(arg) {
            return arg;
          }
        }
      }
    });

    const { handlerResult, secondPassResult: secondPassResult_ } = await runner({
      a: 'a',
      b: 'b',
      c: 'c'
    });

    expect(handlerResult).toSatisfy(isCommandNotImplementedError);

    const secondPassResult = secondPassResult_ as Exclude<
      typeof secondPassResult_,
      Error
    >;

    expect(secondPassResult?.a?.coerce?.('a')).toBe('a');
    expect(secondPassResult?.b?.coerce?.('b')).toStrictEqual(['b']);
    expect(secondPassResult?.c?.coerce?.('c')).toStrictEqual(['c']);

    expect(secondPassResult?.a?.coerce?.(['a'])).toStrictEqual(['a']);
    expect(secondPassResult?.b?.coerce?.(['b'])).toStrictEqual(['b']);
    expect(secondPassResult?.c?.coerce?.(['c'])).toStrictEqual(['c']);
  });

  it('deletes explicitly undefined default from option configuration object', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner({
      customBuilder: { a: { default: undefined } }
    });

    const { firstPassResult, secondPassResult } = await runner({});

    expect(firstPassResult).toStrictEqual(secondPassResult);
    expect(firstPassResult).toStrictEqual({ a: {} });
  });

  it('throws framework error if withHandlerExtensions is invoked before metadata is available', async () => {
    expect.hasAssertions();

    const [, withHandlerExtensions] = withBuilderExtensions();

    await expect(withHandlerExtensions()({} as any)).rejects.toMatchObject({
      message: expect.stringContaining(': ' + BfeErrorMessage.IllegalHandlerInvocation())
    });
  });

  it('throws framework error if BF instance is missing ::getInternalMethods().getParserConfiguration() internal methods', async () => {
    expect.hasAssertions();

    const [builder] = withBuilderExtensions();

    expect(() =>
      builder({ group: jest.fn() /* getInternalMethods */ } as any, false, undefined)
    ).toThrow(BfeErrorMessage.UnexpectedValueFromInternalYargsMethod());
  });

  it('throws framework error if BF instance is missing parsed.defaulted sub-property', async () => {
    expect.hasAssertions();

    const [builder] = withBuilderExtensions();

    builder(
      {
        group: jest.fn(),
        getInternalMethods() {
          return {
            getParserConfiguration() {
              return {};
            }
          };
        }
      } as any,
      false,
      undefined
    );

    expect(() =>
      builder(
        {
          group: jest.fn(),
          getInternalMethods() {
            return {
              getParserConfiguration() {
                return {};
              }
            };
          }
        } as any,
        false,
        {} as any
      )
    ).toThrow(': ' + BfeErrorMessage.UnexpectedlyFalsyDetailedArguments());
  });

  it('throws framework error if any option names, aliases, or expansions conflict', async () => {
    expect.hasAssertions();

    const fakeBlackFlag = {
      group: jest.fn(),
      getInternalMethods() {
        return {
          getParserConfiguration() {
            return {};
          }
        };
      }
    } as any;

    {
      const [builder] = withBuilderExtensions({ a: { alias: 'a' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.DuplicateOptionName('a')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: {}, b: { alias: 'a' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.DuplicateOptionName('a')
      );
    }

    {
      const [builder] = withBuilderExtensions({ c: { alias: 'a' }, b: { alias: 'a' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.DuplicateOptionName('a')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        cA: { alias: 'a' },
        b: { alias: 'c-a' }
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.DuplicateOptionName('cA')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        'c-b': { alias: 'a' },
        b: { alias: ['x', 'c-b'] }
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.DuplicateOptionName('c-b')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        'c-b-a': { alias: 'a' },
        b: { alias: 'cBA' }
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.DuplicateOptionName('cBA')
      );
    }
  });

  it('throws framework error if a non-existent option name is referenced by a BFE configuration key', async () => {
    expect.hasAssertions();

    const fakeBlackFlag = {
      group: jest.fn(),
      getInternalMethods() {
        return {
          getParserConfiguration() {
            return {};
          }
        };
      }
    } as any;

    {
      const [builder] = withBuilderExtensions({ a: { requires: 'b' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    // * Check various syntaxes

    {
      const [builder] = withBuilderExtensions({ a: { requires: ['b'] } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: { requires: { b: 1 } } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: { requires: [{ b: 1 }] } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        a: { requires: [{ b: 1 }, 'c'] },
        b: {}
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'c')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        a: { requires: { b: 1, c: 2 } },
        b: {}
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'c')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        a: { requires: [{ b: 1, c: 2 }] },
        c: {}
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({
        a: { requires: ['b', 'c'] },
        b: {},
        d: {}
      });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'c')
      );
    }

    // * Nominally check other keys

    {
      const [builder] = withBuilderExtensions({ a: { conflicts: 'b' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: { implies: { b: true } } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: { demandThisOptionIf: 'b' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: { demandThisOptionOr: 'b' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }

    {
      const [builder] = withBuilderExtensions({ a: { demandThisOptionXor: 'b' } });

      expect(() => builder(fakeBlackFlag, false, undefined)).toThrow(
        BfeErrorMessage.ReferencedNonExistentOption('a', 'b')
      );
    }
  });

  describe('automatic grouping of related options', () => {
    it('creates five automatic groupings with default common options', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: { conflicts: 'c' },
          c: { implies: { d: -1 } },
          d: { demandThisOptionIf: 'b' },
          e: { demandThisOption: true },
          f: { demandThisOptionOr: 'd' },
          g: { demandThisOptionXor: 'h' },
          h: { check: (_h, _argv) => true },
          i: {
            subOptionOf: { q: { when: () => true, update: { requires: 'b' } } }
          },
          j: {
            subOptionOf: { q: { when: () => true, update: { conflicts: 'c' } } }
          },
          k: {
            subOptionOf: { q: { when: () => true, update: { implies: { d: -1 } } } }
          },
          l: {
            subOptionOf: { q: { when: () => true, update: { demandThisOptionIf: 'b' } } }
          },
          m: {
            subOptionOf: { q: { when: () => true, update: { demandThisOption: true } } }
          },
          n: {
            subOptionOf: { q: { when: () => true, update: { demandThisOptionOr: 'd' } } }
          },
          o: {
            subOptionOf: {
              q: { when: () => true, update: { demandThisOptionXor: 'h' } }
            }
          },
          p: {
            subOptionOf: {
              q: { when: () => true, update: { check: (_h, _argv) => true } }
            }
          },
          q: {}
        }
      });

      const { handlerResult } = await runner({ q: false });

      expect(handlerResult).toSatisfy(isCliError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([
        // * First pass
        [['e'], 'Required Options:'],
        [['d', 'f'], 'Required Options (at least one):'],
        [['h', 'g'], 'Required Options (mutually exclusive):'],
        [
          ['a', 'b', 'c', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q'],
          'Optional Options:'
        ],
        [['help'], 'Common Options:'],
        // * Second pass
        [['e', 'm'], 'Required Options:'],
        [['d', 'f'], 'Required Options 1 (at least one):'],
        [['d', 'n'], 'Required Options 2 (at least one):'],
        [['h', 'g'], 'Required Options 1 (mutually exclusive):'],
        [['h', 'o'], 'Required Options 2 (mutually exclusive):'],
        [['a', 'b', 'c', 'i', 'j', 'k', 'l', 'p', 'q'], 'Optional Options:'],
        [['help'], 'Common Options:']
      ]);
    });

    it('can configure common options (cannot be in both optional and common options)', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: {}
        },
        builderExtensionsConfig: { commonOptions: ['help', 'version', 'a'] }
      });

      const { handlerResult } = await runner({});

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([
        // * First pass
        [['b'], 'Optional Options:'],
        [['help', 'version', 'a'], 'Common Options:'],
        // * Second pass
        [['b'], 'Optional Options:'],
        [['help', 'version', 'a'], 'Common Options:']
      ]);
    });

    it('can configure 0 common options', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: {}
        },
        builderExtensionsConfig: { commonOptions: [] }
      });

      const { handlerResult } = await runner({});

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([
        // * First pass
        [['a', 'b'], 'Optional Options:'],
        // * Second pass
        [['a', 'b'], 'Optional Options:']
      ]);
    });

    it('can override group configurations on a per-option level with correct duplication', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { demandThisOption: true, requires: 'b', group: 'Custom Options:' },
          b: { group: 'Custom Options:' },
          c: {}
        },
        builderExtensionsConfig: { commonOptions: ['help', 'version', 'a'] }
      });

      const { handlerResult } = await runner({});

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([
        // * First pass
        [['a'], 'Required Options:'],
        [['a', 'b'], 'Custom Options:'],
        [['c'], 'Optional Options:'],
        [['help', 'version', 'a'], 'Common Options:'],
        // * Second pass
        [['a'], 'Required Options:'],
        [['a', 'b'], 'Custom Options:'],
        [['c'], 'Optional Options:'],
        [['help', 'version', 'a'], 'Common Options:']
      ]);
    });

    it('can be disabled', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: {}
        },
        builderExtensionsConfig: {
          commonOptions: ['help', 'version', 'a'],
          disableAutomaticGrouping: true
        }
      });

      const { handlerResult } = await runner({});

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([]);
    });
  });

  describe('automatic sorting of options', () => {
    it('can enable sorting options', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          za: { requires: 'be' },
          be: { conflicts: 'bE' },
          bE: { implies: { d: -1 } },
          d: { demandThisOptionIf: 'be' },
          easy: { demandThisOption: true },
          vef: { demandThisOptionOr: 'd' },
          gas: { demandThisOptionXor: 'eh' },
          eh: { check: (_h, _argv) => true },
          win: {},
          jack: {},
          jak: {},
          lack: {},
          bam: {},
          bag: {},
          onto: {},
          rap: {},
          dequeue: {}
        },
        builderExtensionsConfig: {
          enableAutomaticSorting: true
        }
      });

      const { handlerResult, firstPassResult, secondPassResult } = await runner({
        help: true
      });

      expect(handlerResult).toSatisfy(isCliError);
      expect(firstPassResult).toStrictEqual(secondPassResult);

      expect(Object.keys(firstPassResult)).toStrictEqual([
        'bag',
        'bam',
        'be',
        'bE',
        'd',
        'dequeue',
        'easy',
        'eh',
        'gas',
        'jack',
        'jak',
        'lack',
        'onto',
        'rap',
        'vef',
        'win',
        'za'
      ]);
    });
  });
});

describe('::withUsageExtensions', () => {
  it('outputs consistent usage string template when called without parameters', async () => {
    expect.hasAssertions();
    expect(withUsageExtensions()).toBe('Usage: $000 [...options]\n\n$1.');
  });

  it('appends passed parameter to consistent usage string template', async () => {
    expect.hasAssertions();
    expect(withUsageExtensions('new description')).toBe(
      'Usage: $000 [...options]\n\nnew description.'
    );
  });

  it('respects "trim" option', async () => {
    expect.hasAssertions();

    const expected = `
new description
`;

    expect(withUsageExtensions(expected, { trim: true })).toBe(
      `Usage: $000 [...options]\n\n${expected.trim()}.`
    );

    expect(withUsageExtensions(expected, { trim: false })).toBe(
      `Usage: $000 [...options]\n\n${expected}.`
    );
  });

  it('respects "appendPeriod" option', async () => {
    expect.hasAssertions();

    const expected = `
new description
`;

    expect(withUsageExtensions(expected, { appendPeriod: true })).toBe(
      `Usage: $000 [...options]\n\n${expected.trim()}.`
    );

    expect(withUsageExtensions(expected, { appendPeriod: false })).toBe(
      `Usage: $000 [...options]\n\n${expected.trim()}`
    );
  });

  it('respects "prependNewlines" option (and uses it as default for "includeOptions")', async () => {
    expect.hasAssertions();

    const expected = `
new description
`;

    expect(withUsageExtensions(expected, { prependNewlines: true })).toBe(
      `Usage: $000 [...options]\n\n${expected.trim()}.`
    );

    expect(withUsageExtensions(expected, { prependNewlines: false })).toBe(
      `Usage: $000${expected.trim()}.`
    );

    expect(withUsageExtensions(expected, { prependNewlines: false, trim: false })).toBe(
      `Usage: $000${expected}.`
    );
  });

  it('respects "includeOptions" option', async () => {
    expect.hasAssertions();

    const expected = `
new description
`;

    expect(
      withUsageExtensions(expected, { includeOptions: true, prependNewlines: false })
    ).toBe(`Usage: $000 [...options]${expected.trim()}.`);

    expect(withUsageExtensions(expected, { includeOptions: false })).toBe(
      `Usage: $000\n\n${expected.trim()}.`
    );

    expect(
      withUsageExtensions(expected, { includeOptions: false, prependNewlines: true })
    ).toBe(`Usage: $000\n\n${expected.trim()}.`);
  });

  describe('readme examples', () => {
    test('withUsageExtensions example functions as expected', async () => {
      expect.hasAssertions();

      const str =
        "$1.\n\nAdditional description text that only appears in this command's help text.";

      expect(withUsageExtensions(str)).toBe(`Usage: $000 [...options]\n\n${str}`);
    });
  });
});

describe('::getInvocableExtendedHandler', () => {
  it('works with normal and strictly typed custom execution contexts', async () => {
    expect.hasAssertions();

    let result = 0;

    const normalCommand = (_: ExecutionContext) => {
      const [builder, withHandlerExtensions] = withBuilderExtensions<
        { x: number },
        ExecutionContext
      >();

      return {
        builder,
        handler: withHandlerExtensions((argv) => void (result = argv.x))
      };
    };

    const strictCommand = (_: AsStrictExecutionContext<ExecutionContext>) => {
      const [builder, withHandlerExtensions] = withBuilderExtensions<
        { x: number },
        ExecutionContext
      >();

      return {
        builder,
        handler: withHandlerExtensions((argv) => void (result = argv.x))
      };
    };

    const normalHandler = await getInvocableExtendedHandler(
      normalCommand,
      generateFakeExecutionContext()
    );

    const strictHandler = await getInvocableExtendedHandler(
      strictCommand,
      generateFakeExecutionContext()
    );

    expect(result).toBe(0);

    await normalHandler({ x: 1 } as Parameters<typeof normalHandler>[0]);

    expect(result).toBe(1);

    await strictHandler({ x: 2 } as Parameters<typeof normalHandler>[0]);

    expect(result).toBe(2);
  });

  it('works with all promisable ImportConfigurationModule types including CJS-ESM interop', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockArgv = { $0: 'custom name' } as Arguments;

    const literalFunction = (_: ExecutionContext) => {
      const [builder, withHandlerExtensions] = withBuilderExtensions();

      return {
        builder,
        handler: withHandlerExtensions(mockCustomHandler)
      };
    };

    const literalObject = literalFunction({} as ExecutionContext);
    const promisedLiteralFunction = Promise.resolve().then(() => literalFunction);

    const promisedLiteralObject = Promise.resolve().then(() =>
      literalFunction({} as ExecutionContext)
    );

    const interopLiteralFunction = Promise.resolve().then(() => ({
      default: literalFunction
    }));

    const interopLiteralObject = Promise.resolve().then(() => ({
      default: literalFunction({} as ExecutionContext)
    }));

    const interop2LiteralFunction = Promise.resolve().then(() => ({
      default: { default: literalFunction }
    }));

    const interop2LiteralObject = Promise.resolve().then(() => ({
      default: { default: literalFunction({} as ExecutionContext) }
    }));

    {
      const handler = await getInvocableExtendedHandler(
        literalFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        literalObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        promisedLiteralFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        promisedLiteralObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interopLiteralFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interopLiteralObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interop2LiteralFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interop2LiteralObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    expect(mockCustomHandler.mock.calls).toStrictEqual([
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })],
      [expect.objectContaining({ $0: 'custom name' })]
    ]);
  });

  it('works when resolved command builder is not a function', async () => {
    expect.hasAssertions();

    {
      const mockCustomHandler = jest.fn();
      const mockArgv = {} as Arguments;

      const handler = await getInvocableExtendedHandler(
        { handler: mockCustomHandler },
        generateFakeExecutionContext()
      );

      await handler(mockArgv);

      expect(mockCustomHandler.mock.calls).toStrictEqual([
        [expect.objectContaining({ $0: '<unknown name>' })]
      ]);
    }

    {
      const mockCustomHandler = jest.fn();

      const handler = await getInvocableExtendedHandler<
        { test: boolean },
        ExecutionContext
      >(
        { builder: { test: { boolean: true } }, handler: mockCustomHandler },
        generateFakeExecutionContext()
      );

      await handler({ test: true });

      expect(mockCustomHandler.mock.calls).toStrictEqual([
        [expect.objectContaining({ $0: '<unknown name>', test: true })]
      ]);
    }
  });

  it('adds $artificiallyInvoked to argv', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockContext = generateFakeExecutionContext();

    const mockArgv = {
      $0: 'fake',
      _: [],
      x: 1,
      [$executionContext]: mockContext
    } as Arguments;

    const handler = await getInvocableExtendedHandler(
      { handler: mockCustomHandler },
      mockContext
    );

    await handler(mockArgv);

    expect(mockCustomHandler.mock.calls).toStrictEqual([
      [{ ...mockArgv, [$artificiallyInvoked]: true }]
    ]);
  });

  it('integrates with builder and handler extensions', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockContext = generateFakeExecutionContext();

    const handler = await getInvocableExtendedHandler<
      {
        clickityClackity?: boolean;
        'clickity-clackity'?: boolean;
        rickityRackity?: boolean;
        'rickity-rackity'?: boolean;
      },
      typeof mockContext
    >(function command(_: AsStrictExecutionContext<typeof mockContext>) {
      const [builder, withHandlerExtensions] = withBuilderExtensions({
        'clickity-clackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'rickity-rackity'
        },
        'rickity-rackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'clickity-clackity'
        }
      });

      return {
        builder,
        handler: withHandlerExtensions(mockCustomHandler)
      };
    }, mockContext);

    await handler({
      $0: 'fake',
      _: [],
      clickityClackity: true,
      rickityRackity: false,
      [$executionContext]: mockContext
    });

    expect(mockCustomHandler).toHaveBeenCalledTimes(1);

    await handler({
      $0: 'fake',
      _: [],
      'clickity-clackity': false,
      'rickity-rackity': true,
      [$executionContext]: mockContext
    });

    expect(mockCustomHandler).toHaveBeenCalledTimes(2);

    await handler({
      $0: 'fake',
      _: [],
      'clickity-clackity': true,
      rickityRackity: true,
      [$executionContext]: mockContext
    });

    expect(mockCustomHandler).toHaveBeenCalledTimes(3);
  });

  it('does not trigger checks in artificially-invoked extended handlers', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockContext = generateFakeExecutionContext();

    const handler = await getInvocableExtendedHandler(function command(
      _: AsStrictExecutionContext<typeof mockContext>
    ) {
      const [builder, withHandlerExtensions] = withBuilderExtensions({
        'clickity-clackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'rickity-rackity'
        },
        'rickity-rackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'clickity-clackity'
        }
      });

      return {
        builder,
        handler: withHandlerExtensions(mockCustomHandler)
      };
    }, mockContext);

    await handler({ $0: 'fake', _: [], [$executionContext]: mockContext });
    expect(mockCustomHandler).toHaveBeenCalled();
  });

  it('does not bleed context or "cross-talk" between invocations', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn((argv) => {
      argv[$executionContext].state.changed =
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (argv[$executionContext].state.changed || 0) + 5;
    });

    const mockContext = generateFakeExecutionContext();

    type MockCommandArgs = {
      'clickity-clackity'?: boolean;
      'rickity-rackity'?: boolean;
    };

    const mockCommand = function command(
      _: AsStrictExecutionContext<typeof mockContext>
    ) {
      const [builder, withHandlerExtensions] = withBuilderExtensions({
        'clickity-clackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'rickity-rackity'
        },
        'rickity-rackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'clickity-clackity'
        }
      });

      return {
        builder,
        handler: withHandlerExtensions(mockCustomHandler)
      };
    };

    {
      const handler = await getInvocableExtendedHandler<
        MockCommandArgs,
        typeof mockContext
      >(mockCommand, mockContext);

      await handler({ 'clickity-clackity': true });
    }

    {
      const handler = await getInvocableExtendedHandler<
        MockCommandArgs,
        typeof mockContext
      >(mockCommand, mockContext);

      await handler({});
    }

    expect(mockCustomHandler.mock.calls).toStrictEqual([
      [
        expect.objectContaining({
          [$executionContext]: expect.objectContaining({
            state: expect.objectContaining({ changed: 5 })
          })
        })
      ],
      [
        expect.objectContaining({
          [$executionContext]: expect.objectContaining({
            state: expect.objectContaining({ changed: 5 })
          })
        })
      ]
    ]);
  });

  it('works when optional argv properties are not provided', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockContext = generateFakeExecutionContext();

    const handler = await getInvocableExtendedHandler<
      { 'clickity-clackity'?: boolean; 'rickity-rackity'?: boolean },
      typeof mockContext
    >(function command(_: AsStrictExecutionContext<typeof mockContext>) {
      const [builder, withHandlerExtensions] = withBuilderExtensions({
        'clickity-clackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'rickity-rackity'
        },
        'rickity-rackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'clickity-clackity'
        }
      });

      return {
        builder,
        handler: withHandlerExtensions(mockCustomHandler)
      };
    }, mockContext);

    await handler({});

    expect(mockCustomHandler.mock.calls).toStrictEqual([
      [
        {
          $0: '<unknown name>',
          _: [],
          [$artificiallyInvoked]: true,
          [$executionContext]: {
            commands: expect.anything(),
            debug: expect.anything(),
            state: expect.anything()
          }
        }
      ]
    ]);
  });

  it('runs safeDeepClone with respect to context.state.extensions', async () => {
    expect.hasAssertions();

    const mockContext = generateFakeExecutionContext();

    mockContext.fake = { should: 'transfer' };
    mockContext.state.extensions = { transfer: [mockContext.fake] };

    const handler = await getInvocableExtendedHandler<
      { 'clickity-clackity'?: boolean; 'rickity-rackity'?: boolean },
      typeof mockContext
    >(function command(_: AsStrictExecutionContext<typeof mockContext>) {
      const [builder, withHandlerExtensions] = withBuilderExtensions({
        'clickity-clackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'rickity-rackity'
        },
        'rickity-rackity': {
          boolean: true,
          default: false,
          demandThisOptionOr: 'clickity-clackity'
        }
      });

      return {
        builder,
        handler: withHandlerExtensions((argv) => {
          expect(argv[$executionContext]).not.toBe(mockContext);
          expect(argv[$executionContext].fake).toBe(mockContext.fake);
          expect(argv[$executionContext].state).not.toBe(mockContext.state);
        })
      };
    }, mockContext);

    await handler({});
  });

  it('throws a framework error if resolved command is falsy', async () => {
    expect.hasAssertions();

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler(undefined, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(': ' + BfeErrorMessage.FalsyCommandExport())
    });

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler(Promise.resolve(), generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(': ' + BfeErrorMessage.FalsyCommandExport())
    });

    await expect(
      getInvocableExtendedHandler(
        // @ts-expect-error: bad parameter
        Promise.resolve().then(() => ({ default: false })),
        generateFakeExecutionContext()
      )
    ).rejects.toMatchObject({
      message: expect.stringContaining(': ' + BfeErrorMessage.FalsyCommandExport())
    });

    await expect(
      getInvocableExtendedHandler(
        // @ts-expect-error: bad parameter
        Promise.resolve().then(() => ({ default: { default: false } })),
        generateFakeExecutionContext()
      )
    ).rejects.toMatchObject({
      message: expect.stringContaining(': ' + BfeErrorMessage.FalsyCommandExport())
    });
  });

  it('throws a framework error if resolved command handler is falsy', async () => {
    expect.hasAssertions();

    await expect(
      getInvocableExtendedHandler({}, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(
        ': ' + BfeErrorMessage.CommandHandlerNotAFunction()
      )
    });

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler({ command: false }, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(
        ': ' + BfeErrorMessage.CommandHandlerNotAFunction()
      )
    });

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler({ command: {} }, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(
        ': ' + BfeErrorMessage.CommandHandlerNotAFunction()
      )
    });
  });

  it('throws a framework error if command import rejects', async () => {
    expect.hasAssertions();

    await expect(
      getInvocableExtendedHandler(Promise.reject(), generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(': ' + BfeErrorMessage.FalsyCommandExport())
    });
  });
});

function makeMockBuilderRunner({
  builderExtensionsConfig,
  customBuilder,
  customHandler,
  context = {},
  group = jest.fn(),
  parserConfiguration = {}
}: {
  customBuilder?: Parameters<typeof withBuilderExtensions>[0];
  builderExtensionsConfig?: Parameters<typeof withBuilderExtensions>[1];
  customHandler?: Parameters<ReturnType<typeof withBuilderExtensions>[1]>[0];
  context?: PartialDeep<ExecutionContext>;
  group?: typeof jest.fn;
  parserConfiguration?: Partial<ParserConfigurationOptions>;
} = {}) {
  const blackFlag_ = {
    group,
    getInternalMethods() {
      return {
        getParserConfiguration() {
          return parserConfiguration;
        }
      };
    }
  } as unknown as Parameters<ReturnType<typeof withBuilderExtensions>[0]>[0];

  return async function mockRunner(
    /**
     * In its tuple-object form, the first and second indices correspond to the
     * dummy arguments object available to second pass and handler respectively.
     */
    dummyArgv:
      | Record<string, unknown>
      | [Record<string, unknown>, Record<string, unknown>],
    /**
     * In its tuple-array form, the first and second indices correspond to the
     * default dummy arguments for the second pass and handler respectively.
     */
    defaultedDummyArgs: string[] | [string[], string[]] = []
  ) {
    const firstPassDefaultedDummyArgs = Array.isArray(defaultedDummyArgs[0])
      ? defaultedDummyArgs[0]
      : defaultedDummyArgs;

    const secondPassDefaultedDummyArgs = Array.isArray(defaultedDummyArgs[1])
      ? defaultedDummyArgs[1]
      : defaultedDummyArgs;

    const firstPassDummyArgv = {
      _: [],
      $0: 'fake',
      ...(Array.isArray(dummyArgv) ? dummyArgv[0] : dummyArgv),
      [$executionContext]: deepMerge(generateFakeExecutionContext(), context)
    };

    const secondPassDummyArgv = {
      _: [],
      $0: 'fake',
      ...(Array.isArray(dummyArgv) ? dummyArgv[1] : dummyArgv),
      [$executionContext]: deepMerge(generateFakeExecutionContext(), context)
    };

    const dummyHelperProgram = { ...blackFlag_, parsed: undefined as unknown };
    const dummyEffectorProgram = { ...blackFlag_, parsed: undefined as unknown };

    const helpOrVersionSet = !!(
      context.state?.isHandlingHelpOption || context.state?.isHandlingVersionOption
    );

    const [builder, withHandlerExtensions] = withBuilderExtensions(
      customBuilder,
      builderExtensionsConfig
    );

    const firstPassResult = await trycatch(() =>
      builder(dummyHelperProgram, helpOrVersionSet, undefined)
    );

    dummyHelperProgram.parsed = {
      defaulted: Object.fromEntries(
        firstPassDefaultedDummyArgs.map((name) => [name, true])
      )
    };

    const secondPassResult =
      isNativeError(firstPassResult) || !!context.state?.isHandlingVersionOption
        ? undefined
        : await trycatch(() =>
            builder(dummyEffectorProgram, helpOrVersionSet, firstPassDummyArgv)
          );

    dummyEffectorProgram.parsed = {
      defaulted: Object.fromEntries(
        secondPassDefaultedDummyArgs.map((name) => [name, true])
      )
    };

    const handlerResult =
      !secondPassResult || isNativeError(secondPassResult) || helpOrVersionSet
        ? undefined
        : await trycatch(() =>
            withHandlerExtensions(customHandler)(secondPassDummyArgv)
          );

    return { firstPassResult, secondPassResult, handlerResult };
  };
}

function generateFakeExecutionContext() {
  return {
    commands: new Map(),
    debug: jest.fn(),
    state: {}
  } as unknown as ExecutionContext;
}

async function trycatch<T extends () => any>(fn: T): Promise<ReturnType<T> | Error> {
  try {
    // ? fn() could return literally anything, including a promise
    return await fn();
  } catch (error) {
    return error as Error;
  }
}
