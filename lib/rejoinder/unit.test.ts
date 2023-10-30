import { Manager } from '@listr2/manager';

import { type ExtendedDebugger } from 'multiverse/debug-extended';
import { withMockedEnv, withMockedOutput } from 'testverse/setup';

import {
  TAB,
  createDebugLogger,
  createGenericLogger,
  createListrManager,
  createListrTaskLogger,
  disableLoggers,
  disableLoggingByTag,
  enableLoggers,
  enableLoggingByTag,
  getLoggersByType,
  resetInternalState,
  type ExtendedLogger,
  type GenericListrTask
} from 'multiverse/rejoinder';

const namespace = 'namespace';

beforeEach(() => {
  resetInternalState();
});

describe('::TAB', () => {
  it('exports TAB', async () => {
    expect.hasAssertions();
    expect(TAB).toBeString();
  });
});

describe('::createGenericLogger', () => {
  it('returns ExtendedLogger instance', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ logSpy }) => {
      const log = createGenericLogger({ namespace });

      expect(log.enabled).toBeTrue();
      expect(log.log).toBeDefined();

      log('logged');

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([expect.stringMatching(/namespace.+logged/)])
      ]);
    });
  });

  it('returns instance capable of handling complex input', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ logSpy }) => {
      const log = createGenericLogger({ namespace });

      expect(log.enabled).toBeTrue();
      expect(log.log).toBeDefined();

      log('logged: %O', { success: true });

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+logged:.+{.+success:.+true.+}/)
        ])
      ]);
    });
  });

  it('returns extensions that can themselves be extended', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ logSpy }) => {
      const log = createGenericLogger({ namespace });
      const extension1 = log.extend(namespace);
      const extension2 = extension1.extend(namespace);

      expect(log.enabled).toBeTrue();
      expect(extension1.enabled).toBeTrue();
      expect(extension2.enabled).toBeTrue();

      expect(log.log).toBeDefined();
      expect(extension1.log).toBeDefined();
      expect(extension2.log).toBeDefined();

      log('logged');
      extension1('logged');
      extension2('logged');

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([expect.stringMatching(/namespace.+logged/)]),
        expect.arrayContaining([expect.stringMatching(/namespace:namespace.+logged/)]),
        expect.arrayContaining([
          expect.stringMatching(/(?:namespace:){2}namespace.+logged/)
        ])
      ]);
    });
  });

  it('is unaffected by the presence of tags by default', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ logSpy }) => {
      const log = createGenericLogger({ namespace });
      const extension = log.extend(namespace);

      log(['tag-1', 'tag-2'], 'logged: %O', { success: true });
      log.error(['tag-1', 'tag-2'], 'logged: %O', { success: true });
      log.message(['tag-1', 'tag-2'], 'logged: %O', { success: true });
      log.warn(['tag-1', 'tag-2'], 'logged: %O', { success: true });
      log.newline(['tag-1', 'tag-2']);

      extension(['tag-3', 'tag-4'], 'logged');
      extension.error(['tag-3', 'tag-4'], 'logged');
      extension.message(['tag-3', 'tag-4'], 'logged');
      extension.warn(['tag-3', 'tag-4'], 'logged');
      extension.newline(['tag-3', 'tag-4']);

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+logged:.+{.+success:.+true.+}/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace:<error>.+logged:.+{.+success:.+true.+}/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace:<message>.+logged:.+{.+success:.+true.+}/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace:<warn>.+logged:.+{.+success:.+true.+}/)
        ]),
        [''],
        expect.arrayContaining([expect.stringMatching(/namespace:namespace.+logged/)]),
        expect.arrayContaining([
          expect.stringMatching(/namespace:namespace:<error>.+logged/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace:namespace:<message>.+logged/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/(?:namespace:){2}<warn>.+logged/)
        ]),
        ['']
      ]);
    });
  });
});

