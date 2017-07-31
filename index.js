'use strict';

import html from './format/html';
import haml from './format/haml';
import slim from './format/slim';
import pug  from './format/pug';

const supportedSyntaxed = { html, haml, slim, pug };

/**
 * Outputs given parsed abbreviation in specified syntax
 * @param {Node}     tree     Parsed abbreviation tree
 * @param {Profile}  profile  Output profile
 * @param {String}   [syntax] Output syntax. If not given, `html` syntax is used
 * @param {Function} options.field A function to output field/tabstop for
 * host editor. This function takes two arguments: `index` and `placeholder` and
 * should return a string that represents tabstop in host editor. By default
 * only a placeholder is returned
 * @example
 * {
 * 	field(index, placeholder) {
 * 		// return field in TextMate-style, e.g. ${1} or ${2:foo}
 * 		return `\${${index}${placeholder ? ':' + placeholder : ''}}`;
 *  }
 * }
 * @return {String}
 */
export default function(tree, profile, syntax, options) {
	if (typeof syntax === 'object') {
		options = syntax;
		syntax = null;
	}

	if (!supports(syntax)) {
		// fallback to HTML if given syntax is not supported
		syntax = 'html';
	}

	return supportedSyntaxed[syntax](tree, profile, options);
};

/**
 * Check if given syntax is supported
 * @param {String} syntax
 * @return {Boolean}
 */
export function supports(syntax) {
	return !!syntax && syntax in supportedSyntaxed;
}
