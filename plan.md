# Resume Builder Project Plan

## Overview

A modern resume builder for students and freshers.

Focus:

- simplicity
- beautiful templates
- ATS-friendly resumes
- easy exports

No AI required.

The product should help users create professional resumes quickly.

---

# Target Users

- college students
- internship seekers
- freshers
- junior developers

---

# Core Features

## MVP Features

- Create resume
- Multiple sections
- Live preview
- Download PDF
- Multiple templates
- Save locally

---

# Resume Sections

- Personal Information
- Education
- Skills
- Projects
- Experience
- Certifications
- Achievements

---

# Tech Stack

## Frontend

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui

## Storage

Initially:

- localStorage

Later:

- SQLite/Postgres

---

# Pages

## Landing Page

- headline
- templates preview
- CTA

---

## Resume Editor

Split layout:

- left → form editor
- right → live preview

---

## Templates Page

Show:

- modern template
- minimal template
- professional template

---

# Export System

Use:

- react-to-print
- html2pdf

---

# Features To Avoid Initially

- authentication
- AI generation
- collaborative editing
- analytics
- drag-drop builders

---

# Folder Structure

```text
src/
├── app/
├── components/
├── templates/
├── lib/
├── types/
└── utils/