describe('::createListrTaskLogger', () => {
  it('returns ExtendedLogger instance', async () => {
    expect.hasAssertions();

    const task = { output: null } as unknown as GenericListrTask;
    const log = createListrTaskLogger({ namespace, task });

    expect(log.enabled).toBeTrue();
    expect(log.log).toBeDefined();

    log('logged');
    expect(task.output).toStrictEqual(expect.stringMatching(/namespace.+logged/));
  });

  it('returns instance capable of handling complex input', async () => {
    expect.hasAssertions();

    const task = { output: null } as unknown as GenericListrTask;
    const log = createListrTaskLogger({ namespace, task });

    expect(log.enabled).toBeTrue();
    expect(log.log).toBeDefined();

    log('logged: %O', { success: true });
    expect(task.output).toStrictEqual(
      expect.stringMatching(/namespace.+logged:.+{.+success:.+true.+}/)
    );
  });

  it('returns extensions that can themselves be extended', async () => {
    expect.hasAssertions();

    const task = { output: null } as unknown as GenericListrTask;
    const log = createListrTaskLogger({ namespace, task });
    const extension1 = log.extend(namespace);
    const extension2 = extension1.extend(namespace);

    expect(log.enabled).toBeTrue();
    expect(extension1.enabled).toBeTrue();
    expect(extension2.enabled).toBeTrue();

    expect(log.log).toBeDefined();
    expect(extension1.log).toBeDefined();
    expect(extension2.log).toBeDefined();

    log('logged');
    expect(task.output).toStrictEqual(expect.stringMatching(/namespace.+logged/));

    extension1('logged');
    expect(task.output).toStrictEqual(
      expect.stringMatching(/namespace:namespace.+logged/)
    );

    extension2('logged');
    expect(task.output).toStrictEqual(
      expect.stringMatching(/(?:namespace:){2}namespace.+logged/)
    );
  });

  it('is unaffected by the presence of tags by default', async () => {
    expect.hasAssertions();

    const outputHistory: string[] = [];
    const task = {
      set output(message: string) {
        outputHistory.push(message);
      }
    } as unknown as GenericListrTask;

    const log = createListrTaskLogger({ namespace, task });
    const extension = log.extend(namespace);

    log(['tag-1', 'tag-2'], 'logged: %O', { success: true });
    log.error(['tag-1', 'tag-2'], 'logged: %O', { success: true });
    log.message(['tag-1', 'tag-2'], 'logged: %O', { success: true });
    log.warn(['tag-1', 'tag-2'], 'logged: %O', { success: true });
    log.newline(['tag-1', 'tag-2']);

    extension(['tag-1', 'tag-2'], 'logged');
    extension.error(['tag-1', 'tag-2'], 'logged');
    extension.message(['tag-1', 'tag-2'], 'logged');
    extension.warn(['tag-1', 'tag-2'], 'logged');
    extension.newline(['tag-1', 'tag-2']);

    expect(outputHistory).toStrictEqual([
      expect.stringMatching(/namespace.+logged:.+{.+success:.+true.+}/),
      expect.stringMatching(/namespace:<error>.+logged:.+{.+success:.+true.+}/),
      expect.stringMatching(/namespace:<message>.+logged:.+{.+success:.+true.+}/),
      expect.stringMatching(/namespace:<warn>.+logged:.+{.+success:.+true.+}/),
      '',
      expect.stringMatching(/namespace:namespace.+logged.+/),
      expect.stringMatching(/namespace:namespace:<error>.+logged.+/),
      expect.stringMatching(/namespace:namespace:<message>.+logged.+/),
      expect.stringMatching(/(?:namespace:){2}<warn>.+logged.+/),
      ''
    ]);
  });
});

describe('::createDebugLogger', () => {
  it('returns ExtendedDebugger instance', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ stderrSpy }) => {
      const debug = createDebugLogger({ namespace });

      debug.enabled = true;
      debug('logged');

      expect(stderrSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([expect.stringMatching(/namespace.+logged/)])
      ]);
    });
  });

  it('returns a disabled instance by default', async () => {
    expect.hasAssertions();

    const debug = createDebugLogger({ namespace });
    expect(debug.enabled).toBeFalsy();
  });

  it('returns instance capable of handling complex input', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ stderrSpy }) => {
      const debug = createDebugLogger({ namespace });

      debug.enabled = true;
      debug('logged: %O', { success: true });

      expect(stderrSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+logged:.+{.+success:.+true.+}/)
        ])
      ]);
    });
  });

  it('returns extensions that can themselves be extended', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ stderrSpy }) => {
      const debug = createDebugLogger({ namespace });
      const extension1 = debug.extend(namespace);
      const extension2 = extension1.extend(namespace);

      debug.enabled = true;
      debug('logged');

      extension1.enabled = true;
      extension1('logged');

      extension2.enabled = true;
      extension2('logged');

      expect(stderrSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([expect.stringMatching(/namespace.+logged/)]),
        expect.arrayContaining([expect.stringMatching(/namespace:namespace.+logged/)]),
        expect.arrayContaining([
          expect.stringMatching(/(?:namespace:){2}namespace.+logged/)
        ])
      ]);
    });
  });
});

