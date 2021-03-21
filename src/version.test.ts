import { Version } from './version';
import { mocked } from 'ts-jest/utils';
import { getInput } from '@actions/core';
import { context } from '@actions/github';

jest.mock('@actions/core');
const mockedGetInput = mocked(getInput, true);

test('parses commit correctly', () => {
    mockedGetInput.mockReturnValue('commit');
    context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';

    const version = new Version();

    expect(version.value.raw).toEqual('0.0.0+d3a11fc');
});

test('parses tag correctly', () => {
    mockedGetInput.mockReturnValue('tag');
    context.ref = 'refs/tags/v1.2.3';

    const version = new Version();

    expect(version.value.raw).toEqual('1.2.3');
});

test('errors on missing tag', () => {
    mockedGetInput.mockReturnValue('tag');
    context.ref = 'refs/branches/invalid';

    const version = () => new Version();

    expect(version).toThrow('Invalid tag: no tag found');
})

test('errors on missing v-prefix in tag', () => {
    mockedGetInput.mockReturnValue('tag');
    context.ref = 'refs/tags/1.2.3';

    const version = () => new Version();

    expect(version).toThrow('Invalid tag: tag must be prefixed by a v (e.g. v1.0.5)');
});

test('errors on invalid SemVer tag', () => {
    mockedGetInput.mockReturnValue('tag');
    context.ref = 'refs/tags/v1.2';

    const version = () => new Version();

    expect(version).toThrow('Invalid Version: 1.2')
});
