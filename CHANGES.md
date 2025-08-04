## Version 0.3.0, 2025.08.04

* **Breaking Change:** Remove `start` and `end` 2nd and 3rd optional parameters and always escape full range of `input`
  parameter
  * Caller is now responsible for slicing the `input` parameter beforehand, if desired
* **Breaking Change:** Add optional `options` 2nd parameter to support the following:
  * `filter` - A function used to determine which Unicode code points should be converted to Unicode escapes
  * `replacer` - A function that returns a replacement string for an individual Unicode character represented by a
    specific Unicode code point, if any
* **Breaking Change:** Return empty string if `input` parameter is either `null` or `undefined`
* Explicitly add full support for converting characters within the Basic Multilingual Plane (BMP)
* Rewrite the entire codebase in TypeScript and support both ESM and CJS usage
* Improve documentation
* Improve the developer experience for contributors with better tooling
* Bump all dependencies to latest versions

## Version 0.2.0, 2018.11.09

* added package-lock.json file to enable "npm audit" [0ca4cac](https://github.com/neocotic/escape-unicode/commit/0ca4cac801ba9481e67ba463f77f45d09b5ff7f3)
* moved from !ninja to neocotic [c48234a](https://github.com/neocotic/escape-unicode/commit/c48234aa27ad7e1428bd7e31353715e0d7ca4d7d)
* modified CI to now target Node.js 8, 10, and 11 [9a13173](https://github.com/neocotic/escape-unicode/commit/9a1317356fcb623dcf78b5d0ac9678b22a83811b)
* bumped devDependencies [d281985](https://github.com/neocotic/escape-unicode/commit/d2819852ec904fde5af47d72a930510a95c3c63f)

## Version 0.1.0, 2018.01.25

* Initial release
