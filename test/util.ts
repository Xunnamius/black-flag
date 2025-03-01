/**
 ** This file exports test utilities specific to this project and beyond what is
 ** exported by @-xun/jest; these can be imported using the testversal aliases.
 */

import { toPath } from '@-xun/fs';

// ? @-xun/jest will always come from @-xun/symbiote (i.e. transitively)
// {@symbiote/notInvalid @-xun/jest}

export * from '@-xun/jest';

export function getFixturePath(fixture: string | string[]) {
  return toPath(__dirname, 'fixtures', ...[fixture].flat());
}

export function expectedCommandsRegex(
  childCommands: (string | [command: string, descriptionRegex: string])[],
  parentFullName = require('testverse:fixtures/package.json').name as string,
  childDescriptionRegex = '[A-Z]',
  includeFinalNewline = true
) {
  return new RegExp(
    String.raw`Commands:\n\s+` +
      childCommands
        .map(
          (cmd) =>
            String.raw`\s+` +
            parentFullName +
            String.raw`\s+` +
            (Array.isArray(cmd) ? cmd[0] : cmd) +
            `\\s*${Array.isArray(cmd) ? cmd[1] : childDescriptionRegex}[^\\n]*\\n`
        )
        .join('') +
      (includeFinalNewline ? String.raw`\n` : '')
  );
}
