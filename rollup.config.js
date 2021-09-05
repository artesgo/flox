import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sveld from 'sveld';

export default ['es', 'umd'].map((format) => {
	const UMD = format === 'umd';
	return {
		input: 'src',
		inlineDynamicImports: true,
		output: {
			format,
			file: UMD ? pkg.main : pkg.module,
			name: UMD ? "artesgo-flox" : undefined,
		},
		plugins: [
			svelte({
				include: 'src/**/*.svelte',
				emitCss: false
			}),
			resolve(),
			commonjs(),
			UMD && terser(),
			UMD && sveld({
				glob: true,
				markdown: true,
				markdownOptions: {
					onAppend: (type, document, component) => {
						if (type === "h1") {
							"quote",
							`${component.size} components exported from ${pkg.name}@${pkg.version}.`
						}
					}
				},
				json: true,
				jsonOptions: {
					outFile: "docs/src/COMPONENT_API.json"
				}
			})
		]
	}
});
