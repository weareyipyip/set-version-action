import { info, setFailed, setOutput } from '@actions/core';
import { Version } from './version.ts';
import { VersionFile } from './version-file.ts';

export default async function main(): Promise<void> {
    try {
        const version = new Version();
        const versionFile = new VersionFile();

        setOutput('version', version.raw);
        info(`Version is ${version.raw}`);

        if (versionFile.isSet) {
            await versionFile.replace(version);
        }
    } catch (error: unknown) {
        setFailed((error as Error).message);
    }
}

main();
