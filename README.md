# escape-unicode

[![Build Status](https://img.shields.io/github/actions/workflow/status/neocotic/escape-unicode/ci.yml?event=push&style=for-the-badge)](https://github.com/neocotic/escape-unicode/actions/workflows/ci.yml)
[![Downloads](https://img.shields.io/npm/dw/escape-unicode?style=for-the-badge)](https://github.com/neocotic/escape-unicode)
[![Release](https://img.shields.io/npm/v/escape-unicode?style=for-the-badge)](https://github.com/neocotic/escape-unicode)
[![License](https://img.shields.io/github/license/neocotic/escape-unicode?style=for-the-badge)](https://github.com/neocotic/escape-unicode/blob/main/LICENSE.md)

[escape-unicode](https://github.com/neocotic/escape-unicode) is a [Node.js](https://nodejs.org) package for converting
Unicode characters into their corresponding Unicode escapes ("\uxxxx" notation).

## Install

Install using [npm](https://npmjs.com):

``` sh
npm install --save escape-unicode
```

## Usage

### `escapeUnicode(input[, options])`

Converts characters within `input` to Unicode escapes.

The `filter` option can be specified to control which characters are converted, and the `replacer` option can be
specified for more granular control over how specific characters are escaped.

Characters within the Basic Multilingual Plane (BMP) as well as surrogate pairs for characters outside BMP are
supported.

#### Options

| Option     | Type       | Default | Description                                                                                                                            |
|------------|------------|---------|----------------------------------------------------------------------------------------------------------------------------------------|
| `filter`   | `Filter`   | *None*  | A function used to determine which Unicode code points should be converted to Unicode escapes.                                         |
| `replacer` | `Replacer` | *None*  | A function that returns a replacement string for an individual Unicode character represented by a specific Unicode code point, if any. |

#### Examples

``` javascript
import { escapeUnicode, isNotAscii, replaceChars } from "escape-unicode";

escapeUnicode("I love Unicode!");
//=> "\\u0049\\u0020\\u006c\\u006f\\u0076\\u0065\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
escapeUnicode("I ♥ Unicode!");
//=> "\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
escapeUnicode("I ♥ Unicode!", { filter: isNotAscii });
//=> "I \\u2665 Unicode!"
escapeUnicode("I	♥	Unicode!", { filter: isNotAscii, replacer: replaceChars({ "\t": "\\t" }) });
//=> "I\\t\\u2665\\tUnicode!"
escapeUnicode("𠮷𠮾");
//=> "\\ud842\\udfb7\\ud842\\udfbe"
```

### `Filter(code, char)`

A function that returns whether the specified Unicode `code` point should be converted to a Unicode escape.

There are a several built-in `Filter` functions provided.

#### `composeFilter(...filters)`

Returns a `Filter` composed of the specified `filters` that returns `true` only if any of the `filters` provided return
a truthy value.

``` javascript
import { composeFilter, escapeUnicode, isNotAscii } from "escape-unicode";

const filter = composeFilter(isNotAscii, (code) => code === 0x0020);
escapeUnicode("I ♥ Unicode!", { filter });
//=> "I\\u0020\\u2665\\u0020Unicode!"
```

#### `isAscii(code, char)`

A `Filter` that returns whether the specified Unicode `code` point is valid in ASCII encoding.

ASCII covers code points 0x00-0x7F (0-127).

#### `isNotAscii(code, char)`

A `Filter` that returns whether the specified Unicode `code` point is **not** valid in ASCII encoding.

ASCII covers code points 0x00-0x7F (0-127).

#### `isBmp(code, char)`

A `Filter` that returns whether the specified Unicode `code` point is in the Basic Multilingual Plane (BMP).

BMP covers code points 0x0000-0xFFFF (0-65535) and represents characters that can be encoded in a single UTF-16 code
unit.

#### `isNotBmp(code, char)`

A `Filter` that returns whether the specified Unicode `code` point is **not** in the Basic Multilingual Plane (BMP).

BMP covers code points 0x0000-0xFFFF (0-65535) and represents characters that can be encoded in a single UTF-16 code
unit.

#### `isLatin1(code, char)`

A `Filter` that returns whether the specified Unicode `code` point is valid in Latin-1 (ISO 8859-1) encoding.

Latin-1 covers code points 0x00-0xFF (0-255).

#### `isNotLatin1(code, char)`

A `Filter` that returns whether the specified Unicode `code` point is **not** valid in Latin-1 (ISO 8859-1) encoding.

Latin-1 covers code points 0x00-0xFF (0-255).

### `Replacer(code, char)`

A function that returns a replacement string for an individual Unicode character represented by a specific Unicode code
point, if any.

If a non-empty string is returned, the Unicode character will be replaced by that string in the returned string
instead of its Unicode escape.

If an empty string is returned, the Unicode character will be removed from the returned string. If either `null` or
`undefined` are returned, the Unicode character will be replaced with its Unicode escape in the returned string.

There are a several built-in `Replacer` functions provided.

#### `composeReplacer(...replacers)`

Returns a `Replacer` composed of the specified `replacers` that returns the replacement string returned from the first
`Replacer` to return a string, where possible.

``` javascript
import { composeReplacer, escapeUnicode, replaceChars, replaceCodes } from "escape-unicode";

const replacer = composeReplacer(
  replaceChars({ "\f": "\\f", "\n": "\\n", "\r": "\\r" }),
  replaceCodes({ 0x009: "\\t" }),
);
escapeUnicode("I	♥	Unicode!", { replacer });
//=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
```

#### `replaceChar(char, replacement)`

Returns a `Replacer` that returns the specified `replacement` string for the individual Unicode character provided.

``` javascript
import { escapeUnicode, replaceChar } from "escape-unicode";

escapeUnicode("I	♥	Unicode!", { replacer: replaceChar("\t", "\\t") });
//=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
```

#### `replaceChars(...replacers)`

Returns a `Replacer` that returns replacement strings looked up from the specified `replacements`, where possible.

The keys within `replacements` are expected to be the individual Unicode character.

``` javascript
import { escapeUnicode, replaceChars } from "escape-unicode";

const replacements = new Map([
  ["\f", "\\f"],
  ["\n", "\\n"],
  ["\r", "\\r"],
  ["\t", "\\t"],
]);
escapeUnicode("I	♥	Unicode!", { replacer: replaceChars(replacements) });
//=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
```

#### `replaceCode(code, replacement)`

Returns a `Replacer` that returns the specified `replacement` string for the Unicode code point representing the
individual Unicode character provided.

``` javascript
import { escapeUnicode, replaceCode } from "escape-unicode";

escapeUnicode("I	♥	Unicode!", { replacer: replaceCode(0x0009, "\\t") });
//=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
```

#### `replaceCodes(...replacers)`

Returns a `Replacer` that returns replacement strings looked up from the specified `replacements`, where possible.

The keys within `replacements` are expected to be Unicode code points representing the Unicode characters.

``` javascript
import { escapeUnicode, replaceCodes } from "escape-unicode";

const replacements = {
  0x000c: "\\f",
  0x000a: "\\n",
  0x000d: "\\r",
  0x0009: "\\t",
};
escapeUnicode("I	♥	Unicode!", { replacer: replaceCodes(replacements) });
//=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
```

## Related

* [node-native2ascii](https://github.com/neocotic/node-native2ascii)
* [properties-store](https://github.com/neocotic/properties-store)
* [unescape-unicode](https://github.com/neocotic/unescape-unicode)

## Bugs

If you have any problems with this package or would like to see changes currently in development, you can do so
[here](https://github.com/neocotic/escape-unicode/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/neocotic/escape-unicode/blob/main/CONTRIBUTING.md). We want your suggestions and
pull requests!

A list of all contributors can be found in
[AUTHORS.md](https://github.com/neocotic/escape-unicode/blob/main/AUTHORS.md).

## License

Copyright © 2025 neocotic

See [LICENSE.md](https://github.com/neocotic/escape-unicode/raw/main/LICENSE.md) for more information on our MIT
license.
