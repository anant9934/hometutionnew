# Decisions (Rationale)

Logs every meaningful decision the AI makes while changing code, and the reasoning behind it (e.g., tech stack choices, patterns).

| Date | Component/Area | Decision Made | Rationale/Why? |
|---|---|---|---|
| 2026-09-06 | Documentation | Initialize `docs/` folder with MD files. | To strictly comply with the user's mandate and the `.agents/rules/01_ai_collaboration_rules.md` requiring traceability and continuity. |
| 2026-09-06 | Environment Setup | Created `.env` file for NeonDB and Cloudinary API Keys. | User explicitly provided secrets. We store them in `.env` to keep sensitive credentials secure and separated from code. |
| 2026-09-06 | Version Control | Created `.gitignore` before `git init` and `git push`. | To proactively prevent the newly created `.env` file (containing database and API secrets) from being committed and leaked to GitHub. |
