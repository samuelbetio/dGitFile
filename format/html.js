'use strict';

import parseFields from '@emmetio/field-parser';
import render from '@emmetio/output-renderer';
import template from '../lib/template';
import { handlePseudoSnippet, isFirstChild, isRoot, isPseudoSnippet } from '../lib/utils';

const commentOptions = {
	// enable node commenting
	enabled: false,

	// attributes that should trigger node commenting on specific node,
	// if commenting is enabled
	trigger: ['id', 'class'],

	// comment before opening tag
	before: '',

	// comment after closing tag
	after: '\n<!-- /[#ID][.CLASS] -->'
};

/**
 * Renders given parsed Emmet abbreviation as HTML, formatted according to
 * `profile` options
 * @param  {Node}     tree    Parsed Emmet abbreviation
 * @param  {Profile}  profile Output profile
 * @param  {Object}  [options] Additional formatter options
 * @return {String}
 */
export default function html(tree, profile, options) {
	options = Object.assign({}, options);
	options.comment = Object.assign({}, commentOptions, options.comment);

	return render(tree, options.field, outNode => {
		outNode = setFormatting(outNode, profile);

		if (!handlePseudoSnippet(outNode)) {
			const node = outNode.node;

			if (node.name) {
				const name = profile.name(node.name);
				const attrs = formatAttributes(outNode, profile);

				outNode.open = `<${name}${attrs}${node.selfClosing ? profile.selfClose() : ''}>`;
				if (!node.selfClosing) {
					outNode.close = `</${name}>`;
				}

				commentNode(outNode, options.comment);
			}

			// Do not generate fields for nodes with empty value and children
			// or if node is self-closed
			if (node.value || (!node.children.length && !node.selfClosing) ) {
				outNode.text = outNode.renderFields(node.value);
			}
		}

		return outNode;
	});
}

/**
 * Updates formatting properties for given output node
 * @param  {OutputNode} outNode Output wrapper of farsed abbreviation node
 * @param  {Profile}    profile Output profile
 * @return {OutputNode}
 */
function setFormatting(outNode, profile) {
	const node = outNode.node;

    if (shouldFormatNode(node, profile)) {
        outNode.indent = profile.indent(getIndentLevel(node, profile));
        outNode.newline = '\n';
        const prefix = outNode.newline + outNode.indent;

        // do not format the very first node in output
        if (!isRoot(node.parent) || !isFirstChild(node)) {
            outNode.beforeOpen = prefix;
            if (node.isTextOnly) {
                outNode.beforeText = prefix;
            }
        }

        if (hasInnerFormatting(node, profile)) {
            if (!node.isTextOnly) {
                outNode.beforeText = prefix + profile.indent(1);
            }
            outNode.beforeClose = prefix;
        }
    }

    return outNode;
}

/**
 * Check if given node should be formatted
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {Boolean}
 */
function shouldFormatNode(node, profile) {
	if (!profile.get('format')) {
		return false;
	}

    if (node.parent.isTextOnly
        && node.parent.children.length === 1
        && parseFields(node.parent.value).fields.length) {
        // Edge case: do not format the only child of text-only node,
        // but only if parent contains fields
        return false;
    }

	return isInline(node, profile) ? shouldFormatInline(node, profile) : true;
}

/**
 * Check if given inline node should be formatted as well, e.g. it contains
 * enough adjacent siblings that should force formatting
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {Boolean}
 */
function shouldFormatInline(node, profile) {
	if (!isInline(node, profile)) {
		return false;
	}

    if (isPseudoSnippet(node)) {
        return true;
    }

    // check if inline node is the next sibling of block-level node
    if (node.childIndex === 0) {
        // first node in parent: format if it’s followed by a block-level element
        let next = node;
        while (next = next.nextSibling) {
            if (!isInline(next, profile)) {
                return true;
            }
        }
    } else if (!isInline(node.previousSibling, profile)) {
        // node is right after block-level element
        return true;
    }

    if (profile.get('inlineBreak')) {
        // check for adjacent inline elements before and after current element
        let adjacentInline = 1;
        let before = node, after = node;

        while (isInlineElement((before = before.previousSibling), profile)) {
            adjacentInline++;
        }

        while (isInlineElement((after = after.nextSibling), profile)) {
            adjacentInline++;
        }

		if (adjacentInline >= profile.get('inlineBreak')) {
			return true;
		}
    }

	// Another edge case: inline node contains node that should receive foramtting
	for (let i = 0, il = node.children.length; i < il; i++) {
		if (shouldFormatNode(node.children[i], profile)) {
			return true;
		}
	}

    return false;
}

