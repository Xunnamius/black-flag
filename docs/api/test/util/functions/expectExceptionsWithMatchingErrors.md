[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [test/util](../README.md) / expectExceptionsWithMatchingErrors

# Function: expectExceptionsWithMatchingErrors()

## Call Signature

> **expectExceptionsWithMatchingErrors**\<`Params`\>(`spec`, `errorFn`, `options`): `Promise`\<`void`\>

Defined in: node\_modules/@-xun/symbiote/node\_modules/@-xun/jest/dist/packages/jest/src/index.d.ts:274

Maps each element of the `spec` array into a Jest expectation asserting that
`errorFn` either throws an error or rejects. If an assertion fails, a helpful
error message is thrown.

Example:

```typescript
await expectExceptionsWithMatchingErrors([
 [[param1, param2], 'expected error message 1'],
 [[1, 2, 3], 'expected error message 2']
],
() => {
  // ...
});
```

Note: if you're getting a type error about no matching overloads and/or an
untyped `errorFn`, make sure you've set `options.singleParameter`
accordingly.

### Type Parameters

#### Params

`Params`

### Parameters

#### spec

[`ExpectExceptionsWithMatchingErrorsSpec`](../type-aliases/ExpectExceptionsWithMatchingErrorsSpec.md)\<\[`Params`\], `"single-parameter"`\>

#### errorFn

[`ExpectExceptionsWithMatchingErrorsFunction`](../type-aliases/ExpectExceptionsWithMatchingErrorsFunction.md)\<\[`Params`\]\>

#### options

[`ExpectExceptionsWithMatchingErrorsOptions`](../type-aliases/ExpectExceptionsWithMatchingErrorsOptions.md) & `object`

### Returns

`Promise`\<`void`\>

## Call Signature

> **expectExceptionsWithMatchingErrors**\<`Params`\>(`spec`, `errorFn`, `options?`): `Promise`\<`void`\>

Defined in: node\_modules/@-xun/symbiote/node\_modules/@-xun/jest/dist/packages/jest/src/index.d.ts:277

Maps each element of the `spec` array into a Jest expectation asserting that
`errorFn` either throws an error or rejects. If an assertion fails, a helpful
error message is thrown.

Example:

```typescript
await expectExceptionsWithMatchingErrors([
 [[param1, param2], 'expected error message 1'],
 [[1, 2, 3], 'expected error message 2']
],
() => {
  // ...
});
```

Note: if you're getting a type error about no matching overloads and/or an
untyped `errorFn`, make sure you've set `options.singleParameter`
accordingly.

### Type Parameters

#### Params

`Params` *extends* `unknown`[]

### Parameters

#### spec

[`ExpectExceptionsWithMatchingErrorsSpec`](../type-aliases/ExpectExceptionsWithMatchingErrorsSpec.md)\<`Params`\>

#### errorFn

[`ExpectExceptionsWithMatchingErrorsFunction`](../type-aliases/ExpectExceptionsWithMatchingErrorsFunction.md)\<`Params`\>

#### options?

[`ExpectExceptionsWithMatchingErrorsOptions`](../type-aliases/ExpectExceptionsWithMatchingErrorsOptions.md)

### Returns

`Promise`\<`void`\>
