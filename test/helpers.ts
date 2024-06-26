import path from 'node:path';

export function getFixturePath(fixture: string | string[]) {
  return path.join(__dirname, 'fixtures', ...[fixture].flat());
}

export function expectedCommandsRegex(
  childCommands: (string | [command: string, descriptionRegex: string])[],
  parentFullName = require(`./fixtures/package.json`).name,
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
