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
import { escape } from "../src/escape.js";

describe("escape", () => {
  [
    {
      code: 0x2665,
      expected: "\\u2665",
    },
    {
      code: 0x0055,
      expected: "\\u0055",
    },
    {
      code: 0x006e,
      expected: "\\u006e",
    },
    {
      code: 0x0069,
      expected: "\\u0069",
    },
    {
      code: 0x0063,
      expected: "\\u0063",
    },
    {
      code: 0x006f,
      expected: "\\u006f",
    },
    {
      code: 0x0064,
      expected: "\\u0064",
    },
    {
      code: 0x0065,
      expected: "\\u0065",
    },
    {
      code: 0x0021,
      expected: "\\u0021",
    },
    {
      code: 0x020bb7,
      expected: "\\ud842\\udfb7",
    },
    {
      code: 0x020bbe,
      expected: "\\ud842\\udfbe",
    },
  ].forEach(({ code, expected }) => {
    describe(`when code point is "${String.fromCodePoint(code)}"`, () => {
      it("should return Unicode escape for Unicode code point", () => {
        const actual = escape(code);

        assert.strictEqual(actual, expected);
      });
    });
  });
});
