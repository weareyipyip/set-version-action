import { build } from 'esbuild';
import license from 'esbuild-plugin-license';

await build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    target: 'node16',
    format: 'esm',
    sourcemap: true,
    // Bundled CJS deps (e.g. tunnel) use dynamic require(); provide a real one
    // for the ESM output so they resolve at runtime instead of throwing.
    banner: {
        js: "import { createRequire as __cr } from 'node:module';\nconst require = __cr(import.meta.url);",
    },
    plugins: [
        license({
            thirdParty: {
                includePrivate: false,
                output: {
                    file: 'dist/licenses.txt',
                    template(dependencies) {
                        return dependencies
                            .map((dependency) => {
                                const { name, license } =
                                    dependency.packageJson;
                                return `${name}\n${license ?? ''}\n${dependency.licenseText ?? ''}`;
                            })
                            .join('\n\n');
                    },
                },
            },
        }),
    ],
});
