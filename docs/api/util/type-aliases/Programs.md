[**@black-flag/core**](../../README.md) • **Docs**

***

[@black-flag/core](../../README.md) / [util](../README.md) / Programs

# Type Alias: Programs\<CustomCliArguments, CustomExecutionContext\>

> **Programs**\<`CustomCliArguments`, `CustomExecutionContext`\>: `{ [Descriptor in ProgramDescriptor]: DescriptorToProgram<Descriptor, CustomCliArguments, CustomExecutionContext> }`

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)

## Defined in

[types/program.ts:173](https://github.com/Xunnamius/black-flag/blob/96ce293f8a136c82839c1e658d19dc9a2441c0ab/types/program.ts#L173)
