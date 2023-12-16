/* eslint-disable jest/require-hook */
/* eslint-disable jest/no-conditional-in-test, jest/no-conditional-expect */

// * These tests verify that an auto-discovered Black Flag command actually
// * works as advertized. That is: this file tests the examples present in the
// * README.md file, including support for importing both CJS and ESM modules.

// TODO: good fable candidate here

it('supports both CJS and ESM configuration files', async () => {
  expect.hasAssertions();
  // TODO: also supports something like module.exports.default = undefined
});
