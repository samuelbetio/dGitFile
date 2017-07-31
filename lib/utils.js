'use strict';

import parseFields from '@emmetio/field-parser';

/**
 * Various utility methods used by formatters
 */

/**
 * Splits given text by lines
 * @param  {String} text
 * @return {String[]}
 */
export function splitByLines(text) {
	return (text || '').split(/\r\n|\r|\n/g);
}

/**
 * Check if given node is a first child in its parent
 * @param  {Node}  node
 * @return {Boolean}
 */
export function isFirstChild(node) {
	return node.parent.firstChild === node;
}

/**
 * Check if given node is a last child in its parent node
 * @param  {Node}  node
 * @return {Boolean}
 */
export function isLastChild(node) {
	return node.parent.lastChild === node;
}

/**
 * Check if given node is a root node
 * @param  {Node}  node
 * @return {Boolean}
 */
export function isRoot(node) {
	return node && !node.parent;
}

/**
 * Check if given node is a pseudo-snippet: a text-only node with explicitly
 * defined children
 * @param  {Node}  node
 * @return {Boolean}
 */
export function isPseudoSnippet(node) {
    return node.isTextOnly && !!node.children.length;
}

/**
 * Handles pseudo-snippet node.
 * A pseudo-snippet is a text-only node with explicitly defined children.
 * For such case, we have to figure out if pseudo-snippet contains fields
 * (tab-stops) in node value and “split” it: make contents before field with
 * lowest index node’s “open” part and contents after lowest index — “close”
 * part. With this trick a final output will look like node’s children
 * are nested inside node value
 * @param  {OutputNode} outNode
 * @return {Boolean} Returns “true” if given node is a pseudo-snippets,
 * `false` otherwise
 */
export function handlePseudoSnippet(outNode) {
	const node = outNode.node; // original abbreviaiton node

	if (isPseudoSnippet(node)) {
		const fieldsModel = parseFields(node.value);
		const field = findLowestIndexField(fieldsModel);
		if (field) {
			const parts = splitFieldsModel(fieldsModel, field);
            outNode.open = outNode.renderFields(parts[0]);
			outNode.close = outNode.renderFields(parts[1]);
		} else {
			outNode.text = outNode.renderFields(fieldsModel);
		}

		return true;
	}

	return false;
}

/**
 * Finds field with lowest index in given text
 * @param  {Object} model
 * @return {Object}
 */
export function findLowestIndexField(model) {
	return model.fields.reduce((result, field) =>
		!result || field.index < result.index ? field : result
		, null);
}

/**
 * Splits given fields model in two parts by given field
 * @param  {Object} model
 * @param  {Object} field
 * @return {Array} Two-items array
 */
export function splitFieldsModel(model, field) {
	const ix = model.fields.indexOf(field);

	const left = new model.constructor(
		model.string.slice(0, field.location),
		model.fields.slice(0, ix)
	);

	const right = new model.constructor(
		model.string.slice(field.location + field.length),
		model.fields.slice(ix + 1)
	);

	return [left, right];
}
