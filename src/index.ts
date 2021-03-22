import { Version } from './version';
import { info, setOutput, setFailed } from '@actions/core';

export default async function main(): Promise<void> {
    try {
        const version = new Version();
        info(`Version is ${version.raw}`);
        setOutput('version', version.raw);
    } catch (error) {
        setFailed(error.message);
    }
}

main();
