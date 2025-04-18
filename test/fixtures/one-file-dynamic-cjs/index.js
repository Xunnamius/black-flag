// @ts-check
/// <reference path="../index.d.ts"/>

/**
 * @type {Type.ParentConfig}
 */
module.exports = {
  builder: (blackFlag, _helpOrVersionSet, argv) => {
    blackFlag.parserConfiguration({ 'parse-numbers': false });

    if (argv) {
      if (argv.lang === 'node') {
        return {
          lang: { choices: ['node'] },
          version: { choices: ['19.8', '20.9', '21.1'] }
        };
      } else if (argv.lang === 'python') {
        return {
          lang: { choices: ['python'] },
          version: {
            choices: ['3.10', '3.11', '3.12']
          }
        };
      }
    }

    return {
      lang: { choices: ['node', 'python'] },
      version: { string: true }
    };
  },
  handler: (argv) => {
    argv.handled_by = __filename;
  }
};
