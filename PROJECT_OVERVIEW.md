# AGENT_MD_V2 — Complete Project Overview

**Last Updated:** May 2, 2026

---

## 📋 What is AGENT_MD_V2?

AGENT_MD_V2 is a **structured documentation framework** designed to enable AI coding agents (Claude, Cursor, ChatGPT, Gemini, etc.) to develop software in a disciplined, traceable, and maintainable way. It provides templates, conventions, and workflows that bridge the gap between human intent and AI execution.

---

## 🎯 Purpose & Value

This framework solves three key problems:

1. **Specification Drift** — AI agents have no clear, evolving specification to follow
2. **Loss of Context** — Plans and work products disappear; there's no audit trail
3. **Miscommunication** — No standardized format means agents re-interpret requirements differently each session

By using AGENT_MD_V2, you get:
- ✅ A **living specification** that evolves with the project
- ✅ **Numbered plans and reports** that create an audit trail of work
- ✅ **Current state snapshots** that help reconcile spec vs. reality
- ✅ **Authoring rules** that any AI agent can follow consistently

---

## 📁 Folder Structure & Contents

```
AGENT_MD_V2/
├── README.md                              # Main usage guide
├── PROJECT_OVERVIEW.md                    # This file — full overview of the framework
├── spec_init.md                           # AI-guided interview to generate your project spec
├── spec.md                                # Master project specification (YOUR project's blueprint)
├── reconciliation-001.md                  # Gap analysis: compares spec vs. actual state
│
├── examples/                              # Learning materials (DELETE before shipping)
│   ├── README.md                          # Index of example documents
│   ├── spec_example.md                    # Complete example spec (TaskFlow API project)
│   ├── current_state_example.md           # Example current state report
│   ├── reconciliation_example.md          # Example reconciliation report
│   ├── plans/
│   │   └── PLAN-001_example.md            # Example plan document
│   └── reports/
│       └── REPORT-001_example.md          # Example report document
│
└── plan/                                  # YOUR working documents (non-template)
    ├── rules.md                           # Authoring conventions for plans & reports
    ├── current_state_report.md            # Living snapshot of your real codebase
    ├── plans/
    │   └── PLAN-000_template.md           # Template — copy & rename to create new plans
    └── reports/
        ├── README.md                      # Index of all reports
        └── REPORT-000_template.md         # Template — copy & rename when closing a plan
```

---

## 🚀 Quick Start Guide

### Step 1: Understand the Framework (5 minutes)
- Read [README.md](README.md) — This is your user manual
- Skim [rules.md](plan/rules.md) — Understand the authoring conventions

### Step 2: Generate Your Project Specification
You have two options:

**Option A: AI-Assisted Generation (Recommended)**
- Copy this into an AI chat (ChatGPT, Claude, Cursor, etc.):
  ```
  Follow AGENT_MD_V2/spec_init.md. My project is: [paste your project idea here]
  ```
- The AI will guide you through an interview and generate `spec.md`

**Option B: Manual Generation**
- Open `spec.md`
- Fill in all sections manually (takes 30–60 minutes)

### Step 3: Learn by Example
- Open `examples/spec_example.md` to see a completed specification
- Open `examples/PLAN-001_example.md` and `examples/REPORT-001_example.md` for workflow examples
- Study the format and tone

### Step 4: Delete Examples & Start Working
- Delete the `examples/` folder when you're ready (it's for learning only)
- Create your first plan: copy `plan/PLAN-000_template.md` → `plan/plans/PLAN-001_my_first_plan.md`
- When you complete a plan, create a matching report: `plan/reports/REPORT-001_my_first_report.md`

### Step 5: Keep Your Spec & State in Sync
- After each major working session, the AI agent updates:
  - `spec.md` — Current Focus section + Decision Log + Codebase Inventory
  - `plan/current_state_report.md` — Reflects what's actually in your code
- Create reconciliation reports periodically to identify gaps between spec and reality

---

## 📄 Key Documents Explained

### `spec.md` — Your Master Blueprint
- **What it is:** A living specification of your project — the single source of truth
- **Who fills it in:** You (initially), then AI agents (as work progresses)
- **Why it matters:** All plans and work branch from this spec. If the spec isn't clear, nothing else will be.
- **Updated:** After every major work session; agents add to Decision Log, Codebase Inventory, and Current Focus

### `plan/plans/PLAN-*.md` — Forward-Looking Plans
- **What it is:** "Here's what we're going to do next"
- **Format:** Structured markdown following [rules.md](plan/rules.md)
- **Lifecycle:** Create → Discuss → Execute → Close (by matching REPORT)
- **Numbering:** Start at 001 (000 is reserved for templates)

