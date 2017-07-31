'use strict';

const assert = require('assert');
const parse = require('@emmetio/abbreviation');
const Profile = require('@emmetio/output-profile');
const replaceVariables = require('@emmetio/variable-resolver');
require('babel-register');
const html = require('../format/html').default;

describe('HTML formatter', () => {
    const field = (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`;
    const expand = (abbr, profile, options) => {
        if (typeof profile === 'function') {
            options = { field: profile };
            profile = null;
        }

        return html(replaceVariables(parse(abbr)), profile || new Profile(), options);
    };

    it('basic', () => {
        assert.equal(expand('div>p'), '<div>\n\t<p></p>\n</div>');
        assert.equal(expand('div>p*3'), '<div>\n\t<p></p>\n\t<p></p>\n\t<p></p>\n</div>');
        assert.equal(expand('div#a>p.b*2>span'), '<div id="a">\n\t<p class="b"><span></span></p>\n\t<p class="b"><span></span></p>\n</div>');
        assert.equal(expand('div>div>div'), '<div>\n\t<div>\n\t\t<div></div>\n\t</div>\n</div>');

        assert.equal(expand('table>tr*2>td{item}*2'), '<table>\n\t<tr>\n\t\t<td>item</td>\n\t\t<td>item</td>\n\t</tr>\n\t<tr>\n\t\t<td>item</td>\n\t\t<td>item</td>\n\t</tr>\n</table>');
    });

    it('inline elements', () => {
        const profile = new Profile({inlineBreak: 3});
        const breakInline = new Profile({inlineBreak: 1});
        const keepInline = new Profile({inlineBreak: 0});
        const xhtml = new Profile({selfClosingStyle: 'xhtml'});

        assert.equal(expand('div>a>b*3', xhtml), '<div>\n\t<a>\n\t\t<b></b>\n\t\t<b></b>\n\t\t<b></b>\n\t</a>\n</div>');

        assert.equal(expand('p>i', profile), '<p><i></i></p>');
        assert.equal(expand('p>i*2', profile), '<p><i></i><i></i></p>');
        assert.equal(expand('p>i*2', breakInline), '<p>\n\t<i></i>\n\t<i></i>\n</p>');
        assert.equal(expand('p>i*3', profile), '<p>\n\t<i></i>\n\t<i></i>\n\t<i></i>\n</p>');
        assert.equal(expand('p>i*3', keepInline), '<p><i></i><i></i><i></i></p>');

        assert.equal(expand('i*2', profile), '<i></i><i></i>');
        assert.equal(expand('i*3', profile), '<i></i>\n<i></i>\n<i></i>');
        assert.equal(expand('i{a}+i{b}', profile), '<i>a</i><i>b</i>');

        assert.equal(expand('img[src]/+p', xhtml), '<img src="" />\n<p></p>');
        assert.equal(expand('div>img[src]/+p', xhtml), '<div>\n\t<img src="" />\n\t<p></p>\n</div>');
        assert.equal(expand('div>p+img[src]/', xhtml), '<div>\n\t<p></p>\n\t<img src="" />\n</div>');
        assert.equal(expand('div>p+img[src]/+p', xhtml), '<div>\n\t<p></p>\n\t<img src="" />\n\t<p></p>\n</div>');
        assert.equal(expand('div>p+img[src]/*2+p', xhtml), '<div>\n\t<p></p>\n\t<img src="" /><img src="" />\n\t<p></p>\n</div>');
        assert.equal(expand('div>p+img[src]/*3+p', xhtml), '<div>\n\t<p></p>\n\t<img src="" />\n\t<img src="" />\n\t<img src="" />\n\t<p></p>\n</div>');
    });

    it('generate fields', () => {
		assert.equal(expand('a[href]', field), '<a href="${1}">${2}</a>');
		assert.equal(expand('a[href]*2', field), '<a href="${1}">${2}</a><a href="${3}">${4}</a>');

		assert.equal(expand('{${0} ${1:foo} ${2:bar}}*2', field), '${1} ${2:foo} ${3:bar}${4} ${5:foo} ${6:bar}');
		assert.equal(expand('{${0} ${1:foo} ${2:bar}}*2'), ' foo bar foo bar');

        assert.equal(expand('ul>li*2', field), '<ul>\n\t<li>${1}</li>\n\t<li>${2}</li>\n</ul>');

		assert.equal(expand('div>img[src]/', field), '<div><img src="${1}"></div>');
	});

	it('mixed content', () => {
        assert.equal(expand('div{foo}'), '<div>foo</div>');
        assert.equal(expand('div>{foo}'), '<div>foo</div>');
        assert.equal(expand('div>{foo}+{bar}'), '<div>foobar</div>');
        assert.equal(expand('div>{foo}+{bar}+p'), '<div>\n\tfoobar\n\t<p></p>\n</div>');
        assert.equal(expand('div>{foo}+{bar}+p+{foo}+{bar}+p'), '<div>\n\tfoobar\n\t<p></p>\n\tfoobar\n\t<p></p>\n</div>');
		assert.equal(expand('div>{foo}+p+{bar}'), '<div>\n\tfoo\n\t<p></p>\n\tbar\n</div>');
		assert.equal(expand('div>{foo}>p'), '<div>\n\tfoo\n\t<p></p>\n</div>');

        assert.equal(expand('div>{<!-- ${0} -->}'), '<div><!--  --></div>');
		assert.equal(expand('div>{<!-- ${0} -->}+p'), '<div>\n\t<!--  -->\n\t<p></p>\n</div>');
		assert.equal(expand('div>p+{<!-- ${0} -->}'), '<div>\n\t<p></p>\n\t<!--  -->\n</div>');
		assert.equal(expand('div>{<!-- ${0} -->}>p'), '<div>\n\t<!-- <p></p> -->\n</div>');
        assert.equal(expand('div>{<!-- ${0} -->}*2>p'), '<div>\n\t<!-- <p></p> -->\n\t<!-- <p></p> -->\n</div>');

		assert.equal(expand('div>{<!-- ${0} -->}>p*2'), '<div>\n\t<!-- \n\t<p></p>\n\t<p></p>\n\t-->\n</div>');
		assert.equal(expand('div>{<!-- ${0} -->}*2>p*2'), '<div>\n\t<!-- \n\t<p></p>\n\t<p></p>\n\t-->\n\t<!-- \n\t<p></p>\n\t<p></p>\n\t-->\n</div>');

        assert.equal(expand('div>{<!-- ${0} -->}>b'), '<div>\n\t<!-- <b></b> -->\n</div>');
        assert.equal(expand('div>{<!-- ${0} -->}>b*2'), '<div>\n\t<!-- <b></b><b></b> -->\n</div>');
        assert.equal(expand('div>{<!-- ${0} -->}>b*3'), '<div>\n\t<!-- \n\t<b></b>\n\t<b></b>\n\t<b></b>\n\t-->\n</div>');

        assert.equal(expand('div>{<!-- ${0} -->}', field), '<div><!-- ${1} --></div>');
        assert.equal(expand('div>{<!-- ${0} -->}>b', field), '<div>\n\t<!-- <b>${1}</b> -->\n</div>');
	});

    it('self-closing', () => {
        const xml   = new Profile({selfClosingStyle: 'xml'});
        const html  = new Profile({selfClosingStyle: 'html'});
        const xhtml = new Profile({selfClosingStyle: 'xhtml'});

        assert.equal(expand('img[src]/', html), '<img src="">');
        assert.equal(expand('img[src]/', xhtml), '<img src="" />');
        assert.equal(expand('img[src]/', xml), '<img src=""/>');

        assert.equal(expand('div>img[src]/', xhtml), '<div><img src="" /></div>');
    });

	it('boolean attributes', () => {
		const compact = new Profile({compactBooleanAttributes: true});
		const noCompact = new Profile({compactBooleanAttributes: false});
		assert.equal(expand('a[b.]', noCompact), '<a b="b"></a>');
		assert.equal(expand('a[b.]', compact), '<a b></a>');
		assert.equal(expand('a[contenteditable]', compact), '<a contenteditable></a>');
		assert.equal(expand('a[contenteditable]', noCompact), '<a contenteditable="contenteditable"></a>');
		assert.equal(expand('a[contenteditable=foo]', compact), '<a contenteditable="foo"></a>');
    });

    it('no formatting', () => {
		const profile = new Profile({format: false});
		assert.equal(expand('div>p', profile), '<div><p></p></div>');
		assert.equal(expand('div>{foo}+p+{bar}', profile), '<div>foo<p></p>bar</div>');
		assert.equal(expand('div>{foo}>p', profile), '<div>foo<p></p></div>');
		assert.equal(expand('div>{<!-- ${0} -->}>p', profile), '<div><!-- <p></p> --></div>');
    });

	it('format specific nodes', () => {
		assert.equal(expand('{<!DOCTYPE html>}+html>(head>meta[charset=${charset}]/+title{${1:Document}})+body', field),
			'<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="charset">\n\t<title>${2:Document}</title>\n</head>\n<body>\n\t${3}\n</body>\n</html>');
	});

	it('comment', () => {
		const options = {comment: {enabled: true}};
		assert.equal(expand('ul>li.item', null, options), '<ul>\n\t<li class="item"></li>\n\t<!-- /.item -->\n</ul>');
		assert.equal(expand('div>ul>li.item#foo', null, options), '<div>\n\t<ul>\n\t\t<li class="item" id="foo"></li>\n\t\t<!-- /#foo.item -->\n\t</ul>\n</div>');

		const options2 = {comment: {
			enabled: true,
			after: ' { [%ID] }'
		}};
		assert.equal(expand('div>ul>li.item#foo', null, options2), '<div>\n\t<ul>\n\t\t<li class="item" id="foo"></li> { %foo }\n\t</ul>\n</div>');
	});
});
