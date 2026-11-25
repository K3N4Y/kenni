# Desktop

A desktop application built with Electron, React, TypeScript, and Tailwind CSS.

Run these commands from the repository root:

```sh
bun install
bun run --cwd apps/desktop dev
```

To check types and build the application:

```sh
bun run --cwd apps/desktop build
```

To package the application for the current platform:

```sh
bun run --cwd apps/desktop release
```

Pass a platform flag to `electron-builder` for another target, or `--dir` for an
unpacked build:

```sh
cd apps/desktop
bun x electron-builder --linux
bun x electron-builder --dir
```
