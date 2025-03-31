[examples][1] / [black-flag][2] / testing

# Black Flag: Testing Tips and Tricks

In this example we demonstrate methods for unit testing your commands and
configuration hooks in isolation, and integration testing your entire CLI in one
shot.

These examples make ample use of [`makeRunner`][3] and its
[`errorHandlingBehavior`][4] configuration option, as well as the [Jest][5]
testing framework.

## Run This Example

1. Change directory to this example
2. Run `npm install`
3. Execute `npx testing`

You can also run this example's tests by executing `npm test`.

[1]: ../../README.md
[2]: ../README.md
[3]: ../../../docs/api/src/exports/util/functions/makeRunner.md
[4]:
  ../../../docs/api/src/exports/util/type-aliases/MakeRunnerOptions.md#errorhandlingbehavior
[5]: https://npm.im/jest
