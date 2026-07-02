# Feedback Log

Human feedback on agent research decisions, collected per CLAUDE.md's learning
loop. When 3+ entries show a similar pattern, promote the pattern to the
**Learned Preferences** section of CLAUDE.md and note the promotion here.

Format per entry:

```
## YYYY-MM-DD — [context: session/skill/topic]
- DECISION: [what the human decided]
- REASON: [why, in the human's words if possible]
- PATTERN?: [does this rhyme with earlier entries — cite dates]
```

Append-only. Never rewrite or delete existing entries.

---

## Open questions awaiting human decision

Carried here so they don't get lost between sessions; move to a dated entry
once decided.

1. **goldman-productivity-growth-forecast-2026 has no public URL.** The
   client-only Goldman US Daily note (May 5, 2026) has no public link or
   verified secondary coverage after four search attempts. Options: (a) keep
   with empty URL and this note, (b) remove the source and its data points,
   (c) someone with GS Research access supplies the gspublishing.com link.
2. **workforce-ai-exposure has 3 tied points on 2026-01-15** (values 49, 93,
   67) with `aggregationMethod: "latest"` — currentValue (67) is
   order-dependent. Options: (a) pick one authoritative estimate, (b) switch
   the graph to weighted aggregation, (c) differentiate the dates.
3. **48 orphan sources** in confirmed-sources.json are verified but feed no
   graph. Run `/review-queue` to disposition them (wire in, archive, or keep
   as context-only).

---

<!-- Dated entries begin here -->
