/* eslint-disable unicorn/prefer-export-from */

import { hideBin as hideBin_ } from 'yargs/helpers';

export { isCliError, isGracefulEarlyExitError } from 'universe/error';
export { makeRunner } from 'universe/util';

/**
 * @see https://yargs.js.org/docs/#api-reference
 */
export const hideBin = hideBin_;
