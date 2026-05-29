import { build } from 'esbuild';
import license from 'esbuild-plugin-license';

await build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    target: 'node16',
    format: 'cjs',
    sourcemap: true,
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
