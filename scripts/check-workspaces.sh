#!/bin/sh
set -eu

base=${1:-}
bun run lint:root
bun run typecheck:root

if [ -n "$base" ] && [ "$(git rev-parse --is-shallow-repository)" = false ] &&
  git merge-base --is-ancestor "$base" HEAD 2>/dev/null; then
  printf 'Checking workspaces affected since %s\n' "$base"
  TURBO_SCM_BASE="$base" TURBO_SCM_HEAD=HEAD \
    exec bun run turbo run lint typecheck --affected --continue=dependencies-successful
fi

printf 'Checking all workspaces\n'
exec bun run turbo run lint typecheck --continue=dependencies-successful
