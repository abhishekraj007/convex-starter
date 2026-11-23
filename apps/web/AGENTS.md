<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Before using ui-sdk, follow the ui-sdk skill if installed and read node_modules/@ui-sdk/react/docs/llms.txt. To build a new component, also search node_modules/@ui-sdk/react/docs/core.md by heading and read rendering.md next to it.

## Theme

- All colors are OKLCH tokens in `src/index.css` (`:root` = light, `.dark` = dark); ui-sdk `--ui-*` vars are mapped onto them, and floating surfaces (menus, selects, dialogs, drawers, toasts) use `--popover`.
- Use semantic utilities, never raw palette colors: `bg-primary`, `text-muted-foreground`, `bg-success`/`text-success-foreground` for solid fills, and `bg-success/10 text-success-text` (also `warning`, `info`, `destructive`) for tinted status messages.
- Theme switching is next-themes with the `class` strategy and `system` default; toggle from `resolvedTheme`.
