/**
 * This file is used by JSDoc comments in fixture files so vanilla JS files can
 * have access to those delicious types. IRL, we'd be constructing the CLI
 * purely in TypeScript, but for testing purposes this will do.
 */

declare namespace Type {
  export type DummyArgs = { handled_by: string };
  export type ChildConfig =
    import('universe:types/module.ts').ChildConfiguration<DummyArgs>;
  export type ParentConfig =
    import('universe:types/module.ts').ParentConfiguration<DummyArgs>;
  export type RootConfig =
    import('universe:types/module.ts').RootConfiguration<DummyArgs>;
  export type ConfigModule =
    import('universe:types/module.ts').ImportedConfigurationModule<DummyArgs>;
}