/**
 * Check if given node contains inner formatting, e.g. any of its children should
 * be formatted
 * @param  {Node} node
 * @param  {Profile} profile
 * @return {Boolean}
 */
function hasInnerFormatting(node, profile) {
    // check if node if forced for inner formatting
    const nodeName = (node.name || '').toLowerCase();
    if (profile.get('formatForce').indexOf(nodeName) !== -1) {
        return true;
    }

    // check if any of children should receive formatting
    // NB don’t use `childrent.some()` to reduce memory allocations
    for (let i = 0; i < node.children.length; i++) {
        if (shouldFormatNode(node.children[i], profile)) {
            return true;
        }
    }

    return false;
}

/**
 * Outputs attributes of given abbreviation node as HTML attributes
 * @param  {OutputNode} outNode
 * @param  {Profile}    profile
 * @return {String}
 */
function formatAttributes(outNode, profile) {
	const node = outNode.node;

    return node.attributes.map(attr => {
        if (attr.options.implied && attr.value == null) {
    		return null;
    	}

    	const attrName = profile.attribute(attr.name);
    	let attrValue = null;

        // handle boolean attributes
    	if (attr.options.boolean || profile.get('booleanAttributes').indexOf(attrName.toLowerCase()) !== -1) {
    		if (profile.get('compactBooleanAttributes') && attr.value == null) {
    			return ` ${attrName}`;
    		} else if (attr.value == null) {
    			attrValue = attrName;
    		}
    	}

    	if (attrValue == null) {
    		attrValue = outNode.renderFields(attr.value);
    	}

    	return ` ${attrName}=${profile.quote(attrValue)}`;
    }).join('');
}

/**
 * Check if given node is inline-level
 * @param  {Node}  node
 * @param  {Profile}  profile
 * @return {Boolean}
 */
function isInline(node, profile) {
	return (node && node.isTextOnly) || isInlineElement(node, profile);
}

/**
 * Check if given node is inline-level element, e.g. element with explicitly
 * defined node name
 * @param  {Node}  node
 * @param  {Profile}  profile
 * @return {Boolean}
 */
function isInlineElement(node, profile) {
	return node && profile.isInline(node);
}

/**
 * Computes indent level for given node
 * @param  {Node} node
 * @param  {Profile} profile
 * @param  {Number} level
 * @return {Number}
 */
function getIndentLevel(node, profile) {
	// Increase indent level IF NOT:
	// * parent is text-only node
	// * there’s a parent node with a name that is explicitly set to decrease level
	const skip = profile.get('formatSkip') || [];
	let level = node.parent.isTextOnly ? -2 : -1;
	let ctx = node;
	while (ctx = ctx.parent) {
		if (skip.indexOf( (ctx.name || '').toLowerCase() ) === -1) {
			level++;
		}
	}

	return level < 0 ? 0 : level;
}

/**
 * Comments given output node, if required
 * @param  {OutputNode} outNode
 * @param  {Object} options
 */
function commentNode(outNode, options) {
	const node = outNode.node;

	if (!options.enabled || !options.trigger || !node.name) {
		return;
	}

	const attrs = outNode.node.attributes.reduce((out, attr) => {
		if (attr.name && attr.value != null) {
			out[attr.name.toUpperCase().replace(/-/g, '_')] = attr.value;
		}

		return out;
	}, {});

	// add comment only if attribute trigger is present
	for (let i = 0, il = options.trigger.length; i < il; i++) {
		if (options.trigger[i].toUpperCase() in attrs) {
			outNode.open = template(options.before, attrs) + outNode.open;
			if (outNode.close) {
				outNode.close += template(options.after, attrs);
			}
			break;
		}
	}
}
