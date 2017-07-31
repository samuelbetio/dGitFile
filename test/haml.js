'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
const Profile = require('@emmetio/output-profile');
const replaceVariables = require('@emmetio/variable-resolver');
require('babel-register');
const haml = require('../format/haml').default;

describe('HAML formatter', () => {
    const field = (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`;
    const expand = (abbr, profile, options) => {
		if (typeof profile === 'function') {
            options = { field: profile };
            profile = null;
        }

        return haml(replaceVariables(parse(abbr)), profile || new Profile(), options);
    };

    it('basic', () => {
		assert.equal(expand('div#header>ul.nav>li[title=test].nav-item*2'),
			'#header\n\t%ul.nav\n\t\t%li.nav-item(title="test")\n\t\t%li.nav-item(title="test")');

		assert.equal(expand('div#foo[data-n1=v1 title=test data-n2=v2].bar'),
			'#foo.bar(data-n1="v1" title="test" data-n2="v2")');

		let profile = new Profile({ compactBooleanAttributes: true });
		assert.equal(expand('input[disabled. foo title=test]/', profile), '%input(disabled foo="" title="test")/');

		profile = new Profile({ compactBooleanAttributes: false });
		assert.equal(expand('input[disabled. foo title=test]/', profile), '%input(disabled=true foo="" title="test")/');
    });

	it('nodes with text', () => {
		assert.equal(expand('{Text 1}'), 'Text 1');
		assert.equal(expand('span{Text 1}'), '%span Text 1');
		assert.equal(expand('span{Text 1}>b{Text 2}'), '%span Text 1\n\t%b Text 2');
		assert.equal(expand('span{Text 1\nText 2}>b{Text 3}'), '%span\n\tText 1 |\n\tText 2 |\n\t%b Text 3');
		assert.equal(expand('div>span{Text 1\nText 2\nText 123}>b{Text 3}'), '%div\n\t%span\n\t\tText 1   |\n\t\tText 2   |\n\t\tText 123 |\n\t\t%b Text 3');
	});

	it('generate fields', () => {
		assert.equal(expand('a[href]', field), '%a(href="${1}")${2}');
		assert.equal(expand('a[href]*2', field), '%a(href="${1}")${2}\n%a(href="${3}")${4}');

		assert.equal(expand('{${0} ${1:foo} ${2:bar}}*2', field), '${1} ${2:foo} ${3:bar}${4} ${5:foo} ${6:bar}');
		assert.equal(expand('{${0} ${1:foo} ${2:bar}}*2'), ' foo bar foo bar');

        assert.equal(expand('ul>li*2', field), '%ul\n\t%li${1}\n\t%li${2}');

		assert.equal(expand('div>img[src]/', field), '%div\n\t%img(src="${1}")/');
	});
});
