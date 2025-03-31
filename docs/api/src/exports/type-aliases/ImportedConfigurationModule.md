[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ImportedConfigurationModule

# Type Alias: ImportedConfigurationModule\<CustomCliArguments, CustomExecutionContext\>

> **ImportedConfigurationModule**\<`CustomCliArguments`, `CustomExecutionContext`\> = (`context`) => `Promisable`\<`Partial`\<[`RootConfiguration`](RootConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>\> \| `Partial`\<[`RootConfiguration`](RootConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\> & `object`

Defined in: [src/types/module.ts:176](https://github.com/Xunnamius/black-flag/blob/f720a804174f12cc89580da9c1ce4476115249e9/src/types/module.ts#L176)

Represents a [Configuration](Configuration.md) object imported from a CJS/ESM module
external to the CLI framework (e.g. importing an auto-discovered config
module from a file).

## Type declaration

### default?

> `optional` **default**: `ImportedConfigurationModule`\<`CustomCliArguments`, `CustomExecutionContext`\>

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
