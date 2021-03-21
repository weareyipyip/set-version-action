import { context } from '@actions/github';
import { getInput } from '@actions/core';
import { SemVer } from 'semver';

export class Version {
    value: SemVer;

    constructor() {
        const source = getInput('source', {required: true});

        if (source === 'commit') {
            this.value = this.parseCommit();
        } else if (source === 'tag') {
            this.value = this.parseTag();
        } else {
            throw new Error('Invalid input: source must be commit or tag');
        }
    }

    private parseCommit(): SemVer {
        const shortSha = context.sha.substr(0, 7);
        return new SemVer(`0.0.0+${shortSha}`, {loose: false});
    }
    
    private parseTag(): SemVer {
        if (!context.ref.startsWith('refs/tags')) {
            throw new Error('Invalid tag: no tag found');
        }

        if (!context.ref.startsWith('refs/tags/v')) {
            throw new Error('Invalid tag: tag must be prefixed by a v (e.g. v1.0.5)');
        }

        return new SemVer(context.ref.substr(11), {loose: false});
    }
}
