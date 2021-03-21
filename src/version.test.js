const Version = require('./version');

const github = require('@actions/github');

test('parses sha hash correctly', () => {
    github.context.sha = 'd3a11fc981180bb0e52eff3f3e1e646a55d06120';
    const version = Version.parseCommit();
    expect(version).toEqual('0.0.0+d3a11fc');
});

test('parses tag correctly', () => {
    github.context.ref = 'refs/tags/v1.2.3';
    const version = Version.parseTag();
    expect(version).toEqual('1.2.3');
});

test('errors on missing v-prefix in tag', () => {
    github.context.ref = 'refs/tags/1.2.3';
    expect(Version.parseTag).toThrow('Tag not found or not prefixed by a v.');
});

test('errors on invalid SemVer identifier in tag', () => {
    github.context.ref = 'refs/tags/v1.2';
    expect(Version.parseTag).toThrow('Tag must be in a valid SemVer format (see semver.org), prefixed by a v (e.g. v1.0.5).')
});
