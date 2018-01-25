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

const assert = require('assert');

const escapeUnicode = require('../src/escape-unicode');

describe('escapeUnicode', () => {
  it('should convert characters to Unicode escapes', () => {
    const tests = {
      '♥': '\\u2665',
      'I ♥ Unicode!': '\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021'
    };

    for (const [ input, expected ] of Object.entries(tests)) {
      const actual = escapeUnicode(input);

      assert.equal(actual, expected);
    }
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

      assert.equal(actual, expected);
    });
  });

  context('when start is specified', () => {
    it('should convert characters to Unicode escapes from start in input', () => {
      let expected = '\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
      let actual = escapeUnicode('I ♥ Unicode!', 0);

      assert.equal(actual, expected);

      expected = '\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
      actual = escapeUnicode('I ♥ Unicode!', 2);

      assert.equal(actual, expected);
    });

    context('and start is negative', () => {
      it('should convert from beginning of input', () => {
        const expected = '\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
        const actual = escapeUnicode('I ♥ Unicode!', -10);

        assert.equal(actual, expected);
      });
    });

    context('and start is null', () => {
      it('should convert from beginning of input', () => {
        const expected = '\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
        const actual = escapeUnicode('I ♥ Unicode!', null);

        assert.equal(actual, expected);
      });
    });

    context('when start is greater than length of input', () => {
      it('return an empty string', () => {
        const expected = '';
        const actual = escapeUnicode('I ♥ Unicode!', 50);

        assert.equal(actual, expected);
      });
    });

    context('and input is null', () => {
      it('should return null', () => {
        const actual = escapeUnicode(null, 0);

        assert.strictEqual(actual, null);
      });
    });

    context('when input is empty', () => {
      it('return an empty string', () => {
        const expected = '';
        const actual = escapeUnicode('', 0);

        assert.strictEqual(actual, expected);
      });
    });
  });

  context('when end is specified', () => {
    it('should convert characters to Unicode escapes between start and end in input', () => {
      const input = 'I ♥ Unicode!';
      let expected = '\\u0049\\u0020\\u2665\\u0020\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
      let actual = escapeUnicode(input, 0, input.length);

      assert.equal(actual, expected);

      expected = '\\u2665';
      actual = escapeUnicode(input, 2, 3);

      assert.equal(actual, expected);

      expected = '\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065';
      actual = escapeUnicode(input, 4, input.length - 1);

      assert.equal(actual, expected);
    });

    context('and end is negative', () => {
      it('should convert from start in input', () => {
        const expected = '\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
        const actual = escapeUnicode('I ♥ Unicode!', 4, -50);

        assert.equal(actual, expected);
      });
    });

    context('and end is null', () => {
      it('should convert from start in input', () => {
        const expected = '\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
        const actual = escapeUnicode('I ♥ Unicode!', 4, null);

        assert.equal(actual, expected);
      });
    });

    context('when end is greater than length of input', () => {
      it('return convert from start in input', () => {
        const expected = '\\u0055\\u006e\\u0069\\u0063\\u006f\\u0064\\u0065\\u0021';
        const actual = escapeUnicode('I ♥ Unicode!', 4, 50);

        assert.equal(actual, expected);
      });
    });

    context('when end is equal to start', () => {
      it('return an empty string', () => {
        const expected = '';
        const actual = escapeUnicode('I ♥ Unicode!', 2, 2);

        assert.equal(actual, expected);
      });
    });

    context('when end is less than start', () => {
      it('return an empty string', () => {
        const expected = '';
        const actual = escapeUnicode('I ♥ Unicode!', 4, 4);

        assert.equal(actual, expected);
      });
    });

    context('and input is null', () => {
      it('should return null', () => {
        const actual = escapeUnicode(null, 0, 50);

        assert.strictEqual(actual, null);
      });
    });

    context('when input is empty', () => {
      it('return an empty string', () => {
        const expected = '';
        const actual = escapeUnicode('', 0, 50);

        assert.equal(actual, expected);
      });
    });
  });
});
