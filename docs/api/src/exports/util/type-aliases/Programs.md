[**@black-flag/core**](../../../../README.md)

***

[@black-flag/core](../../../../README.md) / [src/exports/util](../README.md) / Programs

# Type Alias: Programs\<CustomCliArguments, CustomExecutionContext\>

> **Programs**\<`CustomCliArguments`, `CustomExecutionContext`\> = `{ [Descriptor in ProgramDescriptor]: DescriptorToProgram<Descriptor, CustomCliArguments, CustomExecutionContext> }`

Defined in: [src/types/program.ts:184](https://github.com/Xunnamius/black-flag/blob/7a70c7e44633bf3b15b0662ce212ece66de038c8/src/types/program.ts#L184)

Represents the program types that represent every Black Flag command as
aptly-named values in an object.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

### CustomExecutionContext

`CustomExecutionContext` *extends* [`ExecutionContext`](ExecutionContext.md) = [`ExecutionContext`](ExecutionContext.md)