describe('::createListrManager', () => {
  it('returns Listr2 Manager instance', async () => {
    expect.hasAssertions();
    expect(createListrManager()).toBeInstanceOf(Manager);
  });

  it('returns a Manager using default renderer by default', async () => {
    expect.hasAssertions();

    await withMockedEnv(() => {
      expect(createListrManager().options?.renderer).toBe('default');
    }, {});
  });

  it('returns a Manager using verbose renderer if process.env.DEBUG is present', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      () => {
        expect(createListrManager().options?.renderer).toBe('verbose');
      },
      { DEBUG: '*:*' }
    );
  });

  it('returns a Manager using verbose renderer if any debug loggers are enabled', async () => {
    expect.hasAssertions();

    createDebugLogger({ namespace }).enabled = true;
    expect(createListrManager().options?.renderer).toBe('verbose');
  });
});

describe('::disableLoggers', () => {
  const loggers: {
    log: ExtendedLogger;
    listr: ExtendedLogger;
    debug: ExtendedDebugger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = {} as any;

  beforeEach(() => {
    loggers.log = createGenericLogger({ namespace: 'generic' });
    loggers.log.log = jest.fn();

    loggers.listr = createListrTaskLogger({
      namespace: 'listr',
      task: { output: '' } as GenericListrTask
    });
    loggers.listr.log = jest.fn();

    loggers.debug = createDebugLogger({ namespace: 'debug' });
    loggers.debug.log = jest.fn();
  });

  it('disables all possible loggers if no filter specified', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    disableLoggers({ type: 'all' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalse();
  });

  it('leaves disabled loggers disabled', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    disableLoggers({ type: 'all' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalse();

    disableLoggers({ type: 'all' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalse();
  });

  it('disables loggers by namespace string exact match', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    disableLoggers({ type: 'all', filter: 'generic' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    disableLoggers({ type: 'all', filter: 'listr' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalsy();

    disableLoggers({ type: 'all', filter: 'debug' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalse();

    loggers.debug.enabled = true;

    expect(loggers.debug.enabled).toBeTrue();

    disableLoggers({ type: 'all', filter: 'debug' });

    expect(loggers.debug.enabled).toBeFalse();
  });

  it('disables loggers by namespace regex match', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    disableLoggers({ type: 'all', filter: /generic|debug/ });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalse();
  });

  it('does not reuse stateful RegExp instances', async () => {
    expect.hasAssertions();

    loggers.log.enabled = true;
    loggers.listr.enabled = true;
    loggers.debug.enabled = true;

    const parameters = { type: 'all', filter: /generic|debug/g } as const;

    disableLoggers(parameters);

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalse();

    loggers.log.enabled = true;
    loggers.listr.enabled = true;
    loggers.debug.enabled = true;

    disableLoggers(parameters);

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalse();
  });

  it('disables loggers by type match', async () => {
    expect.hasAssertions();

    loggers.debug.enabled = true;

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();

    disableLoggers({ type: 'stdout' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeTrue();

    loggers.log.enabled = true;
    loggers.listr.enabled = true;

    disableLoggers({ type: 'debug' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalse();
  });

  it('does not disable loggers with unsound combinations of matchers', async () => {
    expect.hasAssertions();

    loggers.debug.enabled = true;

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();

    disableLoggers({ type: 'all', filter: 'no-match' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();

    disableLoggers({ type: 'debug', filter: /log|listr/ });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();

    disableLoggers({ type: 'stdout', filter: /debug/ });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();
  });
});

describe('::enableLoggers', () => {
  const loggers: {
    log: ExtendedLogger;
    listr: ExtendedLogger;
    debug: ExtendedDebugger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = {} as any;

  beforeEach(() => {
    loggers.log = createGenericLogger({ namespace: 'generic' });
    loggers.log.log = jest.fn();

    loggers.listr = createListrTaskLogger({
      namespace: 'listr',
      task: { output: '' } as GenericListrTask
    });
    loggers.listr.log = jest.fn();

    loggers.debug = createDebugLogger({ namespace: 'debug' });
    loggers.debug.log = jest.fn();
  });

  it('enables all possible loggers if no filter specified', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();
  });

  it('leaves enabled loggers enabled', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();

    enableLoggers({ type: 'all' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();
  });

  it('enables loggers by namespace string exact match', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all', filter: 'generic' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all', filter: 'listr' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all', filter: 'debug' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();

    loggers.log.enabled = false;

    expect(loggers.log.enabled).toBeFalse();

    enableLoggers({ type: 'all', filter: 'generic' });

    expect(loggers.log.enabled).toBeTrue();
  });

  it('enables loggers by namespace regex match', async () => {
    expect.hasAssertions();

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all', filter: /generic|debug/ });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeTrue();
  });

  it('does not reuse stateful RegExp instances', async () => {
    expect.hasAssertions();

    loggers.log.enabled = false;
    loggers.listr.enabled = false;
    loggers.debug.enabled = false;

    const parameters = { type: 'all', filter: /generic|debug/g } as const;

    enableLoggers(parameters);

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeTrue();

    loggers.log.enabled = false;
    loggers.listr.enabled = false;
    loggers.debug.enabled = false;

    enableLoggers(parameters);

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeTrue();
  });

  it('enables loggers by type match', async () => {
    expect.hasAssertions();

    loggers.log.enabled = false;
    loggers.listr.enabled = false;

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'stdout' });

    expect(loggers.log.enabled).toBeTrue();
    expect(loggers.listr.enabled).toBeTrue();
    expect(loggers.debug.enabled).toBeFalsy();

    loggers.log.enabled = false;
    loggers.listr.enabled = false;

    enableLoggers({ type: 'debug' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeTrue();
  });

  it('does not enable loggers with unsound combinations of matchers', async () => {
    expect.hasAssertions();

    loggers.log.enabled = false;
    loggers.listr.enabled = false;

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'all', filter: 'no-match' });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'debug', filter: /log|listr/ });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalsy();

    enableLoggers({ type: 'stdout', filter: /debug/ });

    expect(loggers.log.enabled).toBeFalse();
    expect(loggers.listr.enabled).toBeFalse();
    expect(loggers.debug.enabled).toBeFalsy();
  });
});

describe('::disableLoggingByTag', () => {
  it('can disable logging across logger types including sub-loggers by tag', async () => {
    expect.hasAssertions();

    const task = { output: '' } as unknown as GenericListrTask;
    const generic = createGenericLogger({ namespace });
    const listr = createListrTaskLogger({ namespace, task });
    const genericExtended = generic.extend(namespace);
    const listrExtended = listr.extend(namespace);

    await withMockedOutput(({ logSpy }) => {
      generic(['tag-1'], 'message: %O', { success: true });
      listr(['tag-2'], 'message: %O', { success: true });
      genericExtended(['tag-1'], 'message: %O', { success: true });

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ])
      ]);

      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);

      task.output = '';
      listrExtended(['tag-2'], 'message: %O', { success: true });
      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);
    });

    task.output = '';
    disableLoggingByTag({ tags: ['tag-2'] });

    await withMockedOutput(({ logSpy }) => {
      generic(['tag-1'], 'message: %O', { success: true });
      listr(['tag-2'], 'message: %O', { success: true });
      genericExtended(['tag-1'], 'message: %O', { success: true });

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ])
      ]);

      expect(task.output).toBeEmpty();

      listrExtended(['tag-2'], 'message: %O', { success: true });
      expect(task.output).toBeEmpty();
    });

    disableLoggingByTag({ tags: ['tag-1', 'tag-2', 'tag-3'] });

    await withMockedOutput(({ logSpy }) => {
      generic(['tag-1'], 'message: %O', { success: true });
      listr(['tag-2'], 'message: %O', { success: true });
      genericExtended(['tag-1'], 'message: %O', { success: true });

      expect(logSpy.mock.calls).toBeEmpty();
      expect(task.output).toBeEmpty();

      listrExtended(['tag-2'], 'message: %O', { success: true });
      expect(task.output).toBeEmpty();
    });
  });

  it('does not prevent tag-less log calls from executing successfully', async () => {
    expect.hasAssertions();

    const task = { output: '' } as unknown as GenericListrTask;
    const generic = createGenericLogger({ namespace });
    const listr = createListrTaskLogger({ namespace, task });

    disableLoggingByTag({ tags: ['tag-1', 'tag-2', 'tag-3'] });

    await withMockedOutput(({ logSpy }) => {
      generic('message: %O', { success: true });
      listr('message: %O', { success: true });

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ])
      ]);

      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);
    });
  });
});

