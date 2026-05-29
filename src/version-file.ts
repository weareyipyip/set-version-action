import { readFile, writeFile } from 'node:fs/promises';
import { getInput } from '@actions/core';
import type { Version } from './version.ts';

export class VersionFile {
    private path: string;
    private placeholder: string;

    constructor() {
        this.path = getInput('file_path');
        this.placeholder = getInput('version_placeholder');
    }

    get isSet(): boolean {
        return !!this.path;
    }

    async replace(version: Version): Promise<void> {
        const contents = await readFile(this.path, { encoding: 'utf-8' });
        const newContents = contents.replace(this.placeholder, version.raw);
        await writeFile(this.path, newContents, { encoding: 'utf-8' });
    }
}
