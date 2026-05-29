import assert from 'node:assert/strict';
import { beforeEach, mock, test } from 'node:test';
import { isDeepStrictEqual } from 'node:util';

const getInput = mock.fn();
const info = mock.fn();
const setOutput = mock.fn();
const setFailed = mock.fn();
const context = { sha: '', ref: '' as string | null };
const readFile = mock.fn(async () => '');
const writeFile = mock.fn(async () => {});

mock.module('@actions/core', {
    namedExports: { getInput, info, setOutput, setFailed },
});
mock.module('@actions/github', { namedExports: { context } });
mock.module('fs/promises', { namedExports: { readFile, writeFile } });

const { default: main } = await import('./index.ts');

const calledWith = (fn: typeof info, ...args: unknown[]) =>
    fn.mock.calls.some((call) => isDeepStrictEqual(call.arguments, args));

beforeEach(() => {
    getInput.mock.resetCalls();
    info.mock.resetCalls();
    setOutput.mock.resetCalls();
    setFailed.mock.resetCalls();
    context.sha = '';
    context.ref = '';
});

test('correctly sets version output', async () => {
    getInput.mock.mockImplementation(() => 'commit');
    context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';

    await main();

    assert.ok(calledWith(info, 'Version is 0.0.0+d3a11fc'));
    assert.ok(calledWith(setOutput, 'version', '0.0.0+d3a11fc'));
});

test('correctly passes errors', async () => {
    getInput.mock.mockImplementation(() => 'tag');
    context.ref = 'refs/tags/invalid';

    await main();

    assert.ok(
        calledWith(
            setFailed,
            'Invalid tag: tag must be prefixed by a v (e.g. v1.0.5)',
        ),
    );
});
