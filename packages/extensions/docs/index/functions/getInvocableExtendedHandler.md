[**@black-flag/extensions**](../../README.md)

***

[@black-flag/extensions](../../README.md) / [index](../README.md) / getInvocableExtendedHandler

# Function: getInvocableExtendedHandler()

> **getInvocableExtendedHandler**\<`CustomCliArguments`, `CustomExecutionContext`\>(`maybeCommand`, `context`): `Promise`\<(`argv`) => `Promise`\<`void`\>\>

Defined in: [packages/extensions/src/index.ts:1467](https://github.com/Xunnamius/black-flag/blob/3764563cebc186c7e5f9e6fd9ad3d54a1192fe57/packages/extensions/src/index.ts#L1467)

This function returns a version of `maybeCommand`'s handler function that is
ready to invoke immediately. It can be used with both BFE and normal Black
Flag command exports.

It returns a handler that expects to be passed a "reified argv," i.e. the
object normally given to the command handler after all checks have passed and
all updates to argv have been applied (including `subOptionOf` and BFE's
`implies`).

For this reason, invoking the returned handler will not run any BF or BFE
builder configurations on the given argv object. **Whatever you pass the
returned handler function will be (safely) deep cloned and then re-gifted to
the command's handler _without_ any correctness checks.**

Use `CustomCliArguments` (and `CustomExecutionContext`) to assert the
expected shape of the "reified argv".

Note that, like the `argv` passed to the returned handler function, the
`context` argument passed to this function will be (safely) deep cloned,
meaning any context changes effected by the handler will not persist outside
of that handler's scope.

Also note that the `$executionContext` key, if included in `argv`, will be
ignored.

See [the
documentation](https://github.com/Xunnamius/black-flag/blob/main/packages/extensions/README.md#getinvocableextendedhandler)
for more details.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* `ExecutionContext` & `object`

## Parameters

### maybeCommand

`Promisable`\<`ImportedConfigurationModule`\<`CustomCliArguments`, `CustomExecutionContext`\> \| `ImportedConfigurationModule`\<`CustomCliArguments`, [`AsStrictExecutionContext`](../type-aliases/AsStrictExecutionContext.md)\<`CustomExecutionContext`\>\>\>

### context

`CustomExecutionContext`

## Returns

`Promise`\<(`argv`) => `Promise`\<`void`\>\>
