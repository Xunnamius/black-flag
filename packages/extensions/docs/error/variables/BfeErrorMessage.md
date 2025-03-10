[**@black-flag/extensions**][1]

---

[@black-flag/extensions][1] / [error][2] / BfeErrorMessage

# Variable: BfeErrorMessage

> `const` **BfeErrorMessage**: `object`

Defined in: [packages/extensions/src/error.ts:14][3]

A collection of possible error and warning messages.

## Type Declaration

### Appvalidationfailure()

> **AppValidationFailure**: () => `string`

#### Returns

`string`

### Authfailure()

> **AuthFailure**: () => `string`

#### Returns

`string`

### Clientvalidationfailure()

> **ClientValidationFailure**: () => `string`

#### Returns

`string`

### Gurumeditation()

> **GuruMeditation**: () => `string`

#### Returns

`string`

### Httpfailure()

> **HttpFailure**: (`error`?) => `string`

#### Parameters

##### Error?

`string`

#### Returns

`string`

### Httpsubfailure()

> **HttpSubFailure**: (`error`, `statusCode`) => `string`

#### Parameters

##### Error

`null` | `string`

##### Statuscode

`number`

#### Returns

`string`

### Invalidappconfiguration()

> **InvalidAppConfiguration**: (`details`?) => `string`

#### Parameters

##### Details?

`string`

#### Returns

`string`

### Invalidappenvironment()

> **InvalidAppEnvironment**: (`details`?) => `string`

#### Parameters

##### Details?

`string`

#### Returns

`string`

### Invalidclientconfiguration()

> **InvalidClientConfiguration**: (`details`?) => `string`

#### Parameters

##### Details?

`string`

#### Returns

`string`

### Invaliditem()

> **InvalidItem**: (`item`, `itemName`) => `string`

#### Parameters

##### Item

`unknown`

##### Itemname

`string`

#### Returns

`string`

### Invalidsecret()

> **InvalidSecret**: (`secretType`) => `string`

#### Parameters

##### Secrettype

`string`

#### Returns

`string`

### Itemnotfound()

> **ItemNotFound**: (`item`, `itemName`) => `string`

#### Parameters

##### Item

`unknown`

##### Itemname

`string`

#### Returns

`string`

### Itemoritemsnotfound()

> **ItemOrItemsNotFound**: (`itemsName`) => `string`

#### Parameters

##### Itemsname

`string`

#### Returns

`string`

### Notauthenticated()

> **NotAuthenticated**: () => `string`

#### Returns

`string`

### Notauthorized()

> **NotAuthorized**: () => `string`

#### Returns

`string`

### Notfound()

> **NotFound**: () => `string`

#### Returns

`string`

### Notimplemented()

> **NotImplemented**: () => `string`

#### Returns

`string`

### Validationfailure()

> **ValidationFailure**: () => `string`

#### Returns

`string`

### Badconfigurationpath()

#### Parameters

##### Path

`unknown`

#### Returns

`string`

### Badparametercombination()

#### Returns

`string`

### Cannotexecutemultipletimes()

#### Returns

`string`

### Checkfailed()

#### Parameters

##### Currentargument

`string`

#### Returns

`string`

### Commandhandlernotafunction()

#### Returns

`string`

### Commandnotimplemented()

#### Returns

`string`

### Configloadfailure()

#### Parameters

##### Path

`string`

#### Returns

`string`

### Conflictsviolation()

#### Parameters

##### Conflicter

`string`

##### Seenconflictingkeyvalues

`ObjectEntries`

#### Returns

`string`

### Demandgenericxorviolation()

#### Parameters

##### Demanded

`ObjectEntries`

#### Returns

`string`

### Demandifviolation()

#### Parameters

##### Demanded

`string`

##### Demander

`ObjectEntry`

#### Returns

`string`

### Demandorviolation()

#### Parameters

##### Demanded

`ObjectEntries`

#### Returns

`string`

### Demandspecificxorviolation()

#### Parameters

##### Firstargument

`ObjectEntry`

##### Secondargument

`ObjectEntry`

#### Returns

`string`

### Duplicatecommandname()

#### Parameters

##### Parentfullname

`undefined` | `string`

##### Name1

`string`

##### Type1

`"name"` | `"alias"`

##### Name2

`string`

##### Type2

`"name"` | `"alias"`

#### Returns

`string`

### Duplicateoptionname()

#### Parameters

##### Name

`string`

#### Returns

`string`

### Falsycommandexport()

#### Returns

`string`

### Frameworkerror()

#### Parameters

##### Error

`unknown`

#### Returns

`string`

### Generic()

#### Returns

`string`

### Gracefulearlyexit()

#### Returns

`string`

### Illegalexplicitlyundefineddefault()

#### Returns

`string`

### Illegalhandlerinvocation()

#### Returns

`string`

### Impliesviolation()

#### Parameters

##### Implier

`string`

##### Seenconflictingkeyvalues

`ObjectEntries`

#### Returns

`string`

### Invalidcharacters()

#### Parameters

##### Str

`string`

##### Violation

`string`

#### Returns

`string`

### Invalidcommandexport()

#### Parameters

##### Name

`string`

#### Returns

`string`

### Invalidconfigureargumentsreturntype()

#### Returns

`string`

### Invalidconfigureexecutioncontextreturntype()

#### Returns

`string`

### Invalidconfigureexecutionepiloguereturntype()

#### Returns

`string`

### Invalidexecutioncontextbadfield()

#### Parameters

##### Fieldname

`string`

#### Returns

`string`

### Invalidsubcommandinvocation()

#### Returns

`string`

### Invocationnotallowed()

#### Parameters

##### Name

`string`

#### Returns

`string`

### Metadatainvariantviolated()

#### Parameters

##### Afflictedkey

`string`

#### Returns

`string`

### Noconfigurationloaded()

#### Parameters

##### Path

`string`

#### Returns

`string`

### Pathisnotdirectory()

#### Returns

`string`

### Referencednonexistentoption()

#### Parameters

##### Referrername

`string`

##### Doesnotexistname

`string`

#### Returns

`string`

### Requiresviolation()

#### Parameters

##### Requirer

`string`

##### Missingrequiredkeyvalues

`ObjectEntries`

#### Returns

`string`

### Unexpectedlyfalsydetailedarguments()

#### Returns

`string`

### Unexpectedvaluefrominternalyargsmethod()

#### Returns

`string`

### Useparseasyncinstead()

#### Returns

`string`

[1]: ../../README.md
[2]: ../README.md
[3]: https://github.com/Xunnamius/black-flag/blob/1b1b5b597cf8302c1cc5affdd2e1dd9189034907/packages/extensions/src/error.ts#L14
