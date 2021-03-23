import { Version } from './version';
import { mocked } from 'ts-jest/utils';
import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { VersionFile } from './version-file';
import { readFile, writeFile } from 'fs/promises';

jest.mock('@actions/core');
const mockedGetInput = mocked(getInput, true);

jest.mock('fs/promises');
const mockedReadFile = mocked(readFile, true);
const mockedWriteFile = mocked(writeFile, true);

mockedReadFile.mockResolvedValue('The version is 0.0.0+development for this string');
mockedWriteFile.mockResolvedValue();

test('marks isSet as true if file path is set', () => {
    mockedGetInput.mockImplementation(name => {
        switch(name) {
            case 'file_path':
                return '/package.json';
            case 'version_placeholder':
                return '0.0.0+development';
        }
    });

    const versionFile = new VersionFile();

    expect(versionFile.isSet).toEqual(true);
});

test('marks isSet as false if file path is not set', () => {
    mockedGetInput.mockImplementation(name => {
        switch(name) {
            case 'file_path':
                return null;
            case 'version_placeholder':
                return '0.0.0+development';
        }
    });

    const versionFile = new VersionFile();

    expect(versionFile.isSet).toEqual(false);
});

test('correctly replaces version placeholder in file', async () => {
    context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';
    mockedGetInput.mockImplementation(name => {
        switch(name) {
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

    expect(mockedWriteFile).toBeCalledWith('package.json', 'The version is 0.0.0+d3a11fc for this string', {encoding: 'utf-8'});
});
