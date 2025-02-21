import { createDebugLogger } from 'rejoinder';
import { name as pkgName } from 'rootverse:package.json';

const rootDebugLogger = createDebugLogger({ namespace: pkgName });

/**
 * @internal
 */
export function getRootDebugLogger() {
  return rootDebugLogger;
}
