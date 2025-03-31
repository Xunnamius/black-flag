[examples][1] / [black-flag][2] / advanced

# Black Flag: CLI-wide Reconfiguration

In this example we demonstrate re-configuring all commands across the entire CLI
at once using [`configureExecutionPrologue`][3]. Specifically, we set all
commands to `.strict(false)` and enable yargs-parser's
`unknown-options-as-args`.

> [!WARNING]
>
> Using the imperative `configureExecutionPrologue` hook should be a last
> resort.
>
> The "Black Flag way" of sharing configurations between commands is to use
> normal boring JavaScript: export a function from a utility module and import
> that function in each command module that it should configure. This is
> demonstrated in the [shared builder and handler][4] example.
>
> There are few reasons, if any, to prefer `configureExecutionPrologue`.

## Run This Example

1. Change directory to this example
2. Run `npm install`
3. Execute `npx advanced`

You can also run this example's tests by executing `npm test`.

[1]: ../../README.md
[2]: ../README.md
[3]:
  ../../../docs/api/src/exports/type-aliases/ConfigurationHooks.md#configureexecutionprologue
[4]: ../shared
