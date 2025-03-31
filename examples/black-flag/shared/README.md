[examples][1] / [black-flag][2] / shared

# Black Flag: Shared "High-Order" Builder and Handler

In this example we demonstrate using simple boring old JavaScript to share a
baseline builder and handler across commands. This allows us to configure common
behavior across our CLI from a single location.

This approach should be preferred over using fancier and more esoteric options
like [`configureExecutionPrologue`][3].

## Run This Example

1. Change directory to this example
2. Run `npm install`
3. Execute `npx shared`

You can also run this example's tests by executing `npm test`.

[1]: ../../README.md
[2]: ../README.md
[3]: ../../../docs/api/src/exports/type-aliases//ConfigureExecutionPrologue.md
