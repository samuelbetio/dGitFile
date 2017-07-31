'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
const Profile = require('@emmetio/output-profile');
const replaceVariables = require('@emmetio/variable-resolver');
require('babel-register');
const format = require('../index').default;

describe('Main formatter', () => {
	const expand = (abbr, syntax) =>
        format(parse(abbr), new Profile(), syntax);

	it('expand', () => {
		assert.equal(expand('a>b'), '<a><b></b></a>');
		assert.equal(expand('a>b', 'html'), '<a><b></b></a>');
		assert.equal(expand('a>b', 'slim'), 'a\n\tb');
		assert.equal(expand('a>b', 'haml'), '%a\n\t%b');
	});
});
