// @ts-check
// ! It is imperative that operations performed by this script are IDEMPOTENT!

/**
 ** This script works around some weirdo bug in TypeScript's nodenext module
 ** resolution algorithm where it tries to grab types from a nested version of
 ** the root package, which screws everything up.
 **
 ** If you're reading this, consider opening an issue against the TS repo. This
 ** bad behavior should be pretty easy to reproduce.
 **
 */

import { rm } from 'node:fs/promises';

import { toAbsolutePath, toPath } from '@-xun/fs';
import { isAccessible } from '@-xun/project-fs';
import { glob } from 'glob';
import { createGenericLogger } from 'rejoinder';

process.env.DEBUG_COLOR ??= 'true';

const root = toAbsolutePath(import.meta.dirname);
const log = createGenericLogger({
  namespace: `@black-flag/extensions:post-install`
});

const projectRootNodeModulesBfDir = toPath(
  root,
  '../../node_modules/@-xun/symbiote/node_modules/@black-flag'
);

if (!(await isAccessible(projectRootNodeModulesBfDir, { useCached: true }))) {
  log.warn('Directory is unexpectedly not-readable: ' + projectRootNodeModulesBfDir);
} else {
  const dtsFiles = await glob('**/*.d.ts', {
    absolute: true,
    cwd: projectRootNodeModulesBfDir,
    nodir: true
  });

  await Promise.all(dtsFiles.map((file) => rm(file)));

  log(
    'Recursively deleted %O TypeScript definition files in:\n%O',
    dtsFiles.length,
    projectRootNodeModulesBfDir
  );
}
