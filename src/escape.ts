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
 * The prefix for all Unicode escapes.
 */
const escapePrefix = "\\u";

/**
 * The available digits for hexadecimal values.
 */
const hexDigits = "0123456789abcdef".split("");

/**
 * Returns the Unicode escape for the specified Unicode code unit.
 *
 * @param code The Unicode code unit to be escaped.
 * @return The Unicode escape for `code`.
 */
const escapeSingle = (code: number): string => {
  return (
    escapePrefix +
    toHexDigit((code >> 12) & 15) +
    toHexDigit((code >> 8) & 15) +
    toHexDigit((code >> 4) & 15) +
    toHexDigit(code & 15)
  );
};

/**
 * Converts the specified `nibble` into a hexadecimal digit.
 *
 * @param nibble The nibble to be converted.
 * @return The single-digit hexadecimal string.
 */
const toHexDigit = (nibble: number): string => hexDigits[nibble & 15]!;

/**
 * Returns the Unicode escape for the specified Unicode code unit.
 *
 * Characters within the Basic Multilingual Plane (BMP) as well as surrogate pairs for characters outside BMP are
 * supported.
 *
 * @param code The Unicode code unit to be escaped.
 * @return The Unicode escape(s) for `code`.
 */
export const escape = (code: number): string => {
  if (code <= 0xffff) {
    // Inside BMP
    return escapeSingle(code);
  } else {
    // Outside BMP
    const adjusted = code - 0x10000;
    const highSurrogate = 0xd800 + (adjusted >> 10);
    const lowSurrogate = 0xdc00 + (adjusted & 0x3ff);

    return escapeSingle(highSurrogate) + escapeSingle(lowSurrogate);
  }
};
