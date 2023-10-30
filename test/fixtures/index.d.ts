/**
 * This file is used by JSDoc comments in fixture files so vanilla JS files can
 * have access to those delicious types. IRL, we'd be constructing the CLI
 * purely in TypeScript, but for testing purposes this will do.
 */

declare namespace Type {
  export type DummyArgs = { handled_by: string };
  export type ChildConfig =
    import('../../types/module').ChildConfiguration<DummyArgs>;
  export type ParentConfig =
    import('../../types/module').ParentConfiguration<DummyArgs>;
  export type RootConfig =
    import('../../types/module').RootConfiguration<DummyArgs>;
  export type ConfigModule =
    import('../../types/module').ImportedConfigurationModule<DummyArgs>;
}
