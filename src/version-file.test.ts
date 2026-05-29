import assert from 'node:assert/strict';
import { beforeEach, mock, test } from 'node:test';
import { isDeepStrictEqual } from 'node:util';

const getInput = mock.fn();
const context = { sha: '', ref: '' as string | null };
const readFile = mock.fn(
    async () => 'The version is 0.0.0+development for this string',
);
const writeFile = mock.fn(async () => {});

mock.module('@actions/core', { namedExports: { getInput } });
mock.module('@actions/github', { namedExports: { context } });
mock.module('fs/promises', { namedExports: { readFile, writeFile } });

const { Version } = await import('./version.ts');
const { VersionFile } = await import('./version-file.ts');

beforeEach(() => {
    getInput.mock.resetCalls();
    writeFile.mock.resetCalls();
    readFile.mock.resetCalls();
    context.sha = '';
    context.ref = '';
});

test('marks isSet as true if file path is set', () => {
    getInput.mock.mockImplementation((name: string) => {
        switch (name) {
            case 'file_path':
                return '/package.json';
            case 'version_placeholder':
                return '0.0.0+development';
        }
    });

    const versionFile = new VersionFile();

    assert.equal(versionFile.isSet, true);
});

test('marks isSet as false if file path is not set', () => {
    getInput.mock.mockImplementation((name: string) => {
        switch (name) {
            case 'file_path':
                return null;
            case 'version_placeholder':
                return '0.0.0+development';
        }
    });

    const versionFile = new VersionFile();

    assert.equal(versionFile.isSet, false);
});

test('correctly replaces version placeholder in file', async () => {
    context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';
    getInput.mock.mockImplementation((name: string) => {
        switch (name) {
            case 'source':
                return 'commit';
            case 'file_path':
                return 'package.json';
            case 'version_placeholder':
                return '0.0.0+development';
        }
    });

    const version = new Version();
    const versionFile = new VersionFile();
    await versionFile.replace(version);

    assert.ok(
        writeFile.mock.calls.some((call) =>
            isDeepStrictEqual(call.arguments, [
                'package.json',
                'The version is 0.0.0+d3a11fc for this string',
                { encoding: 'utf-8' },
            ]),
        ),
    );
});
