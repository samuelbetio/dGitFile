'use strict';

const assert = require('assert');
require('babel-register');
const tmpl = require('../lib/template').default;

describe('Template', () => {
    it('replace', () => {
        assert.equal(tmpl('<[NAME][ ATTRS]>', {NAME: 'foo'}), '<foo>');
        assert.equal(tmpl('<[NAME][ ATTRS]>', {NAME: 'foo', ATTRS: 'a="b" c="d"'}), '<foo a="b" c="d">');

		assert.equal(tmpl('[%NAME][(ATTRS)]', {NAME: 'foo'}), '%foo');
		assert.equal(tmpl('[%NAME][(ATTRS)]', {NAME: 'foo', ATTRS: 'a="b" c="d"'}), '%foo(a="b" c="d")');

		// support inner square braces as well
		assert.equal(tmpl('[%NAME][[ATTRS]]', {NAME: 'foo', ATTRS: 'a="b" c="d"'}), '%foo[a="b" c="d"]');
    });
});
