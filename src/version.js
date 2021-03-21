const github = require('@actions/github');
const core = require('@actions/core');
const semver = require('semver');

module.exports = class Version {
    constructor() {
        const source = core.getInput('source', {required: true});
    
        switch (source) {
            case 'commit':
                return Version.parseCommit();
            case 'tag':
                return Version.parseTag();
            default:
                throw new Error('Invalid first argument (must be "commit" or "tag")')
        }
    }

    static parseCommit() {
        const shortSha = github.context.sha.substr(0, 7);
        return `0.0.0+${shortSha}`;
    }
    
    static parseTag() {
        const match = /^refs\/tags\/v(?<tag>.+)$/.exec(github.context.ref);

        if (!match) {
            throw new Error('Tag not found or not prefixed by a v.');
        }

        const version = semver.valid(match.groups.tag, {loose: false});
    
        if (!version) {
            throw new Error('Tag must be in a valid SemVer format (see semver.org), prefixed by a v (e.g. v1.0.5).');
        }
    
        return version;
    }
}
