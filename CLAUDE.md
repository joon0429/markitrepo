# CLAUDE.md - Project Context & Design System

> This file is automatically read by Claude Code at the start of every conversation.
> Last updated: [DATE]

---

## How to Use This Document

### Prompting Techniques

| Syntax | Purpose | Example |
|--------|---------|---------|
| `**bold text**` | Emphasize critical constraints | `**Never use inline styles**` |
| `[PLACEHOLDER]` | Indicate variables/options | `Create a [component-name] component` |
| `MUST` / `NEVER` / `ALWAYS` | Trigger strict adherence | `MUST use TypeScript for all new files` |
| `@update-claude-md` | Ask Claude to update this doc | `@update-claude-md add our button pattern decision` |
| `@design-check` | Ask Claude to verify against design principles | `@design-check does this follow our swipe patterns?` |
| `@explain-decision` | Ask Claude to explain reasoning with design context | `@explain-decision why this approach?` |

### Quick Commands

- `"save this to claude.md"` - Add current decision/pattern to this document
- `"what does claude.md say about [topic]?"` - Query specific guidance
- `"review claude.md"` - Get a summary of current principles/constraints

---

## Project Overview

**Project Name:** [Your Project Name]
**Type:** [Mobile App / Web App / etc.]
**Tech Stack:** [To be filled in]

---

## Design Principles (HCI Fundamentals)

### Interaction Patterns
<!-- Add your preferred interaction patterns here -->

- [ ] Swipe patterns: [describe preferences]
- [ ] Touch targets: [minimum sizes, spacing]
- [ ] Gesture behaviors: [long press, pinch, etc.]

### Visual Design
<!-- Add your visual design rules here -->

- [ ] Typography: [font choices, hierarchy]
- [ ] Color system: [palette, accessibility requirements]
- [ ] Spacing system: [grid, margins, padding conventions]

### Feedback & Affordances

- [ ] Loading states: [skeleton, spinner, etc.]
- [ ] Error handling: [toast, inline, modal]
- [ ] Success feedback: [animation, message style]

---

## Technical Decisions

### Architecture Patterns
<!-- Document architectural choices made during development -->

| Decision | Choice | Reasoning | Date |
|----------|--------|-----------|------|
| [Example] | [Choice] | [Why] | [When] |

### Code Conventions

- File naming: [convention]
- Component structure: [pattern]
- State management: [approach]

---

## Lessons Learned (Do NOT Repeat)

<!-- Claude: Add issues we've fixed here so you don't reintroduce them -->

| Issue | What Went Wrong | Correct Approach | Date |
|-------|-----------------|------------------|------|
| | | | |

---

## Reminders for Claude

1. **Before writing code:** Check if this document has relevant patterns/decisions
2. **After making decisions:** Offer to update this document
3. **When uncertain:** Ask rather than assume - reference this doc for established patterns
4. **At session end:** Prompt user: "Should I update CLAUDE.md with today's decisions?"

---

## Session Log

<!-- Optional: Track major decisions by session -->

### [DATE] - Session Notes
-

