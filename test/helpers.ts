import path from 'node:path';

export function getFixturePath(fixture: string | string[]) {
  return path.join(__dirname, 'fixtures', ...[fixture].flat());
}

export function expectedCommandsRegex(
  childCommands: (string | [command: string, descriptionRegex: string])[],
  parentFullName = require(`./fixtures/package.json`).name,
  parentDescriptionRegex?: string,
  childDescriptionRegex = '[A-Z]',
  includeFinalNewline = true
) {
  return new RegExp(
    'Commands:\\n\\s+' +
      parentFullName +
      `\\s+${parentDescriptionRegex ?? childDescriptionRegex}[^\\n]*${
        parentDescriptionRegex ? '' : '\\s+\\[default][^\\n]*'
      }\\n` +
      childCommands
        .map(
          (cmd) =>
            '\\s+' +
            parentFullName +
            '\\s+' +
            (Array.isArray(cmd) ? cmd[0] : cmd) +
            `\\s+${Array.isArray(cmd) ? cmd[1] : childDescriptionRegex}[^\\n]*\\n`
        )
        .join('') +
      (includeFinalNewline ? '\\n' : '')
  );
}
