'use strict';

const TOKEN       = /^(.*?)([A-Z_]+)(.*?)$/;
const TOKEN_OPEN  = 91; // [
const TOKEN_CLOSE = 93; // ]

/**
 * A basic templating engine.
 * Takes every `[TOKEN]` from given string and replaces it with
 * `TOKEN` value from given `data` attribute. The token itself may contain
 * various characters between `[`, token name and `]`. Contents of `[...]` will
 * be outputted only if `TOKEN` value is not empty. Also, only `TOKEN` name will
 * be replaced with actual value, all other characters will remain as is.
 *
 * Example:
 * ```
 * template('[<NAME>]', {NAME: 'foo'}) -> "<foo>"
 * template('[<NAME>]', {}) -> ""
 * ```
 */
export default function template(str, data) {
	if (str == null) {
		return str;
	}

	// NB since token may contain inner `[` and `]`, we can’t just use regexp
	// for replacement, should manually parse string instead
	const stack = [];
	const replacer = (str, left, token, right) =>
		data[token] != null ? left + data[token] + right : '';

	let output = '';
	let offset = 0, i = 0;
	let code, lastPos;

	while (i < str.length) {
		code = str.charCodeAt(i);
		if (code === TOKEN_OPEN) {
			stack.push(i);
		} else if (code === TOKEN_CLOSE) {
			lastPos = stack.pop();
			if (!stack.length) {
				output += str.slice(offset, lastPos) +
					str.slice(lastPos + 1, i).replace(TOKEN, replacer);
				offset = i + 1;
			}
		}

		i++;
	}

	return output + str.slice(offset);
}
