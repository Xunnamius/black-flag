import type {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Arguments,
  Configuration
} from '@black-flag/core';

import type { ExecutionContext } from '@black-flag/core/util';

/**
 * The global execution context available to all commands.
 */
export type GlobalExecutionContext = ExecutionContext & {
  /**
   * Something important that all commands should have access to.
   */
  sharedData: Record<string, unknown>;
  /**
   * Whether the CLI is being run in dev mode.
   */
  isInDevMode: boolean;
};

/**
 * The options "common" among all commands. Will be used as the basis for the
 * type parameter passed to {@link Arguments}.
 */
export type GlobalCliArguments = {
  /**
   * The runtime scope selected by the user.
   */
  scope: 'local' | 'global';
  /**
   * Any extra environment variables the user wants to set. This is useful for
   * using one standard syntax for setting environment variables across all
   * operating systems!
   */
  env: string[];
};

/**
 * @see {@link GlobalCliArguments}
 */
export const globalCliArguments = {
  env: {
    string: true,
    array: true,
    default: [],
    description: 'Set cross-platform environment variables using Bourne syntax'
  },
  scope: {
    string: true,
    choices: ['local', 'global'],
    default: 'local',
    description: 'Which files this command will consider when scanning the filesystem'
  }
} satisfies Configuration['builder'];
