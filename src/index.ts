import { Version } from './version';
import { info, setOutput, setFailed } from '@actions/core';

export default async function main() {
    try {
        const version = new Version();
        info(`Version is ${version.value.raw}`);
        setOutput('version', version.value.raw);
    } catch (error) {
        setFailed(error.message);
    }
}

main();
