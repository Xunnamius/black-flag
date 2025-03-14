[**@black-flag/core**](../../../README.md)

***

[@black-flag/core](../../../README.md) / [src/exports](../README.md) / ImportedConfigurationModule

# Type Alias: ImportedConfigurationModule\<CustomCliArguments, CustomExecutionContext\>

> **ImportedConfigurationModule**\<`CustomCliArguments`, `CustomExecutionContext`\>: (`context`) => `Promisable`\<`Partial`\<[`RootConfiguration`](RootConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>\> \| `Partial`\<[`RootConfiguration`](RootConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\> & `object`

Defined in: [src/types/module.ts:180](https://github.com/Xunnamius/black-flag/blob/aaa1a74457790f285cb2c85d4d6a7ee05978fc42/src/types/module.ts#L180)

Represents a [Configuration](Configuration.md) object imported from a CJS/ESM module
external to the CLI framework (e.g. importing an auto-discovered config
module from a file).

## Type declaration

### default?

> `optional` **default**: [`ImportedConfigurationModule`](ImportedConfigurationModule.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../util/type-aliases/ExecutionContext.md)
