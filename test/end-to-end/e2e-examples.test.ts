// * These tests run through the entire process of acquiring this software,
// * using its features as described in the examples documentation, and dealing
// * with its error conditions across a variety of runtimes (e.g. the currently
// * maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

import { toAbsolutePath, toDirname, toPath } from '@-xun/fs';
import { run, runNoRejectOnBadExit } from '@-xun/run';
import { createDebugLogger } from 'rejoinder';

import { exports as packageExports, name as packageName } from 'rootverse:package.json';

import {
  ensurePackageHasBeenBuilt,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested
} from 'testverse:util.ts';

const shortIdentifier = packageName.split('/').at(-1)!;
const TEST_IDENTIFIER = `${shortIdentifier}-e2e-examples`;
const EXAMPLES_DIR_BF = toPath(__dirname, '../..', 'examples/black-flag');
const EXAMPLES_DIR_BFE = toPath(__dirname, '../..', 'examples/black-flag-extensions');

const debug = createDebugLogger({ namespace: shortIdentifier }).extend(TEST_IDENTIFIER);
const nodeVersion = process.env.XPIPE_MATRIX_NODE_VERSION || process.version;

debug(`nodeVersion: "${nodeVersion}" (process.version=${process.version})`);

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true, test: true });

beforeAll(async () => {
  await ensurePackageHasBeenBuilt(
    toDirname(toAbsolutePath(require.resolve('rootverse:package.json'))),
    packageName,
    packageExports
  );
});

describe('./examples', () => {
  describe('./black-flag', () => {
    test('advanced', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'advanced');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('builder', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'builder');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('context', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'context');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('dynamic', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'dynamic');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('error', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'error');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('esm-cjs', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'esm-cjs');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('exports', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'exports');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('hierarchy', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'hierarchy');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('hooks', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'hooks');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('positional', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'positional');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('shared', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'shared');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('testing', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'testing');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('typescript', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BF, 'typescript');

      await run('npm', ['install'], { cwd });
      await run('npm', ['run', 'build'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });
  });

  describe('./black-flag-extensions', () => {
    test('artificial', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'artificial');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('builder', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'builder');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('checks', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'checks');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('grouping', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'grouping');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('myctl', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'myctl');

      await run('npm', ['install'], { cwd });
      await run('npm', ['run', 'build'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('passthrough', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'passthrough');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('sorting', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'sorting');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('suboptionof', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'suboptionof');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });

    test('usage', async () => {
      expect.hasAssertions();

      const cwd = toPath(EXAMPLES_DIR_BFE, 'usage');

      await run('npm', ['install'], { cwd });

      const { exitCode, stdout, stderr } = await runNoRejectOnBadExit('npm', ['test'], {
        cwd
      });

      expect({ exitCode, stdout, stderr }).toStrictEqual({
        exitCode: 0,
        stdout: expect.anything(),
        stderr: expect.stringContaining('PASS')
      });
    });
  });
});
