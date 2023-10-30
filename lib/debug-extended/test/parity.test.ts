import { debugFactory as debug } from 'multiverse/debug-extended';

// * This test ensures that debug-extended maintains feature parity with debug.
// * To this end, this test suite is taken straight from
// * https://github.com/debug-js/debug/blob/master/test.js

describe('debug-js feature parity', () => {
  it('passes a basic sanity check', () => {
    expect.hasAssertions();

    const log = debug('test');
    log.enabled = true;
    log.log = () => {};

    expect(() => log('hello world')).not.toThrow();
  });

  it('allows namespaces to be a non-string value', () => {
    expect.hasAssertions();

    const log = debug('test');
    log.enabled = true;
    log.log = () => {};

    // @ts-expect-error: wrong on purpose
    expect(() => debug.enable(true)).not.toThrow();
  });

  it('honors global debug namespace enable calls', () => {
    expect.hasAssertions();

    expect(debug('test:12345').enabled).toBeFalse();
    expect(debug('test:67890').enabled).toBeFalse();

    debug.enable('test:12345');

    expect(debug('test:12345').enabled).toBeTrue();
    expect(debug('test:67890').enabled).toBeFalse();
  });

  it('uses custom log function', () => {
    expect.hasAssertions();

    const log = debug('test');
    log.enabled = true;

    const calls: unknown[] = [];
    log.log = (...args: string[]) => calls.push(args);

    log('using custom log function');
    log('using custom log function again');
    log('%O', 12_345);

    expect(calls).toHaveLength(3);
  });

  describe('extend namespace', () => {
    it('should extend namespace', () => {
      expect.hasAssertions();

      const log = debug('foo');
      log.enabled = true;
      log.log = () => {};

      const logBar = log.extend('bar');
      expect(logBar.namespace).toBe('foo:bar');
    });

    it('should extend namespace with custom delimiter', () => {
      expect.hasAssertions();

      const log = debug('foo');
      log.enabled = true;
      log.log = () => {};

      const logBar = log.extend('bar', '--');
      expect(logBar.namespace).toBe('foo--bar');
    });

    it('should extend namespace with empty delimiter', () => {
      expect.hasAssertions();

      const log = debug('foo');
      log.enabled = true;
      log.log = () => {};

      const logBar = log.extend('bar', '');
      expect(logBar.namespace).toBe('foobar');
    });

    it('should keep the log function between extensions', () => {
      expect.hasAssertions();

      const log = debug('foo');
      log.log = () => {};

      const logBar = log.extend('bar');
      expect(log.log).toBe(logBar.log);
    });
  });

  describe('rebuild namespaces string (disable)', () => {
    it('handle names, skips, and wildcards', () => {
      expect.hasAssertions();

      debug.enable('test,abc*,-abc');
      const namespaces = debug.disable();
      expect(namespaces).toBe('test,abc*,-abc');
    });

    it('handles empty', () => {
      expect.hasAssertions();

      debug.enable('');
      const namespaces = debug.disable();
      expect(namespaces).toBe('');
      expect(debug.names).toStrictEqual([]);
      expect(debug.skips).toStrictEqual([]);
    });

    it('handles all', () => {
      expect.hasAssertions();

      debug.enable('*');
      const namespaces = debug.disable();
      expect(namespaces).toBe('*');
    });

    it('handles skip all', () => {
      expect.hasAssertions();

      debug.enable('-*');
      const namespaces = debug.disable();
      expect(namespaces).toBe('-*');
    });

    it('names+skips same with new string', () => {
      expect.hasAssertions();

      debug.enable('test,abc*,-abc');
      const oldNames = [...debug.names];
      const oldSkips = [...debug.skips];
      const namespaces = debug.disable();
      expect(namespaces).toBe('test,abc*,-abc');
      debug.enable(namespaces);
      expect(oldNames.map(String)).toStrictEqual(debug.names.map(String));
      expect(oldSkips.map(String)).toStrictEqual(debug.skips.map(String));
    });

    it('handles re-enabling existing instances', () => {
      expect.hasAssertions();

      debug.disable('*');
      const inst = debug('foo');
      const messages: string[] = [];
      inst.log = (str) => messages.push(str.replace(/^[^@]*@([^@]+)@.*$/, '$1'));

      inst('@test@');
      expect(messages).toStrictEqual([]);
      debug.enable('foo');
      expect(messages).toStrictEqual([]);
      inst('@test2@');
      expect(messages).toStrictEqual(['test2']);
      inst('@test3@');
      expect(messages).toStrictEqual(['test2', 'test3']);
      debug.disable('*');
      inst('@test4@');
      expect(messages).toStrictEqual(['test2', 'test3']);
    });
  });
});
