import assert from 'node:assert/strict';
import { beforeEach, mock, test } from 'node:test';

const getInput = mock.fn();
const context = { sha: '', ref: '' as string | null };

mock.module('@actions/core', { namedExports: { getInput } });
mock.module('@actions/github', { namedExports: { context } });

const { Version } = await import('./version.ts');

beforeEach(() => {
    getInput.mock.resetCalls();
    context.sha = '';
    context.ref = '';
});

test('parses commit correctly', () => {
    getInput.mock.mockImplementation(() => 'commit');
    context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';

    const version = new Version();

    assert.equal(version.raw, '0.0.0+d3a11fc');
});

test('parses tag correctly', () => {
    getInput.mock.mockImplementation(() => 'tag');
    context.ref = 'refs/tags/v1.2.3';

    const version = new Version();

    assert.equal(version.raw, '1.2.3');
});

test('errors on missing tag', () => {
    getInput.mock.mockImplementation(() => 'tag');
    context.ref = 'refs/branches/invalid';

    assert.throws(() => new Version(), /Invalid tag: no tag found/);
});

test('errors on missing v-prefix in tag', () => {
    getInput.mock.mockImplementation(() => 'tag');
    context.ref = 'refs/tags/1.2.3';

    assert.throws(
        () => new Version(),
        /Invalid tag: tag must be prefixed by a v \(e\.g\. v1\.0\.5\)/,
    );
});

test('errors on invalid SemVer tag', () => {
    getInput.mock.mockImplementation(() => 'tag');
    context.ref = 'refs/tags/v1.2';

    assert.throws(() => new Version(), /Invalid Version: 1\.2/);
});

test('errors on null ref', () => {
    getInput.mock.mockImplementation(() => 'tag');
    context.ref = null;

    assert.throws(() => new Version(), /Invalid tag: no tag found/);
});
