# Jobtrack - Job Application Tracker

A job application tracker built with **React + TypeScript + Vite**. Track every application on a Kanban board, see what you sent each day on a calendar, and keep your daily application streak going.

## Features

- Five pages: Dashboard, Applications (sortable, filterable table), Interviews (upcoming / past), Companies (grouped by company), Settings
- Kanban board: Wishlist, Applied, Interview, Offer, Rejected (drag and drop, or use the select on each card)
- Month calendar showing the day of every application and interview
- "Today" card: did you apply today? Day streak and weekly count
- Add, edit and delete applications; search by company or role
- Data saved in `localStorage` (no backend needed)
- Two themes: Neutral Elegance and Warm Sand (choose in Settings)
- Settings: theme, weekly goal, export / import your data as JSON, clear all
- Keyboard accessible, responsive down to phone width

## TypeScript highlights

- Union types derived from a const array: `type Status = (typeof STATUSES)[number]`
- Discriminated union actions with an exhaustive `useReducer` reducer (`src/state/applications.ts`)
- Generic custom hook `useLocalStorage<T>` with a type guard for stored data
- Generic typed form setter `set<K extends keyof FormState>(key: K, value: FormState[K])`
- `strict` and `noUncheckedIndexedAccess` enabled, no `any`

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

## Project structure

```
src/
  types.ts                 shared types (Status, Application, ...)
  state/applications.ts    reducer, actions, sample data, storage validation
  hooks/useLocalStorage.ts generic persistent state hook
  lib/                     date helpers, stats (streak, weekly count), storage
  components/              Sidebar, StatCards, Calendar, TodayCard, Board, ApplicationCard, ApplicationForm,
                           ApplicationsView, InterviewsView, CompaniesView, SettingsView
```
