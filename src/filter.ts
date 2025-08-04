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
 * A function that returns whether the specified Unicode `code` point should be converted to a Unicode escape.
 *
 * @param code The Unicode code unit to be checked.
 * @param char The Unicode character to be checked.
 * @return A truthy value if `code` should be converted to a Unicode escape.
 */
export type Filter = (code: number, char: string) => unknown;

/**
 * Returns a {@link Filter} composed of the specified `filters` that returns `true` only if any of the `filters`
 * provided return a truthy value.
 *
 * @example
 * const filter = composeFilter(isNotAscii, (code) => code === 0x0020);
 * escapeUnicode("I ♥ Unicode!", { filter });
 * //=> "I\\u0020\\u2665\\u0020Unicode!"
 * @param filters The {@link Filter} functions to be composed.
 * @return A {@link Filter} composed of multiple `filters`.
 */
export const composeFilter =
  (...filters: Filter[]): Filter =>
  (code, char) => {
    for (const filter of filters) {
      if (filter(code, char)) {
        return true;
      }
    }

    return false;
  };

/**
 * A {@link Filter} that returns whether the specified Unicode `code` point is valid in ASCII encoding.
 *
 * ASCII covers code points 0x00-0x7F (0-127).
 *
 * @param code The Unicode code unit to be checked.
 * @return A truthy value if the code point is valid in ASCII encoding and should be converted to a Unicode escape.
 */
export const isAscii: Filter = (code: number) => code <= 0x007f;

/**
 * A {@link Filter} that returns whether the specified Unicode `code` point is **not** valid in ASCII encoding.
 *
 * ASCII covers code points 0x00-0x7F (0-127).
 *
 * @param code The Unicode code unit to be checked.
 * @return A truthy value if the code point is **not** valid in ASCII encoding and should be converted to a Unicode
 * escape.
 */
export const isNotAscii: Filter = (code: number) => code > 0x007f;

/**
 * A {@link Filter} that returns whether the specified Unicode `code` point is in the Basic Multilingual Plane (BMP).
 *
 * BMP covers code points 0x0000-0xFFFF (0-65535) and represents characters that can be encoded in a single UTF-16 code
 * unit.
 *
 * @param code The Unicode code unit to be checked.
 * @return A truthy value if the code point is in the BMP and should be converted to a Unicode escape.
 */
export const isBmp: Filter = (code: number) => code <= 0xffff;

/**
 * A {@link Filter} that returns whether the specified Unicode `code` point is **not** in the Basic Multilingual Plane
 * (BMP).
 *
 * BMP covers code points 0x0000-0xFFFF (0-65535) and represents characters that can be encoded in a single UTF-16 code
 * unit.
 *
 * @param code The Unicode code unit to be checked.
 * @return A truthy value if the code point is **not** in the BMP and should be converted to a Unicode escape.
 */
export const isNotBmp: Filter = (code: number) => code > 0xffff;

/**
 * A {@link Filter} that returns whether the specified Unicode `code` point is valid in Latin-1 (ISO 8859-1) encoding.
 *
 * Latin-1 covers code points 0x00-0xFF (0-255).
 *
 * @param code The Unicode code unit to be checked.
 * @return A truthy value if the code point is valid in Latin-1 encoding and should be converted to a Unicode escape.
 */
export const isLatin1: Filter = (code: number) => code <= 0x00ff;

/**
 * A {@link Filter} that returns whether the specified Unicode `code` point is **not** valid in Latin-1 (ISO 8859-1)
 * encoding.
 *
 * Latin-1 covers code points 0x00-0xFF (0-255).
 *
 * @param code The Unicode code unit to be checked.
 * @return A truthy value if the code point is **not** valid in Latin-1 encoding and should be converted to a Unicode
 * escape.
 */
export const isNotLatin1: Filter = (code: number) => code > 0x00ff;
