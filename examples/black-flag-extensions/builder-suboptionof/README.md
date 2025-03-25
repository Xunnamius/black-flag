# Black Flag Extensions: `builder::subOptionOf`

<!-- TODO -->

For another example, consider a "build" command where we want to ensure
`-⁠-⁠skip-⁠output-⁠checks` is `true` whenever
`-⁠-⁠generate-⁠types=false`/`-⁠-⁠no-⁠generate-⁠types` is given since the output
checks are only meaningful if type definition files are available:

```javascript
/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  'generate-types': {
    boolean: true,
    description: 'Output TypeScript declaration files alongside distributables',
    default: true,
    subOptionOf: {
      'generate-types': {
        // ▼ If --generate-types=false...
        when: (generateTypes) => !generateTypes,
        update: (oldConfig) => {
          return {
            ...oldConfig,
            // ▼ ... then --skip-output-checks must be true!
            implies: { 'skip-output-checks': true },
            // ▼ Since "false" options cannot imply stuff (see "implies" docs)
            // by default, we need to tell BFE that a false implication is okay
            vacuousImplications: true
          };
        }
      }
    }
  },
  'skip-output-checks': {
    alias: 'skip-output-check',
    boolean: true,
    description: 'Do not run consistency and integrity checks on build output',
    default: false
  }
});
```

This configuration allows the following arguments: no arguments (`∅`),
`-⁠-⁠generate-⁠types=true`, `-⁠-⁠generate-⁠types=false`,
`-⁠-⁠generate-⁠types=true -⁠-⁠skip-⁠output-⁠checks=true`,
`-⁠-⁠generate-⁠types=true -⁠-⁠skip-⁠output-⁠checks=false`,
`-⁠-⁠generate-⁠types=false -⁠-⁠skip-⁠output-⁠checks=true`; and disallows:
`-⁠-⁠generate-⁠types=false -⁠-⁠skip-⁠output-⁠checks=false`.

The same could be accomplished by making `-⁠-⁠skip-⁠output-⁠checks` a suboption
of `-⁠-⁠generate-types` (essentially the reverse of the above):

```javascript
/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  'generate-types': {
    boolean: true,
    description: 'Output TypeScript declaration files alongside distributables',
    default: true
  },
  'skip-output-checks': {
    alias: 'skip-output-check',
    boolean: true,
    description: 'Do not run consistency and integrity checks on build output',
    default: false,
    subOptionOf: {
      'generate-types': {
        when: (generateTypes) => !generateTypes,
        update: (oldConfig) => {
          return {
            ...oldConfig,
            default: true,
            // ▼ Similar to using "choices" to limit string-accepting options,
            // we use one of these kinda wacky-looking self-referential
            // "implies" to assert --skip-output-checks must be true!
            implies: { 'skip-output-checks': true },
            vacuousImplications: true
          };
        }
      }
    }
  }
});
```

Though, note that the second example, when the user supplies the disallowed
arguments `-⁠-⁠generate-⁠types=false -⁠-⁠skip-⁠output-⁠checks=false`, they are
presented with an error message like:

```text
The following arguments as given conflict with the implications of "skip-output-checks":
   ➜ skip-output-checks == false
```

Whereas the first example presents the following error message, which makes more
sense (because it mentions `-⁠-⁠generate-⁠types`):

```text
The following arguments as given conflict with the implications of "generate-types":
   ➜ skip-output-checks == false
```
