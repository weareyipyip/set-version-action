const Version = require('./version');

const core = require('@actions/core');

async function run() {
    try {
        const version = new Version();
        core.info(`Version is ${version}`);
        core.setOutput('version', version);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
