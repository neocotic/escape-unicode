/*
 * Copyright (C) 2018 Alasdair Mercer, !ninja
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

'use strict';

// TODO: Complete

const assert = require('assert');

const escapeUnicode = require('../src/escape-unicode');

describe('escapeUnicode', () => {
  it.skip('should convert characters to Unicode escapes', () => {
    // TODO: Complete
  });

  context('when input is null', () => {
    it('should return null', () => {
      const actual = escapeUnicode(null);

      assert.strictEqual(actual, null);
    });
  });

  context('when input is empty', () => {
    it('should return an empty string', () => {
      const expected = '';
      const actual = escapeUnicode('');

      assert.strictEqual(actual, expected);
    });
  });

  context('when start is specified', () => {
    it.skip('should convert characters to Unicode escapes from start in input', () => {
      // TODO: Complete
    });

    context('and start is negative', () => {
      it.skip('should convert from beginning of input', () => {
        // TODO: Complete
      });
    });

    context('and start is null', () => {
      it.skip('should convert from beginning of input', () => {
        // TODO: Complete
      });
    });

    context('when start is greater than length of input', () => {
      it.skip('return an empty string', () => {
        // TODO: Complete
      });
    });

    context('and input is null', () => {
      it.skip('should return null', () => {
        // TODO: Complete
      });
    });

    context('when input is empty', () => {
      it.skip('return an empty string', () => {
        // TODO: Complete
      });
    });
  });

  context('when end is specified', () => {
    it.skip('should convert characters to Unicode escapes between start and end in input', () => {
      // TODO: Complete
    });

    context('and end is negative', () => {
      it.skip('should convert from start in input', () => {
        // TODO: Complete
      });
    });

    context('and end is null', () => {
      it.skip('should convert from start in input', () => {
        // TODO: Complete
      });
    });

    context('when end is greater than length of input', () => {
      it.skip('return convert from start in input', () => {
        // TODO: Complete
      });
    });

    context('and input is null', () => {
      it.skip('should return null', () => {
        // TODO: Complete
      });
    });

    context('when input is empty', () => {
      it.skip('return an empty string', () => {
        // TODO: Complete
      });
    });
  });
});
