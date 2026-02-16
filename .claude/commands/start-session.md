starting a new session. do the following in parallel where possible:

1. **check git state** -- run `git status` and `git log --oneline -5` (no TODO scan needed unless user requests it)
2. **read docs/DEVLOG.md** -- find the latest phase and current status

then provide a **short bullet-point summary** covering:
- where we left off (last phase + status from DEVLOG.md)
- what needs testing or is blocked
- suggested next steps (from CLAUDE.md priorities)

rules:
- CLAUDE.md is already loaded in context -- do NOT re-read or re-summarize its full contents
- only call out CLAUDE.md rules if they're directly relevant to the current status
- keep the summary under 20 lines
- all future work must follow CLAUDE.md to avoid repeating mistakes

if the user provided context with this command, prioritize that.

$ARGUMENTS
