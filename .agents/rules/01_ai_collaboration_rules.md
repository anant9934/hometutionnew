# AI Collaboration Field Guide

*Stop clicking "Allow" blindly. Don't just trust the AI. Trace it.*

This document outlines 15 documentation habits and guidelines for working with AI coding assistants. These principles ensure that AI-assisted coding remains a controllable system rather than a gamble, and **must be followed at all times when building any website or project.**

---

## 01. Core Documentation Files
These five documents form the backbone of any serious AI-assisted workflow. Keep them next to your code, not in your head.

1. **Handover.md (Continuity)**
   - **Action**: Write context incrementally in a file the AI reads at the start of every session. It should be a living record of where things stand: what's done, what's in progress, what's broken, what to avoid.
   - **Why it matters**: Every new AI session starts with amnesia. A handover file is the difference between "re-explain the entire project" and "here's exactly where we left off."

2. **Decisions.md (Rationale)**
   - **Action**: Log every meaningful decision the AI makes while changing your code—and the reasoning behind it (e.g., why this library, why this pattern).
   - **Why it matters**: Code shows what changed. Decisions.md shows why, saving you from re-litigating settled arguments months later.

3. **Explicit Comments (Readability)**
   - **Action**: Require the AI to comment non-obvious logic as it writes it. Explain the flow (what this block is for, what calls into it, assumptions), rather than just restating the code.
   - **Why it matters**: Comments are cheap insurance. They let you or the next AI understand intent without reverse-engineering from scratch.

4. **Flow.md (Traceability)**
   - **Action**: Document how execution actually travels between files, functions, and modules. Know what calls what and in what order.
   - **Why it matters**: Bugs live in the gaps between files. If you can't see the flow, you can't see where it breaks.

5. **Bug.md / Feature.md (Full Trace)**
   - **Action**: Keep one file per bug or feature tracing its lifecycle: how it was found, what was tried, what worked/didn't, and how it was verified.
   - **Why it matters**: Anyone (human or AI) should be able to read this cold and pick up exactly where it left off.

---

## 02. Guardrail Documents
Beyond tracking what happened, these files control what is allowed to happen—*before* the AI touches a line.

6. **Architecture.md (Big Picture)**
   - **Action**: Map out the system at a high level (modules, services, data flow). Focus on the shape of the system, not implementation details.
   - **Why it matters**: Gives the AI the terrain map so it can reason about impact before writing a single line.

7. **Constraints.md (Boundaries)**
   - **Action**: Create a short, explicit list of what the AI *must never do* (e.g., don't touch the payment module, no new dependencies without asking).
   - **Why it matters**: "Allow" should never mean "allow anything." Constraints turn permission into scoped permission.

8. **Test Checklist (Verification)**
   - **Action**: Maintain a concrete list of actual commands and expected outputs to run before any change counts as "done."
   - **Why it matters**: AI claiming success and code actually working are two different facts.

9. **Rollback.md (Safety Net)**
   - **Action**: Plan how to undo a change if it breaks something (which commit to revert to, which files to restore).
   - **Why it matters**: Confidence to make big changes comes from knowing exactly how to reverse them.

---

## 03. Review Discipline
Documents only work if you actually read them. These habits make sure a human stays in the loop.

10. **Read the Diff (Discipline)**
    - **Action**: Never accept a change based on the AI's summary. Read the actual diff line by line, every time.
    - **Why it matters**: Summaries can be wrong or incomplete. Diffs can't lie.

11. **Ask "Why" Before "What" (Plan First)**
    - **Action**: Make the AI explain its plan and approach *before* letting it implement anything.
    - **Why it matters**: Catch bad reasoning while it's still a paragraph, not after it's 200 lines of code.

12. **Small Requests Only (Scope Control)**
    - **Action**: One logical change per request. Break down large asks.
    - **Why it matters**: Large, vague requests produce large, vague diffs that nobody reviews properly.

---

## 04. Meta Habits
The habits that hold the whole system together, session after session.

13. **Session Handoff Summary (Ritual)**
    - **Action**: End every session with a quick note: what we did, what's left, what to watch out for.
    - **Why it matters**: Saves the next session from starting cold. Highest-leverage habit on the list.

14. **Version-Pin Your Context (Traceability)**
    - **Action**: Note which AI model or version made which decision.
    - **Why it matters**: Behavior shifts between versions; you need to know which one reasoned through a given change when debugging later.

15. **Own the Mental Model (The Real Rule)**
    - **Action**: If you can't explain what the code does in your own words, you're not ready to accept it.
    - **Why it matters**: Docs support your understanding, they don't replace it. This is the whole point.

> **Stop Approving. Start Directing.** A blind "Allow" is not a decision. This is.
