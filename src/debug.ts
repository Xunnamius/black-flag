import { createDebugLogger } from 'multiverse/rejoinder';
import { name as pkgName } from 'package';

const rootDebugLogger = createDebugLogger({ namespace: pkgName });

/**
 * @internal
 */
export function getRootDebugLogger() {
  return rootDebugLogger;
}
