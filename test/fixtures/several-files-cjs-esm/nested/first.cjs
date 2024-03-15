// This is what babel outputs when you do `export default configuration` in a
// Typescript/ESM configuration file and compile it down to CJS. Normally this
// would be an invisible little bit of interop; unfortunately, Black Flag is
// itself running in CJS mode _but using `import` instead of `require`_ to read
// in configuration files. `import` in CJS and ESM code will always use the
// ESM-style loader. This means CJS's `module.exports` always gets dumped into
// the `"default"` property of the result of calling `import`. Below, we see
// that `module.exports.default` is defined, which means Black Flag ends up
// needing `module.exports.default.default`... which is nuts, but hey that's
// ESM<=>CJS interop for ya!

// * This test ensures that both the hand-authored module.exports=... form and
// * the transpiled module.exports.default=... form are both acceptable even if
// * the latter is considered by some to be an anti-pattern.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const configuration = {
  name: 'cjs',
  handler: () => console.log('first success')
};
exports.default = configuration;
