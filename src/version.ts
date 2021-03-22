import { context } from '@actions/github';
import { getInput } from '@actions/core';
import { SemVer } from 'semver';

export class Version {
    private value: SemVer;

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

    public get raw(): string {
        return this.value.raw;
    }

    private parseCommit(): SemVer {
        const shortSha = context.sha.substr(0, 7);
        return new SemVer(`0.0.0+${shortSha}`, {loose: false});
    }
    
    private parseTag(): SemVer {
        const ref = context.ref || '';
        const tagPrefix = 'refs/tags';
        const tagWithVPrefix = 'refs/tags/v';

        if (!ref.startsWith(tagPrefix)) {
            throw new Error('Invalid tag: no tag found');
        }

        if (!ref.startsWith(tagWithVPrefix)) {
            throw new Error('Invalid tag: tag must be prefixed by a v (e.g. v1.0.5)');
        }

        return new SemVer(ref.substr(tagWithVPrefix.length), {loose: false});
    }
}
