#!/bin/bash

exit_error() {
  echo "$1" 1>&2
  exit 1
}

parse_tag() {
  # Based on the official RegEx on semver.org with the following changes:
  # * Added v-prefix
  # * Removed named capture groups (not supported by Bash)
  # * Removed non-capturing groups (not supported by Bash)
  # * Replaced \d by [0-9] (not supported by Bash)
  if [[ "$1" =~ ^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-((0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$ ]]; then
    echo -n "${1:1}"
  else
    exit_error "Tag must be in a valid SemVer format (see semver.org) prefixed by a v (e.g. v1.0.5)"
  fi
}

get_version() {
  case "$1" in
    "commit")
      SHORT_SHA="$(git rev-parse --short "$GITHUB_SHA")" || exit 1
      echo -n "0.0.0+$SHORT_SHA"
      ;;
    "tag")
      TAG="${GITHUB_REF#refs/*/}"
      VERSION="$(parse_tag "$TAG")" || exit 1
      echo -n "$VERSION"
      ;;
    *)
      exit_error "Invalid first argument (must be 'commit' or 'tag')"
      ;;
  esac
}

# $1 - source
# $2 - file_path
# $3 - version_placeholder

VERSION="$(get_version "$1")" || exit 1
echo "Version is $VERSION"

if [[ "$2" && "$3" ]]; then
  echo "Replacing $3 by $VERSION in $2..."
  sed -i "s/$3/$VERSION/g" "$GITHUB_WORKSPACE/$2"
fi

echo "::set-output name=version::$VERSION"
