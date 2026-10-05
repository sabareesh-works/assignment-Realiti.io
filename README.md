# Task Board

A simple task management board with three sections — **To Do / In Progress / Done** — built for the frontend screening assignment.

## Tech

- Next.js 14 (App Router, static export)
- Tailwind CSS (light + dark theme)
- @hello-pangea/dnd for drag & drop
- lucide-react for icons
- Inter font

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What it does

- Header + board + footer on one page
- Add task (title required) → goes to To Do
- Drag cards by the grip handle, or move via arrows / edit dialog status
- Tap a card to open its full task view (details, status, attachments)
- Attach files and images to tasks (stored in the browser)
- Edit / delete from the card, the dialog, or the task view
- Search filters by title / description / id
- First-run guided tour with skip + replay
- Saves to `localStorage`, survives refresh
- Empty states for empty board / empty column
- Responsive: stacked sections on mobile, 3 columns on desktop
