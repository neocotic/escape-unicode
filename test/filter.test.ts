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
import { describe, it } from "node:test";
import {
  type Filter,
  composeFilter,
  isAscii,
  isBmp,
  isLatin1,
  isNotAscii,
  isNotBmp,
  isNotLatin1,
} from "../src/filter.js";

const createFilterTests = (
  filter: Filter,
  tests: Array<{
    description: string;
    code: number;
    char: string;
    expected: boolean;
  }>,
) =>
  tests.forEach(({ description, code, char, expected }) =>
    describe(description, () => {
      it(`should return ${expected}`, () => {
        const actual = filter(code, char);

        assert.strictEqual(actual, expected);
      });
    }),
  );

describe("composeFilter", () => {
  describe("when single filter is provided", () => {
    describe("when filter should return true", () => {
      it("should return true", () => {
        const filter = composeFilter(isLatin1);

        assert.strictEqual(filter(0x00ff, "\u00ff"), true);
      });
    });

    describe("when replacer should return false", () => {
      it("should return false", () => {
        const filter = composeFilter(isLatin1);

        assert.strictEqual(filter(0x0100, "\u0100"), false);
      });
    });
  });

  describe("when multiple filters are provided", () => {
    describe("when only one filter should return true", () => {
      it("should return true", () => {
        const filter = composeFilter(isAscii, isLatin1);

        assert.strictEqual(filter(0x00ff, "\u00ff"), true);
      });
    });

    describe("when multiple filters should return true", () => {
      it("should return true", () => {
        const filter = composeFilter(isAscii, isLatin1);

        assert.strictEqual(filter(0x007f, "\u007f"), true);
      });
    });

    describe("when no filters should return true", () => {
      it("should return false", () => {
        const filter = composeFilter(isAscii, isLatin1);

        assert.strictEqual(filter(0x010000, "\ud800\udc00"), false);
      });
    });
  });

  describe("when no filters are provided", () => {
    it("should return false", () => {
      const filter = composeFilter();

      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        .split("")
        .forEach((char) => {
          const code = char.charCodeAt(0);

          assert.strictEqual(filter(code, char), false);
        });
    });
  });
});

describe("isAscii", () => {
  createFilterTests(isAscii, [
    {
      description:
        "when Unicode character is at bottom of ASCII encoding range",
      code: 0x0000,
      char: "\u0000",
      expected: true,
    },
    {
      description:
        "when Unicode character is around middle of ASCII encoding range",
      code: 0x0040,
      char: "\u0040",
      expected: true,
    },
    {
      description: "when Unicode character is at top of ASCII encoding range",
      code: 0x007f,
      char: "\u007f",
      expected: true,
    },
    {
      description: "when Unicode character is above ASCII encoding range",
      code: 0x0080,
      char: "\u0080",
      expected: false,
    },
  ]);
});

describe("isNotAscii", () => {
  createFilterTests(isNotAscii, [
    {
      description: "when Unicode character is above ASCII encoding range",
      code: 0x0080,
      char: "\u0080",
      expected: true,
    },
    {
      description:
        "when Unicode character is at bottom of ASCII encoding range",
      code: 0x0000,
      char: "\u0000",
      expected: false,
    },
    {
      description:
        "when Unicode character is around middle of ASCII encoding range",
      code: 0x0040,
      char: "\u0040",
      expected: false,
    },
    {
      description: "when Unicode character is at top of ASCII encoding range",
      code: 0x007f,
      char: "\u007f",
      expected: false,
    },
  ]);
});

describe("isBmp", () => {
  createFilterTests(isBmp, [
    {
      description: "when Unicode character is at bottom of BMP range",
      code: 0x0000,
      char: "\u0000",
      expected: true,
    },
    {
      description: "when Unicode character is around middle of BMP range",
      code: 0x8000,
      char: "\u8000",
      expected: true,
    },
    {
      description: "when Unicode character is at top of BMP range",
      code: 0xffff,
      char: "\uffff",
      expected: true,
    },
    {
      description: "when Unicode character is above BMP range",
      code: 0x020bb7,
      char: "\ud842\udfb7",
      expected: false,
    },
  ]);
});

describe("isNotBmp", () => {
  createFilterTests(isNotBmp, [
    {
      description: "when Unicode character is above BMP range",
      code: 0x020bb7,
      char: "\ud842\udfb7",
      expected: true,
    },
    {
      description: "when Unicode character is at bottom of BMP range",
      code: 0x0000,
      char: "\u0000",
      expected: false,
    },
    {
      description: "when Unicode character is around middle of BMP range",
      code: 0x8000,
      char: "\u8000",
      expected: false,
    },
    {
      description: "when Unicode character is at top of BMP range",
      code: 0xffff,
      char: "\uffff",
      expected: false,
    },
  ]);
});

describe("isLatin1", () => {
  createFilterTests(isLatin1, [
    {
      description:
        "when Unicode character is at bottom of Latin-1 encoding range",
      code: 0x0000,
      char: "\u0000",
      expected: true,
    },
    {
      description:
        "when Unicode character is around middle of Latin-1 encoding range",
      code: 0x0080,
      char: "\u0080",
      expected: true,
    },
    {
      description: "when Unicode character is at top of Latin-1 encoding range",
      code: 0x00ff,
      char: "\u00ff",
      expected: true,
    },
    {
      description: "when Unicode character is above Latin-1 encoding range",
      code: 0x0100,
      char: "\u0100",
      expected: false,
    },
  ]);
});

describe("isNotLatin1", () => {
  createFilterTests(isNotLatin1, [
    {
      description: "when Unicode character is above Latin-1 encoding range",
      code: 0x0100,
      char: "\u0100",
      expected: true,
    },
    {
      description:
        "when Unicode character is at bottom of Latin-1 encoding range",
      code: 0x0000,
      char: "\u0000",
      expected: false,
    },
    {
      description:
        "when Unicode character is around middle of Latin-1 encoding range",
      code: 0x0080,
      char: "\u0080",
      expected: false,
    },
    {
      description: "when Unicode character is at top of Latin-1 encoding range",
      code: 0x00ff,
      char: "\u00ff",
      expected: false,
    },
  ]);
});
