[examples][1] / [black-flag][2] / error

# Black Flag: Error handling and `CliError` Usage

In this example we demonstrate using [`configureErrorHandlingEpilogue`][3] and
[`blackFlag::showHelpOnFail`][4] to handle different kinds of errors
([graceful][5], [CLI][6], [yargs][7], and custom `Error` classes) using various
help text output styles.

## Run This Example

1. Change directory to this example
2. Run `npm install`
3. Execute `npx error`

You can also run this example's tests by executing `npm test`.

[1]: ../../README.md
[2]: ../README.md
[3]:
  ../../../docs/api/src/exports/type-aliases/ConfigureErrorHandlingEpilogue.md
[4]: ../../../docs/api/src/exports/util/type-aliases/Program.md#showhelponfail
[5]: ../../../docs/api/src/exports/variables/GracefulEarlyExitError.md
[6]: ../../../docs/api/src/exports/variables/CliError.md
[7]:
  https://github.com/yargs/yargs/blob/ef28c98ae14621fd484ec80b128b46e85b6bf858/lib/yerror.ts
