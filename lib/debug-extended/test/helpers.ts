import { type ExtendedDebugger } from 'multiverse/debug-extended/index';

export function expectExtendedDebugger(instance: unknown): boolean | void {
  const dbg = instance as ExtendedDebugger;

  expectUnextendableDebugger(dbg.message);
  expectUnextendableDebugger(dbg.error);
  expectUnextendableDebugger(dbg.warn);

  expect(instance).toHaveProperty('extend');
  expect(instance).toHaveProperty('newline');
}

export function expectUnextendableDebugger(instance: unknown): boolean | void {
  expect(instance).not.toHaveProperty('message');
  expect(instance).not.toHaveProperty('error');
  expect(instance).not.toHaveProperty('warn');
  expect(instance).toHaveProperty('extend');
  expect(instance).not.toHaveProperty('newline');

  expect(() => (instance as ExtendedDebugger).extend('dummy')).toThrow(
    /instance is not extendable/
  );
}
