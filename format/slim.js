'use strict';

import render from '@emmetio/output-renderer';
import indentFormat from './assets/indent-format';
import { splitByLines, handlePseudoSnippet, isRoot } from '../lib/utils';

const reNl = /\n|\r/;
const secondaryAttrs = {
	none:   '[ SECONDARY_ATTRS]',
	round:  '[(SECONDARY_ATTRS)]',
	curly:  '[{SECONDARY_ATTRS}]',
	square: '[[SECONDARY_ATTRS]'
};

/**
 * Renders given parsed Emmet abbreviation as Slim, formatted according to
 * `profile` options
 * @param  {Node}    tree      Parsed Emmet abbreviation
 * @param  {Profile} profile   Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
export default function slim(tree, profile, options) {
	options = options || {};
	const SECONDARY_ATTRS = options.attributeWrap
		&& secondaryAttrs[options.attributeWrap]
		|| secondaryAttrs.none;

	const booleanAttr = SECONDARY_ATTRS === secondaryAttrs.none
		? attr => `${attr.name}=true`
		: attr => attr.name

	const nodeOptions = {
		open: `[NAME][PRIMARY_ATTRS]${SECONDARY_ATTRS}[SELF_CLOSE]`,
		selfClose: '/',
		attributes: {
			secondary(attrs) {
				return attrs.map(attr => attr.isBoolean
					? booleanAttr(attr)
					: `${attr.name}=${profile.quote(attr.value)}`
				).join(' ');
			}
		}
	};

	return render(tree, options.field, (outNode, renderFields) => {
		outNode = indentFormat(outNode, profile, nodeOptions);
		outNode = updateFormatting(outNode, profile);

		if (!handlePseudoSnippet(outNode)) {
			const node = outNode.node;

			// Do not generate fields for nodes with empty value and children
			// or if node is self-closed
			if (node.value || (!node.children.length && !node.selfClosing) ) {
				outNode.text = outNode.renderFields(formatNodeValue(node, profile));
			}
		}

        return outNode;
	});
};

/**
 * Updates formatting properties for given output node
 * NB Unlike HTML, Slim is indent-based format so some formatting options from
 * `profile` will not take effect, otherwise output will be broken
 * @param  {OutputNode} outNode Output wrapper of farsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function updateFormatting(outNode, profile) {
	const node = outNode.node;
	const parent = node.parent;

	// Edge case: a single inline-level child inside node without text:
	// allow it to be inlined
	if (profile.get('inlineBreak') === 0 && isInline(node, profile)
		&& !isRoot(parent) && parent.value == null && parent.children.length === 1) {
		outNode.beforeOpen = ': ';
	}

    if (!node.isTextOnly && node.value) {
        // node with text: put a space before single-line text
        outNode.beforeText = reNl.test(node.value)
			? outNode.newline + outNode.indent + profile.indent(1)
			: ' ';
    }

	return outNode;
}

/**
 * Formats value of given node: for multiline text we should precede each
 * line with `| ` with one-level deep indent
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {String|null}
 */
function formatNodeValue(node, profile) {
	if (node.value != null && reNl.test(node.value)) {
		const indent = profile.indent(1);
		return splitByLines(node.value).map((line, i) => `${indent}${i ? ' ' : '|'} ${line}`).join('\n');
	}

	return node.value;
}

/**
 * Check if given node is inline-level
 * @param  {Node}  node
 * @param  {Profile}  profile
 * @return {Boolean}
 */
function isInline(node, profile) {
	return node && (node.isTextOnly || profile.isInline(node));
}
