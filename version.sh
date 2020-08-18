#!/bin/bash

exit_error() {
  echo "$1" 1>&2
  exit 1
}

parse_tag() {
  if [[ "$1" =~ ^v[0-9]\.[0-9]\.[0-9](-[0-9A-Za-z\.]+)?$ ]]; then
    echo -n "${1:1}"
  else
    exit_error "Tag must be in format 'vMAJOR.MINOR.PATCH' or 'vMAJOR.MINOR.PATCH-identifier'"
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
      exit_error "Invalid second argument (must be 'commit' or 'tag')"
      ;;
  esac
}

VERSION="$(get_version "$1")" || exit 1

if [[ "$2" && "$3" ]]; then
  sed -i "s/$3/$VERSION/g" "$GITHUB_WORKSPACE/$2"
fi

echo "::set-output name=version::$VERSION"
