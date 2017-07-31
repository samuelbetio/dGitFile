'use strict';

/**
 * Common utility methods for indent-based syntaxes (Slim, Pug, etc.)
 */

import template from '../../lib/template';
import { isFirstChild, isRoot } from '../../lib/utils';

const reId = /^id$/i;
const reClass = /^class$/i;
const defaultAttrOptions = {
	primary: attrs => attrs.join(''),
	secondary: attrs => attrs.map(attr => attr.isBoolean ? attr.name : `${attr.name}=${attr.value}`).join(', ')
};

const defaultNodeOptions = {
	open: null,
	close: null,
	omitName: /^div$/i,
	attributes: defaultAttrOptions
};

export default function indentFormat(outNode, profile, options) {
	options = Object.assign({}, defaultNodeOptions, options);
	const node = outNode.node;

	outNode.indent = profile.indent(getIndentLevel(node, profile));
	outNode.newline = '\n';

	// Do not format the very first node in output
    if (!isRoot(node.parent) || !isFirstChild(node)) {
        outNode.beforeOpen = outNode.newline + outNode.indent;
    }

	if (node.name) {
		const data = Object.assign({
			NAME: profile.name(node.name),
			SELF_CLOSE: node.selfClosing ? options.selfClose : null
		}, getAttributes(outNode, profile, options.attributes));

		// omit tag name if node has primary attributes
		if (options.omitName && options.omitName.test(data.NAME) && data.PRIMARY_ATTRS) {
			data.NAME = null;
		}

		if (options.open != null) {
			outNode.open = template(options.open, data);
		}

		if (options.close != null) {
			outNode.close = template(options.close, data);
		}
	}

	return outNode;
}

/**
 * Formats attributes of given node into a string.
 * @param  {OutputNode} node          Output node wrapper
 * @param  {Profile}    profile       Output profile
 * @param  {Object}     options       Additional formatting options
 * @return {String}
 */
export function getAttributes(outNode, profile, options) {
	options = Object.assign({}, defaultAttrOptions, options);
	const primary = [], secondary = [];
	const node = outNode.node;

	node.attributes.forEach(attr => {
		if (attr.options.implied && attr.value == null) {
			return null;
		}

		const name = profile.attribute(attr.name);
		const value = outNode.renderFields(attr.value);

		if (reId.test(name)) {
			value && primary.push(`#${value}`);
		} else if (reClass.test(name)) {
			value && primary.push(`.${value.replace(/\s+/g, '.')}`);
		} else {
			const isBoolean = attr.value == null
				&& (attr.options.boolean || profile.get('booleanAttributes').indexOf(name.toLowerCase()) !== -1);

			secondary.push({ name, value, isBoolean });
		}
	});

	return {
		PRIMARY_ATTRS: options.primary(primary) || null,
		SECONDARY_ATTRS: options.secondary(secondary) || null
	};
}

/**
 * Computes indent level for given node
 * @param  {Node} node
 * @param  {Profile} profile
 * @param  {Number} level
 * @return {Number}
 */
export function getIndentLevel(node, profile) {
	let level = node.parent.isTextOnly ? -2 : -1;
	let ctx = node;
	while (ctx = ctx.parent) {
		level++;
	}

	return level < 0 ? 0 : level;
}
