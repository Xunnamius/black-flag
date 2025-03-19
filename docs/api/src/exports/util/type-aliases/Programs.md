[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Programs

# Type Alias: Programs\<CustomCliArguments, CustomExecutionContext\>

> **Programs**\<`CustomCliArguments`, `CustomExecutionContext`\> = `{ [Descriptor in ProgramDescriptor]: DescriptorToProgram<Descriptor, CustomCliArguments, CustomExecutionContext> }`

Defined in: [src/types/program.ts:182](https://github.com/Xunnamius/black-flag/blob/80aa4a39c172096a78cb27464b3ff055c511121d/src/types/program.ts#L182)

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
