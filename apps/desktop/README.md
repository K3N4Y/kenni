# Desktop

A desktop application built with Electron, React, and TypeScript.

Run these commands from the repository root:

```sh
bun install
bun run --cwd apps/desktop dev
```

To check types and build the application:

```sh
bun run --cwd apps/desktop build
```

To package the application, run `bun run --cwd apps/desktop build:linux`,
`build:mac`, or `build:win` for the target platform.
