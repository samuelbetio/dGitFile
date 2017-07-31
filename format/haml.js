'use strict';

import render from '@emmetio/output-renderer';
import indentFormat from './assets/indent-format';
import { splitByLines, handlePseudoSnippet } from '../lib/utils';

const reNl = /\n|\r/;

/**
 * Renders given parsed Emmet abbreviation as HAML, formatted according to
 * `profile` options
 * @param  {Node}    tree      Parsed Emmet abbreviation
 * @param  {Profile} profile   Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
export default function haml(tree, profile, options) {
	options = options || {};
	const nodeOptions = {
		open: '[%NAME][PRIMARY_ATTRS][(SECONDARY_ATTRS)][SELF_CLOSE]',
		selfClose: '/',
		attributes: {
			secondary(attrs) {
				return attrs.map(attr => attr.isBoolean
					? `${attr.name}${profile.get('compactBooleanAttributes') ? '' : '=true'}`
					: `${attr.name}=${profile.quote(attr.value)}`
				).join(' ');
			}
		}
	};

	return render(tree, options.field, outNode => {
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
 * NB Unlike HTML, HAML is indent-based format so some formatting options from
 * `profile` will not take effect, otherwise output will be broken
 * @param  {OutputNode} outNode Output wrapper of parsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function updateFormatting(outNode, profile) {
	const node = outNode.node;

    if (!node.isTextOnly && node.value) {
        // node with text: put a space before single-line text
        outNode.beforeText = reNl.test(node.value)
			? outNode.newline + outNode.indent + profile.indent(1)
			: ' ';
    }

	return outNode;
}
/**
 * Formats value of given node: for multiline text we should add a ` |` suffix
 * at the end of each line. Also ensure that text is perfectly aligned.
 * @param  {Node}    node
 * @param  {Profile} profile
 * @return {String|null}
 */
function formatNodeValue(node, profile) {
	if (node.value != null && reNl.test(node.value)) {
		const lines = splitByLines(node.value);
		const indent = profile.indent(1);
		const maxLength = lines.reduce((prev, line) => Math.max(prev, line.length), 0);

		return lines.map((line, i) => `${i ? indent : ''}${pad(line, maxLength)} |`).join('\n');
	}

	return node.value;
}

function pad(text, len) {
	while (text.length < len) {
		text += ' ';
	}

	return text;
}
