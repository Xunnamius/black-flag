[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [index](../README.md) / ImportedConfigurationModule

# Type alias: ImportedConfigurationModule\<CustomCliArguments, CustomExecutionContext\>

> **ImportedConfigurationModule**\<`CustomCliArguments`, `CustomExecutionContext`\>: (`context`) => `Promisable`\<`Partial`\<[`RootConfiguration`](RootConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ChildConfiguration`](ChildConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>\> \| `Partial`\<[`RootConfiguration`](RootConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ParentConfiguration`](ParentConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`ChildConfiguration`](ChildConfiguration.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\> & `object`

Represents a Configuration object imported from a CJS/ESM module external to
the CLI framework (e.g. importing an auto-discovered config module from a
file).

## Type declaration

### default?

> `optional` **default**: [`ImportedConfigurationModule`](ImportedConfigurationModule.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## Type parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md) = [`ExecutionContext`](../../util/type-aliases/ExecutionContext.md)

## Source

[types/module.ts:168](https://github.com/Xunnamius/black-flag/blob/d4a156f70283118824ee7289456277508954660f/types/module.ts#L168)
