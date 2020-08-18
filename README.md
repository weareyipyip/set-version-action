# Set version action

This action sets the version based on either the current commit hash or tag.
The result can either be stored in the action's output or be written to a file directly.

**Note:** Tags **MUST** be in one of the following formats or this action will fail: `vMAJOR.MINOR.PATCH` or `vMAJOR.MINOR.PATCH-identifier`.

## Inputs

### `target`

**Required** Target for the version, either output or file. Default `"output"`.

### `source`

**Required** Source for the version, either commit or tag. Default `"commit"`.

### `file_path`

File path in case of file target, relative to the workspace.

### `version_placeholder`

Version placeholder to replace in case of file target. Default `"0.0.0+development"`.

## Outputs

### `version`

The current version

## Example usage

### Build a Docker image using the current Git tag

This example uses the version variable directly in the `docker build` command.

```yaml
jobs:
  build:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Set version
      uses: weareyipyip/set-version-action@v1
      id: set-version
      with:
        target: output
        source: tag
    - name: Build Docker image
      run: 'docker build -t some-image:${{ steps.set-version.outputs.version }}'
```

### Build a Node package using the current Git tag

This example directly replaces the version placeholder in `package.json` with the parsed version.

```yaml
jobs:
  build:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Set version
      uses: weareyipyip/set-version-action@v1
      id: set-version
      with:
        target: file
        source: tag
        file_path: package.json
    - name: Build Node package
      run: 'npm build'
```

### Build a Node package using the current Git commit

This example directly replaces the version placeholder in `package.json` with the parsed version.
The commit hash can be used for builds that aren't tagged, e.g. automated test builds.

```yaml
jobs:
  build:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Set version
      uses: weareyipyip/set-version-action@v1
      id: set-version
      with:
        target: file
        source: commit
        file_path: package.json
    - name: Build Node package
      run: 'npm build'
```