describe('::enableLoggingByTag', () => {
  it('can enable logging across logger types including sub-loggers by tag', async () => {
    expect.hasAssertions();

    const task = { output: '' } as unknown as GenericListrTask;
    const generic = createGenericLogger({ namespace });
    const listr = createListrTaskLogger({ namespace, task });
    const genericExtended = generic.extend(namespace);
    const listrExtended = listr.extend(namespace);

    disableLoggingByTag({ tags: ['tag-1', 'tag-2', 'tag-3'] });

    await withMockedOutput(({ logSpy }) => {
      generic(['tag-1'], 'message: %O', { success: true });
      listr(['tag-2'], 'message: %O', { success: true });
      genericExtended(['tag-1'], 'message: %O', { success: true });

      expect(logSpy.mock.calls).toBeEmpty();
      expect(task.output).toBeEmpty();

      listrExtended(['tag-2'], 'message: %O', { success: true });
      expect(task.output).toBeEmpty();
    });

    enableLoggingByTag({ tags: ['tag-2'] });

    await withMockedOutput(({ logSpy }) => {
      generic(['tag-1'], 'message: %O', { success: true });
      listr(['tag-2'], 'message: %O', { success: true });
      genericExtended(['tag-1'], 'message: %O', { success: true });

      expect(logSpy.mock.calls).toBeEmpty();
      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);

      task.output = '';
      listrExtended(['tag-2'], 'message: %O', { success: true });
      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);
    });

    enableLoggingByTag({ tags: ['tag-1', 'tag-2', 'tag-3'] });

    await withMockedOutput(({ logSpy }) => {
      generic(['tag-1'], 'message: %O', { success: true });
      listr(['tag-2'], 'message: %O', { success: true });
      genericExtended(['tag-1'], 'message: %O', { success: true });

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ]),
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ])
      ]);

      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);

      task.output = '';
      listrExtended(['tag-2'], 'message: %O', { success: true });
      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);
    });
  });

  it('does not prevent tag-less log calls from executing successfully', async () => {
    expect.hasAssertions();

    const task = { output: '' } as unknown as GenericListrTask;
    const generic = createGenericLogger({ namespace });
    const listr = createListrTaskLogger({ namespace, task });

    enableLoggingByTag({ tags: ['tag-1', 'tag-2', 'tag-3'] });

    await withMockedOutput(({ logSpy }) => {
      generic('message: %O', { success: true });
      listr('message: %O', { success: true });

      expect(logSpy.mock.calls).toStrictEqual([
        expect.arrayContaining([
          expect.stringMatching(/namespace.+message:.+{.+success:.+true.+}/)
        ])
      ]);

      expect(task.output).toMatch(/namespace.+message:.+{.+success:.+true.+}/);
    });
  });
});

describe('::getLoggersByType', () => {
  it('returns subset of loggers by type', async () => {
    expect.hasAssertions();

    const debug1 = createDebugLogger({ namespace: 'debug' });
    const log1 = createGenericLogger({ namespace: 'generic' });
    const listr1 = createListrTaskLogger({
      namespace: 'listr',
      task: { output: '' } as GenericListrTask
    });

    const debug2 = createDebugLogger({ namespace: 'debug' });
    const log2 = createGenericLogger({ namespace: 'generic' });
    const listr2 = createListrTaskLogger({
      namespace: 'listr',
      task: { output: '' } as GenericListrTask
    });

    expect(getLoggersByType({ type: 'all' })).toIncludeAllMembers([
      debug1,
      log1,
      listr1,
      debug2,
      log2,
      listr2
    ]);

    expect(getLoggersByType({ type: 'debug' })).toIncludeAllMembers([debug1, debug2]);

    expect(getLoggersByType({ type: 'stdout' })).toIncludeAllMembers([
      log1,
      listr1,
      log2,
      listr2
    ]);
  });
});
