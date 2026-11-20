# CI and the pre-push hook

## Install the dependencies

Use the Bun version specified in `package.json`.
Run this command from the root of the monorepo:

```sh
bun install --frozen-lockfile
```

Husky enables the `pre-push` hook when you install the dependencies in each clone.
GitHub Actions sets `HUSKY=0` during installation.
GitHub Actions runs the checks directly and does not push commits.

## Run the checks

- Run `bun run format:check` to check the format of the repository files.
- Run `bun run check` to run lint and type checks at the root and in all workspaces.
- Run `bun run check <base>` to run the root checks and use `turbo --affected` to select workspaces. Turbo checks all workspaces if the clone is shallow or if the base is not an available ancestor of `HEAD`.

## Push branch updates

Git sends the branch updates to the `pre-push` hook.
The hook uses the current commit of the remote branch as the base.
It does not fetch commits.

The hook checks all workspaces for a new branch.
It also checks all workspaces if the branches in one push have different base commits.
The hook ignores tags and deletions.

Make sure that the commit to push is `HEAD` and that the working tree is clean.
To push a different branch, first check out that branch.

## GitHub Actions

GitHub Actions runs the **Format** and **Lint and typecheck** jobs in parallel.
For a pull request, **Lint and typecheck** compares the merge commit with the base commit of the pull request.
This job uses a clone with full history and downloads file contents only when necessary.
For a push to `main`, the job checks all workspaces.

GitHub Actions uses separate caches for Bun package downloads and Turbo task results.
It does not cache `node_modules`.

After you publish the repository on GitHub, set **Format** and **Lint and typecheck** as required checks for `main`.
This prevents merges if a required check fails.
