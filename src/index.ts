import { Version } from './version';
import { VersionFile } from './version-file';
import { info, setOutput, setFailed } from '@actions/core';

export default async function main(): Promise<void> {
    try {
        const version = new Version();
        const versionFile = new VersionFile();

        setOutput('version', version.raw);
        info(`Version is ${version.raw}`);

        if (versionFile.isSet) {
            await versionFile.replace(version);
        }
    } catch (error) {
        setFailed(error.message);
    }
}

main();
