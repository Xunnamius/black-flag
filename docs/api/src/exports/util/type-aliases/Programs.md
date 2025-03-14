[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Programs

# Type Alias: Programs\<CustomCliArguments, CustomExecutionContext\>

> **Programs**\<`CustomCliArguments`, `CustomExecutionContext`\>: `{ [Descriptor in ProgramDescriptor]: DescriptorToProgram<Descriptor, CustomCliArguments, CustomExecutionContext> }`

Defined in: [src/types/program.ts:182](https://github.com/Xunnamius/black-flag/blob/aaa1a74457790f285cb2c85d4d6a7ee05978fc42/src/types/program.ts#L182)

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
