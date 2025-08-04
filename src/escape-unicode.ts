/*
 * Copyright (C) 2025 neocotic
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { escape } from "./escape.js";
import type { Filter } from "./filter.js";
import type { Replacer } from "./replacer.js";

/**
 * The options that can be provided to {@link escapeUnicode}.
 */
export interface Options {
  /**
   * A function used to determine which Unicode code points should be converted to Unicode escapes.
   *
   * If not specified, all Unicode code points will be converted.
   *
   * @see composeFilter
   * @see isAscii
   * @see isBmp
   * @see isLatin1
   * @see isNotAscii
   * @see isNotBmp
   * @see isNotLatin1
   */
  filter?: Filter;
  /**
   * A function that returns a replacement string for an individual Unicode character represented by a specific Unicode
   * code point, if any.
   *
   * If a non-empty string is returned, the Unicode character will be replaced by that string in the returned string
   * instead of its Unicode escape.
   *
   * If an empty string is returned, the Unicode character will be removed from the returned string. If either `null` or
   * `undefined` are returned, the Unicode character will be replaced with its Unicode escape in the returned string.
   *
   * If not specified, all characters are converted to their corresponding Unicode escapes.
   *
   * @see composeReplacer
   * @see replaceChar
   * @see replaceChars
   * @see replaceCode
   * @see replaceCodes
   */
  replacer?: Replacer;
}

/**
 * Converts characters within `input` to Unicode escapes.
 *
 * {@link Options#filter} can be specified to control which characters are converted, and {@link Options#replacer} can
 * be specified for more granular control over how specific characters are escaped.
 *
 * Characters within the Basic Multilingual Plane (BMP) as well as surrogate pairs for characters outside BMP are
 * supported.
 *
 * @example Escape all characters in string containing only ASCII characters
 * escapeUnicode("I love Unicode!");
 * //=> "\\u0049\\u0020\\u006c\\u006f\\u0076\\u0065\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @example Escape all characters in string containing ASCII and non-ASCII characters
 * escapeUnicode("I ♥ Unicode!");
 * //=> "\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @example Escape only non-ASCII characters
 * escapeUnicode("I ♥ Unicode!", { filter: isNotAscii });
 * //=> "I \\u2665 Unicode!"
 * @example Escape only non-ASCII characters and tabs
 * escapeUnicode("I	♥	Unicode!", { filter: isNotAscii, replacer: replaceChars({ "\t": "\\t" }) });
 * //=> "I\\t\\u2665\\tUnicode!"
 * @example Escape characters outside BMP
 * escapeUnicode("𠮷𠮾");
 * //=> "\\ud842\\udfb7\\ud842\\udfbe"
 * @param input The string containing the Unicode characters to be converted.
 * @param options The options to be used.
 * @return A copy of `input` with the appropriate characters replaced with Unicode escapes.
 */
export const escapeUnicode = (input: string, options: Options = {}): string => {
  if (!input) {
    return "";
  }

  const { filter, replacer } = options;
  let output = "";

  for (const char of input) {
    const code = char.codePointAt(0)!;
    const replacement = replacer?.(code, char);

    if (typeof replacement === "string") {
      output += replacement;
    } else if (!filter || filter(code, char)) {
      output += escape(code);
    } else {
      output += char;
    }
  }

  return output;
};
