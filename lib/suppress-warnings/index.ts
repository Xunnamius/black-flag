/**
 * Places a filter in front of all current `'warning'` event handlers attached
 * to `globalThis.process`. This filter quietly swallows any warning events
 * matching `name` while letting others pass through like normal.
 *
 * **IMPORTANT: Imports that might generate warnings must occur _AFTER_ this
 * function is executed. If warning suppression isn't working for you, it means
 * you must use _dynamic imports_, and they must occur _AFTER_ this function is
 * executed.**
 *
 * On the other hand, imports that might add additional `'warning'` event
 * handlers must occur _BEFORE_ this function is executed. Any handlers added
 * after this function executes will not be suppressed.
 *
 * Common warning names include:
 *
 * - `"DeprecationWarning"`
 * - `"ExperimentalWarning"`
 * - `"MaxListenersExceededWarning"`
 * - `"TimeoutOverflowWarning"`
 * - `"UnsupportedWarning"`
 *
 * Note that this function does not rely on any horrifying hacks redefining
 * `process.emit` or anything crazy like that.
 *
 * @see https://nodejs.org/api/process.html#nodejs-warning-names
 * @see https://nodejs.org/api/process.html#event-warning
 * @see https://github.com/nodejs/node/issues/30810#issuecomment-1252948007
 */
export function suppressNodeWarnings(name: string | string[]) {
  const originalWarningListeners = process.listeners('warning');
  const suppressionTargets = [name].flat();

  if (originalWarningListeners.length) {
    process.removeAllListeners('warning');
    process.prependListener('warning', (warning) => {
      if (!suppressionTargets.includes(warning.name)) {
        originalWarningListeners.forEach((listener) => listener(warning));
      }
    });
  }
}
