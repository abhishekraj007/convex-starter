# Agent Instructions

## Core Principles

1. **Read before editing** - Always read and understand relevant files before making changes. Never speculate about code you have not inspected.
2. **Minimal changes** - Only make changes that are directly requested. Keep solutions simple and focused.
3. **Security first** - Ensure all code is secure and not vulnerable to attacks.
4. **No unnecessary files** - Never create markdown or documentation files unless explicitly requested for major features.

## Code Architecture

### Separation of Concerns

- Separate UI and logic into **components** and **hooks**
- Keep files short and maintainable; split into multiple files when needed
- Avoid `useCallback` unless there is a clear performance need

### Styling Requirements

- All layouts must work in both **light and dark mode**
- Design **mobile-first**, then add responsive breakpoints
- Use Tailwind CSS for styling

## Skills

**ALWAYS check relevant skills before starting any related task:**

- For React Native/Expo UI work: check `building-native-ui`, `vercel-react-native-skills`
- For Convex backend work: check `convex` (index skill that routes to sub-skills like convex-functions, convex-schema-validator, convex-agents, convex-best-practices, etc.)
- For React/Next.js web development: check `vercel-react-best-practices`
- For web UI design, accessibility, and UX audits: check `web-design-guidelines`
- For building visually polished web interfaces, landing pages, or dashboards: check `frontend-design`
- For upgrading Expo SDK or fixing dependency issues: check `upgrading-expo`
- Skills are located in `.agent/skills/` - read the SKILL.md file for each relevant skill before implementing

## Component Libraries

### Web Development (`/apps/web`)

1. **Check HeroUI React MCP first** - Use `mcp3_list_components` and `mcp3_get_component_info` before implementing any component
2. **Use shadcn/ui** - Install via CLI: `pnpm dlx shadcn@latest add <component>`
3. **MagicUI for animations** - Use `mcp0_getAnimations`, `mcp0_getComponents` etc. for subtle animations from magicui.design

### Native Development (`/apps/native`)

1. **Check HeroUI Native MCP first** - Use `mcp2_list_components` before using native React Native components
2. **Prefer HeroUI Native** - Use Button over Pressable, TextField over TextInput, etc.
3. **Use expo-image** for all images with:
   - `cachePolicy="memory-disk"`
   - `contentFit="cover"`
   - `transition` for smooth loading

## Backend (Convex)

- Use **Convex MCP** (`mcp0_status`, `mcp0_tables`, `mcp0_functionSpec`) to understand the current schema
- For complex issues, use **Exa MCP** (`mcp1_get_code_context_exa`) to search latest Convex documentation
- Follow existing patterns in `/packages/backend/convex`

## Response Guidelines

- No emojis in responses
- Be concise and direct
- Provide code, not explanations unless asked
