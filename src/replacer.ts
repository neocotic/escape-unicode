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

/**
 * A function that returns a replacement string for an individual Unicode character represented by the specified Unicode
 * `code` point, if any.
 *
 * If a non-empty string is returned, the Unicode character will be replaced by that string in the returned string
 * instead of its Unicode escape.
 *
 * If an empty string is returned, the Unicode character will be removed from the returned string. If either `null` or
 * `undefined` are returned, the Unicode character will be replaced with its Unicode escape in the returned string.
 *
 * @param code The Unicode code unit to be potentially replaced.
 * @param char The Unicode character to be potentially replaced.
 * @return A replacement string for an individual Unicode character represented by `code` or `null` or `undefined` for
 * the Unicode character to be replaced with its Unicode escape.
 */
export type Replacer = (
  code: number,
  char: string,
) => string | null | undefined;

/**
 * Returns a {@link Replacer} composed of the specified `replacers` that returns the replacement string returned from
 * the first {@link Replacer} to return a string, where possible.
 *
 * @example
 * const replacer = composeReplacer(
 *   replaceChars({ "\f": "\\f", "\n": "\\n", "\r": "\\r" }),
 *   replaceCodes({ 0x009: "\\t" }),
 * );
 * escapeUnicode("I	♥	Unicode!", { replacer });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @param replacers The {@link Replacer} functions to be composed.
 * @return A {@link Replacer} composed of multiple `replacers`.
 */
export const composeReplacer =
  (...replacers: Replacer[]): Replacer =>
  (code, char) => {
    for (const replacer of replacers) {
      const replacement = replacer(code, char);
      if (typeof replacement === "string") {
        return replacement;
      }
    }
  };

/**
 * Returns a {@link Replacer} that returns the specified `replacement` string for the individual Unicode character
 * provided.
 *
 * @example
 * escapeUnicode("I	♥	Unicode!", { replacer: replaceChar("\t", "\\t") });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @param char The individual Unicode character.
 * @param replacement The replacement string to be returned for `char`.
 * @return A {@link Replacer} that returns `replacement` string only for `char`.
 */
export const replaceChar =
  (char: string, replacement: string): Replacer =>
  (_code, otherChar) => {
    if (otherChar === char) {
      return replacement;
    }
  };

/**
 * Returns a {@link Replacer} that returns replacement strings looked up from the specified `replacements`, where
 * possible.
 *
 * The keys within `replacements` are expected to be the individual Unicode character.
 *
 * @example Providing replacements in a map
 * const replacements = new Map([
 *   ["\f", "\\f"],
 *   ["\n", "\\n"],
 *   ["\r", "\\r"],
 *   ["\t", "\\t"],
 * ]);
 * escapeUnicode("I	♥	Unicode!", { replacer: replaceChars(replacements) });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @example Providing replacements in an object
 * const replacements = {
 *   "\f": "\\f",
 *   "\n": "\\n",
 *   "\r": "\\r",
 *   "\t": "\\t",
 * };
 * escapeUnicode("I	♥	Unicode!", { replacer: replaceChars(replacements) });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @param replacements A map/object containing individual Unicode characters mapped to their replacement strings.
 * @return A {@link Replacer} that returns replacement strings looked up from `replacements`.
 */
export const replaceChars = (
  replacements: Map<string, string> | Record<string, string>,
): Replacer => {
  if (replacements instanceof Map) {
    return (_code, char) => replacements.get(char);
  }

  return (_code, char) => replacements[char];
};

/**
 * Returns a {@link Replacer} that returns the specified `replacement` string for the Unicode code point representing
 * the individual Unicode character provided.
 *
 * @example
 * escapeUnicode("I	♥	Unicode!", { replacer: replaceCode(0x0009, "\\t") });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @param code The Unicode code point representing the individual Unicode character.
 * @param replacement The replacement string to be returned for `char`.
 * @return A {@link Replacer} that returns `replacement` string only for `code`.
 */
export const replaceCode =
  (code: number, replacement: string): Replacer =>
  (otherCode) => {
    if (otherCode === code) {
      return replacement;
    }
  };

/**
 * Returns a {@link Replacer} that returns replacement strings looked up from the specified `replacements`, where
 * possible.
 *
 * The keys within `replacements` are expected to be Unicode code points representing the Unicode characters.
 *
 * @example Providing replacements in a map
 * const replacements = new Map([
 *   [0x000c, "\\f"],
 *   [0x000a, "\\n"],
 *   [0x000d, "\\r"],
 *   [0x0009, "\\t"],
 * ]);
 * escapeUnicode("I	♥	Unicode!", { replacer: replaceCodes(replacements) });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @example Providing replacements in an object
 * const replacements = {
 *   0x000c: "\\f",
 *   0x000a: "\\n",
 *   0x000d: "\\r",
 *   0x0009: "\\t",
 * };
 * escapeUnicode("I	♥	Unicode!", { replacer: replaceCodes(replacements) });
 * //=> "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021"
 * @param replacements A map/object containing Unicode code points representing individual Unicode characters mapped to
 * their replacement strings.
 * @return A {@link Replacer} that returns replacement strings looked up from `replacements`.
 */
export const replaceCodes = (
  replacements: Map<number, string> | Record<number, string>,
): Replacer => {
  if (replacements instanceof Map) {
    return (code) => replacements.get(code);
  }

  return (code) => replacements[code];
};
