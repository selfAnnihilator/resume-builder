# Resume Builder — Build Progression

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## Phase 1 — Scaffold ✓
- [x] `npx create-next-app` with TS + Tailwind + App Router
- [x] Install: `zustand react-to-print`
- [x] Init shadcn/ui
- [x] Create folder structure
- [x] Define `ResumeData` types in `src/types/resume.ts`

## Phase 2 — Data Layer ✓
- [x] Zustand store (`src/lib/store.ts`)
- [x] localStorage persist middleware
- [x] Default/empty resume seed data

## Phase 3 — Editor ✓
- [x] Form components per section (7 sections) in `src/components/editor/`
- [x] Array-field add/remove
- [x] Editor page split layout (`src/app/editor/page.tsx`)

## Phase 4 — Templates ✓
- [x] `src/templates/Modern.tsx`
- [x] `src/templates/Minimal.tsx`
- [x] `src/templates/Professional.tsx`

## Phase 5 — Live Preview + Template Switcher ✓
- [x] Right panel preview in editor
- [x] Template switcher (tabs)
- [x] Real-time Zustand subscription

## Phase 6 — PDF Export ✓
- [x] `useReactToPrint` wired to preview
- [x] Print styles (hide editor UI)
- [x] Filename as `{name}_resume.pdf`

## Phase 7 — Landing Page ✓
- [x] Hero + CTA (`src/app/page.tsx`)
- [x] Template previews

## Phase 8 — Polish ✓
- [x] Mobile layout (tab-switch Edit/Preview, scaled preview)
- [x] Empty states (Experience, Certs show placeholder text when empty)
- [ ] (Stretch) Section reorder

---

## Notes

- `plan.md` = product spec, never overwrite
- `progression.md` = this file, update as phases complete
