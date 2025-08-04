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

import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { escapeUnicode } from "../src/escape-unicode.js";
import { type Filter, isNotAscii } from "../src/filter.js";
import { replaceChars } from "../src/replacer.js";

describe("escapeUnicode", () => {
  [
    {
      description: "when input contains only ASCII characters",
      test: "should convert characters to Unicode escapes",
      input: "I love Unicode!",
      expected:
        "\\u0049\\u0020\\u006c\\u006f\\u0076\\u0065\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021",
    },
    {
      description: "when input contains ASCII and non-ASCII characters",
      test: "should convert characters to Unicode escapes",
      input: "I ♥ Unicode!",
      expected:
        "\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021",
    },
    {
      description: "when input contains characters outside BMP",
      test: "should convert characters to Unicode escapes",
      input: "𠮷𠮾",
      expected: "\\ud842\\udfb7\\ud842\\udfbe",
    },
    {
      description: "when input is empty",
      test: "should return an empty string",
      input: "",
      expected: "",
    },
    {
      description: "when filter option is specified",
      test: "should convert only filtered characters to Unicode escapes",
      input: "I ♥ Unicode!",
      options: { filter: isNotAscii },
      expected: "I \\u2665 Unicode!",
    },
  ].forEach(({ description, test, input, options, expected }) => {
    describe(description, () => {
      it(test, () => {
        const actual = escapeUnicode(input, options);

        assert.strictEqual(actual, expected);
      });
    });
  });

  describe("when filter option is specified", () => {
    it("should convert only filtered characters to Unicode escapes", () => {
      const filter = isNotAscii;
      const expected = "I \\u2665 Unicode!";
      const actual = escapeUnicode("I ♥ Unicode!", { filter });

      assert.strictEqual(actual, expected);
    });

    it("should call filter for each Unicode character in input", () => {
      const filter = mock.fn<Filter>();
      escapeUnicode("I♥𠮷𠮾", { filter });

      assert.strictEqual(filter.mock.callCount(), 4);
      assert.deepStrictEqual(filter.mock.calls[0]?.arguments, [0x0049, "I"]);
      assert.deepStrictEqual(filter.mock.calls[1]?.arguments, [0x2665, "♥"]);
      assert.deepStrictEqual(filter.mock.calls[2]?.arguments, [0x020bb7, "𠮷"]);
      assert.deepStrictEqual(filter.mock.calls[3]?.arguments, [0x020bbe, "𠮾"]);
    });
  });

  describe("when replacer option is specified", () => {
    describe("when replacer option returns replacement string", () => {
      describe("when input contains character handled by replacer option", () => {
        it("should convert characters to Unicode escapes and replace characters", () => {
          const replacer = replaceChars({ "\t": "\\t" });
          const expected =
            "\\u0049\\t\\u2665\\t\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021";
          const actual = escapeUnicode("I\t♥\tUnicode!", { replacer });

          assert.strictEqual(actual, expected);
        });
      });
    });

    describe("when replacer option returns null", () => {
      it("should convert characters to Unicode escapes", () => {
        const replacer = replaceChars({ "\n": "\\n" });
        const expected =
          "\\u0049\\u0009\\u2665\\u0009\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021";
        const actual = escapeUnicode("I\t♥\tUnicode!", { replacer });

        assert.strictEqual(actual, expected);
      });
    });

    describe("when replacer option returns undefined", () => {
      it("should convert characters to Unicode escapes", () => {
        const replacer = replaceChars({ "\n": "\\n" });
        const expected =
          "\\u0049\\u0009\\u2665\\u0009\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021";
        const actual = escapeUnicode("I\t♥\tUnicode!", { replacer });

        assert.strictEqual(actual, expected);
      });
    });
  });

  describe("when filter and replacer options are both specified", () => {
    describe("when replacer option returns replacement string", () => {
      describe("when input contains character handled by replacer option", () => {
        it("should convert only filtered characters to Unicode escapes and replace characters", () => {
          const filter = isNotAscii;
          const replacer = replaceChars({ "\t": "\\t" });
          const expected = "I\\t\\u2665\\tUnicode!";
          const actual = escapeUnicode("I\t♥\tUnicode!", { filter, replacer });

          assert.strictEqual(actual, expected);
        });
      });
    });

    describe("when replacer option returns null", () => {
      it("should convert only filtered characters to Unicode escapes", () => {
        const filter = isNotAscii;
        const replacer = replaceChars({ "\n": "\\n" });
        const expected = "I\t\\u2665\tUnicode!";
        const actual = escapeUnicode("I\t♥\tUnicode!", { filter, replacer });

        assert.strictEqual(actual, expected);
      });
    });

    describe("when replacer option returns undefined", () => {
      it("should convert only filtered characters to Unicode escapes", () => {
        const filter = isNotAscii;
        const replacer = replaceChars({ "\n": "\\n" });
        const expected = "I\t\\u2665\tUnicode!";
        const actual = escapeUnicode("I\t♥\tUnicode!", { filter, replacer });

        assert.strictEqual(actual, expected);
      });
    });
  });
});
