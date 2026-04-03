# Tool Knowledge Base

Structured markdown wiki of AI tools, organized by task category. Claude gets the relevant slice as context when generating action plans.

## How it works

1. Each `.md` file in this directory corresponds to a task category from `task-categories.ts`
2. Tools are documented in a consistent markdown format (see below)
3. `scripts/compile-tool-kb.ts` compiles all markdown files into `tool-kb-compiled.json`
4. The compiled JSON is imported by the plan generation prompt builder
5. Claude picks from curated, verified tools instead of hallucinating

## Tool entry format

```markdown
## Tool Name

- **Category**: primary task category slug
- **Also useful for**: comma-separated additional category slugs (optional)
- **Pricing**: Free | Freemium | Paid ($X/mo) | Enterprise
- **URL**: https://...
- **Verified**: YYYY-MM-DD
- **Confidence**: high | medium | low

> One-line pitch: what it does in plain English.

**Best for:** 1-2 sentence description of ideal use case.

**Limitations:** Known constraints, gotchas, or when NOT to use it.
```

## Adding tools

Add entries to the appropriate category file. Run `bun run compile-kb` to rebuild the JSON.

## Health checks

Tools with `Verified` dates older than 90 days should be re-checked. The compile script flags stale entries.