### `plan/reports/REPORT-*.md` — Backward-Looking Work Logs
- **What it is:** "Here's what we actually did and what we learned"
- **Format:** Matches the PLAN's ID (PLAN-001 closes with REPORT-001)
- **Content:** What was built, what broke, what changed, links to commits/PRs
- **Numbering:** Must match the corresponding PLAN ID

### `plan/current_state_report.md` — Living Codebase Snapshot
- **What it is:** "Here's what currently exists in the repo — both code and docs"
- **Purpose:** Helps reconcile spec (what we want) vs. reality (what we have)
- **Frequency:** Updated after major work sessions
- **Read-Only (mostly):** Only change this when reflecting what's actually in the codebase

### `reconciliation-*.md` — Gap Analysis
- **What it is:** "What's the delta between our spec and our actual codebase?"
- **When to create:** After major work; when teams get out of sync; quarterly reviews
- **Purpose:** Identify drift, repriorize, and course-correct
- **Format:** Compares spec sections to current state, highlights misalignments

---

## 🔄 The Workflow

### A Single Work Cycle

1. **Start of session:** AI agent reads `spec.md` and `current_state_report.md`
2. **Create a plan:** Copy `PLAN-000_template.md` → `plans/PLAN-XXX_my_plan.md`
   - Define what will be built
   - Link to relevant spec sections
   - Set success criteria
3. **Execute:** Build/code/test following the plan
4. **Close the plan:** Create matching `reports/REPORT-XXX_my_report.md`
   - What was built
   - What changed
   - Links to commits/PRs
   - Lessons learned
5. **Update state:** Edit `spec.md` and `current_state_report.md` to reflect reality

### Longer-Term (Monthly/Quarterly)

- Create reconciliation report (`reconciliation-002.md`, etc.)
- Compare spec vs. current state
- Identify what drifted and why
- Decide: update spec, update code, or accept drift

---

## 🎓 Learning Resources

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | Main user guide | Everyone |
| [rules.md](plan/rules.md) | Writing conventions | Plan/Report authors |
| [spec_init.md](spec_init.md) | Spec generation interview | Project owners |
| [examples/README.md](examples/README.md) | Index of examples | Learners |
| [examples/spec_example.md](examples/spec_example.md) | Example spec (TaskFlow API) | Visual learners |
| [examples/PLAN-001_example.md](examples/plans/PLAN-001_example.md) | Example plan | Process learners |
| [examples/REPORT-001_example.md](examples/reports/REPORT-001_example.md) | Example report | Process learners |

---

## ✅ Checklist: First Time Setup

- [ ] Read [README.md](README.md)
- [ ] Skim [rules.md](plan/rules.md)
- [ ] Read through `examples/` folder to understand the format
- [ ] Run `spec_init.md` (or manually fill in `spec.md`)
- [ ] Delete `examples/` folder
- [ ] Create `plan/plans/PLAN-001_initial_setup.md`
- [ ] Commit to git with message: "Initial AGENT_MD_V2 setup"
- [ ] Share the repo with your team

---

## 🛠️ Best Practices

1. **Keep Spec Updated** — Stale specs cause confusion. Update after every major change.
2. **Plan Before Coding** — Always create a PLAN before starting work.
3. **Close Plans with Reports** — Every PLAN should have a matching REPORT; don't leave orphans.
4. **Reconcile Regularly** — Compare spec vs. reality monthly to catch drift early.
5. **Use Git** — Commit frequently; link commits in PLAN and REPORT documents.
6. **AI Agents Read These Docs** — Write clearly. What's unclear to humans is chaos to AI.

---

## 📞 Support & Customization

**This is a template framework.** Customize it for your project:
- Rename sections in `spec.md`
- Adjust `rules.md` to match your team's style
- Add your own sections as needed
- Delete what doesn't apply

The core principle remains: **specification → plan → execution → report → reconcile**.

---

## 🎯 TL;DR

**AGENT_MD_V2** is a **documentation system** that helps AI agents and humans collaborate on software projects. You provide:
1. A clear **spec** (what to build)
2. **Plans** (before starting work)
3. **Reports** (after finishing work)
4. Regular **reconciliation** (spec vs. reality)

AI agents use these documents to stay aligned, traceable, and productive. Delete the `examples/` folder when you're ready to ship.

---

**Maintained by:** AGENT_MD_V2 Framework  
**License:** Use freely in your projects  
**Last Updated:** May 2, 2026
