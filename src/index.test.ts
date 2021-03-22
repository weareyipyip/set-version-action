import main from './index';
import { mocked } from 'ts-jest/utils';
import { context } from '@actions/github';
import { info, getInput, setOutput, setFailed } from '@actions/core';

jest.mock('@actions/core');
const mockedInfo = mocked(info, true);
const mockedGetInput = mocked(getInput, true);
const mockedSetOutput = mocked(setOutput, true);
const mockedSetFailed = mocked(setFailed, true);

test('correctly sets version output', async () => {
    mockedGetInput.mockReturnValue('commit');
    context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';

    await main();

    expect(mockedInfo).toBeCalledWith('Version is 0.0.0+d3a11fc');
    expect(mockedSetOutput).toBeCalledWith('version', '0.0.0+d3a11fc');
});

test('correctly passes errors', async () => {
    mockedGetInput.mockReturnValue('tag');
    context.ref = 'refs/tags/invalid';

    await main();

    expect(mockedSetFailed).toBeCalledWith('Invalid tag: tag must be prefixed by a v (e.g. v1.0.5)');
});
