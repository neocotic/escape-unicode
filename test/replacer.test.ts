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
  composeReplacer,
  replaceChar,
  replaceChars,
  replaceCode,
  replaceCodes,
} from "../src/replacer.js";

describe("composeReplacer", () => {
  describe("when single replacer is provided", () => {
    describe("when replacer should return replacement string", () => {
      it("should return replacement string from first replacer", () => {
        const replacer = composeReplacer(replaceChars({ "\t": "\\t" }));

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when replacer should not return replacement string", () => {
      it("should return undefined", () => {
        const replacer = composeReplacer(replaceChars({ "\t": "\\t" }));

        assert.strictEqual(replacer(0x000a, "\n"), undefined);
      });
    });
  });

  describe("when multiple replacers are provided", () => {
    describe("when only one replacer should return replacement string", () => {
      it("should return replacement string from first replacer", () => {
        const replacer = composeReplacer(
          replaceChars({}),
          replaceChars({ "\t": "\\t" }),
        );

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when multiple replacers should return replacement string", () => {
      it("should return replacement string from first replacer", () => {
        const replacer = composeReplacer(
          replaceChars({}),
          replaceChars({ "\t": "\\t" }),
          replaceCodes({ 0x0009: "?" }),
        );

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when no replacers should return replacement string", () => {
      it("should return undefined", () => {
        const replacer = composeReplacer(
          replaceChars({}),
          replaceChars({ "\n": "\\n" }),
          replaceCodes({ 0x000a: "?" }),
        );

        assert.strictEqual(replacer(0x0009, "\t"), undefined);
      });
    });
  });

  describe("when no replacers are provided", () => {
    it("should return undefined", () => {
      const replacer = composeReplacer();

      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        .split("")
        .forEach((char) => {
          const code = char.charCodeAt(0);

          assert.strictEqual(replacer(code, char), undefined);
        });
    });
  });
});

describe("replaceChar", () => {
  describe("when char should be replaced", () => {
    it("should return replacement string", () => {
      const replacer = replaceChar("\t", "\\t");

      assert.strictEqual(replacer(0x0009, "\t"), "\\t");
    });
  });

  describe("when char is not in same case", () => {
    it("should return undefined", () => {
      const replacer = replaceChar("\t", "\\t");

      assert.strictEqual(replacer(0x000a, "\n"), undefined);
    });
  });

  describe("when char should not be replaced", () => {
    it("should return undefined", () => {
      const replacer = replaceChar("\t", "\\t");

      assert.strictEqual(replacer(0x000a, "\n"), undefined);
    });
  });
});

describe("replaceChars", () => {
  describe("when replacements is a map", () => {
    describe("when replacements contains replacement character", () => {
      it("should return replacement string", () => {
        const replacer = replaceChars(new Map([["\t", "\\t"]]));

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when replacements does not contain replacement character", () => {
      it("should return undefined", () => {
        const replacer = replaceChars(new Map([["\t", "\\t"]]));

        assert.strictEqual(replacer(0x000a, "\n"), undefined);
      });
    });

    describe("when replacements is empty", () => {
      it("should return undefined", () => {
        const replacer = replaceChars(new Map());

        assert.strictEqual(replacer(0x0009, "\t"), undefined);
      });
    });
  });

  describe("when replacements is an object", () => {
    describe("when replacements contains replacement character", () => {
      it("should return replacement string", () => {
        const replacer = replaceChars({ "\t": "\\t" });

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when replacements does not contain replacement character", () => {
      it("should return undefined", () => {
        const replacer = replaceChars({ "\t": "\\t" });

        assert.strictEqual(replacer(0x000a, "\n"), undefined);
      });
    });

    describe("when replacements is empty", () => {
      it("should return undefined", () => {
        const replacer = replaceChars({});

        assert.strictEqual(replacer(0x0009, "\t"), undefined);
      });
    });
  });
});

describe("replaceCode", () => {
  describe("when code should be replaced", () => {
    it("should return replacement string", () => {
      const replacer = replaceCode(0x0009, "\\t");

      assert.strictEqual(replacer(0x0009, "\t"), "\\t");
    });
  });

  describe("when code is not in same case", () => {
    it("should return undefined", () => {
      const replacer = replaceCode(0x0009, "\\t");

      assert.strictEqual(replacer(0x000a, "\n"), undefined);
    });
  });

  describe("when code should not be replaced", () => {
    it("should return undefined", () => {
      const replacer = replaceCode(0x0009, "\\t");

      assert.strictEqual(replacer(0x000a, "\n"), undefined);
    });
  });
});

describe("replaceCodes", () => {
  describe("when replacements is a map", () => {
    describe("when replacements contains replacement character", () => {
      it("should return replacement string", () => {
        const replacer = replaceCodes(new Map([[0x0009, "\\t"]]));

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when replacements does not contain replacement character", () => {
      it("should return undefined", () => {
        const replacer = replaceCodes(new Map([[0x0009, "\\t"]]));

        assert.strictEqual(replacer(0x000a, "\n"), undefined);
      });
    });

    describe("when replacements is empty", () => {
      it("should return undefined", () => {
        const replacer = replaceCodes(new Map());

        assert.strictEqual(replacer(0x0009, "\t"), undefined);
      });
    });
  });

  describe("when replacements is an object", () => {
    describe("when replacements contains replacement character", () => {
      it("should return replacement string", () => {
        const replacer = replaceCodes({ 0x0009: "\\t" });

        assert.strictEqual(replacer(0x0009, "\t"), "\\t");
      });
    });

    describe("when replacements does not contain replacement character", () => {
      it("should return undefined", () => {
        const replacer = replaceCodes({ 0x0009: "\\t" });

        assert.strictEqual(replacer(0x000a, "\n"), undefined);
      });
    });

    describe("when replacements is empty", () => {
      it("should return undefined", () => {
        const replacer = replaceCodes({});

        assert.strictEqual(replacer(0x0009, "\t"), undefined);
      });
    });
  });
});
