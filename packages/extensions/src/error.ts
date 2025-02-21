import { ErrorMessage as UpstreamErrorMessage } from '@black-flag/core/util';

import { $exists } from 'universe:symbols.ts';

import type { Entries } from 'type-fest';

export type KeyValueEntries = Entries<{ [x: string]: unknown }>;
export type KeyValueEntry = KeyValueEntries[number];

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  FalsyCommandExport() {
    return 'supposed command argument unexpectedly resolved to a falsy value';
  },
  CommandHandlerNotAFunction() {
    return 'resolved command object unexpectedly returned a non-function handler';
  },
  ReferencedNonExistentOption(referrerName: string, doesNotExistName: string) {
    return `option "${referrerName}" illegally references the non-existent option "${doesNotExistName}" in its configuration`;
  },
  DuplicateOptionName(name: string) {
    return `one or more options of the currently executing command are attempting to register a duplicate name, expanded name, alias, or expanded alias: "${name}". Option names, their aliases, and all potential expansions must be unique.`;
  },
  IllegalHandlerInvocation() {
    return 'withHandlerExtensions::handler was invoked too soon: options analysis unavailable';
  },
  IllegalExplicitlyUndefinedDefault() {
    return 'an option cannot have an explicitly undefined default';
  },
  MetadataInvariantViolated(afflictedKey: string) {
    return `an impossible state was detected while analyzing configuration for key: ${afflictedKey}`;
  },
  UnexpectedlyFalsyDetailedArguments() {
    return 'a Black Flag instance is somehow missing its detailed parse result. This is likely the result of an incompatibility between Black Flag and whatever version of Yargs is installed. Please report this!';
  },
  UnexpectedValueFromInternalYargsMethod() {
    return 'a Black Flag instance is returning something unexpected from its "getParserConfiguration" internal method. This is likely the result of an incompatibility between Black Flag and whatever version of Yargs is installed. Please report this!';
  },
  RequiresViolation(requirer: string, missingRequiredKeyValues: KeyValueEntries) {
    return `the following missing arguments must be given alongside "${requirer}":${keyValuesToString(missingRequiredKeyValues)}`;
  },
  ConflictsViolation(conflicter: string, seenConflictingKeyValues: KeyValueEntries) {
    return `the following arguments cannot be given alongside "${conflicter}":${keyValuesToString(seenConflictingKeyValues)}`;
  },
  ImpliesViolation(implier: string, seenConflictingKeyValues: KeyValueEntries) {
    return `the following arguments as given conflict with the implications of "${implier}":${keyValuesToString(seenConflictingKeyValues)}`;
  },
  DemandIfViolation(demanded: string, demander: KeyValueEntry) {
    return `the argument "${demanded}" must be given whenever the following is given: ${keyValuesToString([demander])}`;
  },
  DemandOrViolation(demanded: KeyValueEntries) {
    return `at least one of the following arguments must be given:${keyValuesToString(demanded)}`;
  },
  DemandGenericXorViolation(demanded: KeyValueEntries) {
    return `exactly one of the following arguments must be given:${keyValuesToString(demanded)}`;
  },
  DemandSpecificXorViolation(
    firstArgument: KeyValueEntry,
    secondArgument: KeyValueEntry
  ) {
    return ErrorMessage.DemandGenericXorViolation([firstArgument, secondArgument]);
  },
  CheckFailed(currentArgument: string) {
    return `check failed for argument "${currentArgument}"`;
  }
};

function keyValuesToString(keyValueEntries: KeyValueEntries) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return keyValueEntries.reduce((str, keyValueEntry) => {
    return `${str}\n  ➜ ${keyValueToString(keyValueEntry)}`;
  }, '');
}

function keyValueToString(keyValueEntry: KeyValueEntry) {
  const [key, value] = keyValueEntry;
  const stringifiedValue = (() => {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  })();

  return value === $exists ? key : `${key} == ${stringifiedValue}`;
}
