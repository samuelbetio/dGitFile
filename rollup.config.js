const destName = process.env.DEST_NAME || 'markup-formatters';

export default {
	external: ['@emmetio/field-parser', '@emmetio/output-renderer'],
	exports: 'named',
	targets: [
		{format: 'cjs', dest: `dist/${destName}.cjs.js`},
		{format: 'es',  dest: `dist/${destName}.es.js`}
	]
};
