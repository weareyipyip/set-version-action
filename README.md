# Set version action

This action sets the version based on either the current commit hash or tag.
The result can optionally be written to a file directly.

**Note:** Tags **MUST** be in one of the following formats or this action will fail: `vMAJOR.MINOR.PATCH` or `vMAJOR.MINOR.PATCH-identifier`.

## Inputs

### `source`

**Required** Source for the version, either `commit` or `tag`. Default `commit`.

### `file_path`

File path to write the version to, relative to the workspace.

### `version_placeholder`

Version placeholder to replace with the version if `file_path` is set. Default `0.0.0+development`.

## Outputs

### `version`

The version.

## Example usage

### Build a Docker image using the current Git tag

This example uses the version variable directly in the `docker build` command.

```yaml
jobs:
  build:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Set version
      uses: weareyipyip/set-version-action@v2
      id: set-version
      with:
        source: tag
    - name: Build Docker image
      run: 'docker build -t some-image:${{ steps.set-version.outputs.version }}'
```

### Build a Node package using the current Git tag

This example directly replaces the version placeholder in `package.json` with the parsed version. The string `0.0.0+development` will be replaced in the specified `target_file` by default.

```yaml
jobs:
  build:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Set version
      uses: weareyipyip/set-version-action@v2
      with:
        source: tag
        file_path: package.json
    - name: Build Node package
      run: 'npm build'
```

### Build a Node package using the current Git commit

This example directly replaces the version placeholder in `package.json` with the parsed version. The string `0.0.0+development` will be replaced in the specified `target_file` by default. The commit hash can be used for builds that aren't tagged, e.g. automated test builds.

```yaml
jobs:
  build:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Set version
      uses: weareyipyip/set-version-action@v2
      with:
        source: commit
        file_path: package.json
    - name: Build Node package
      run: 'npm build'
```
