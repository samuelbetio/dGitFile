# Emmet output formatters [![Build Status](https://travis-ci.org/emmetio/markup-formatters.svg?branch=master)](https://travis-ci.org/emmetio/markup-formatters)

A collection of output formatters for Emmet abbreviations. Takes [parsed abbreviation](https://github.com/emmetio/abbreviation) and returns its string representation, formatted according to given [output profile](https://github.com/emmetio/output-profile), in one of supported syntax:

* HTML (including XML and XHTML)
* HAML
* Pug
* Slim

## Bundles

The default bundle contains all supported syntaxes. If you don’t need all of them and want to cut-down your own bundle size a bit, you can import required formatters directly:

```js
// import all formatters
import format from '@emmetio/markup-formatters';

// import HTML formatter only
import html from '@emmetio/markup-formatters/dist/html.es.js';
// ...also available as CommonJS module, e.g. dist/html.cjs.js
```

## Examples

```js
import parse from '@emmetio/abbreviation';
import Profile from '@emmetio/output-profile';
import format from '@emmetio/markup-formatters';

// parse abbreviation first
const abbr = parse('ul>li.item*3>img');

// output as HTML
const htmlProfile = new Profile({
	compactBooleanAttributes: true
});
console.log(format(abbr, htmlProfile, 'html'));

// output as XML
const xmlProfile = new Profile({
	selfClosingStyle: 'xml',
	inlineBreak: 0
});
console.log(format(abbr, xmlProfile, 'html'));

// output as Slim
console.log(format(abbr, new Profile(), 'slim'));
```
