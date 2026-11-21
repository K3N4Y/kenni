# agent-core

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts [workspace]
```

On first launch, `workspace` must be a directory and defaults to the current working
directory. The root conversation saves its absolute path in `agent.sqlite` next to
`index.ts`. Later launches reuse the saved workspace, regardless of the argument or
current working directory.

To type check:

```bash
bun check
```

This project was created using `bun init` in bun v1.4.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
