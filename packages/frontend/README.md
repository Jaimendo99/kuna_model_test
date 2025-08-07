# Therapist Matching SPA Frontend

This is a modern React Single-Page Application built with Vite, TypeScript, and Tailwind CSS for comparing therapist matching models.

## Features

- Modern React SPA with TypeScript
- Vite for fast development and building
- Tailwind CSS + shadcn/ui components for styling
- Zustand for state management
- React Router for navigation
- Progressive questionnaire interface
- Side-by-side model comparison
- Responsive design

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

## API Proxy

The Vite dev server is configured to proxy API requests to http://localhost:8002 where your FastAPI backend should be running.

## Build for Production

```bash
npm run build
```

## User Flow

1. **Welcome Screen**: User enters email to start
2. **Questionnaire**: One question at a time with progress indicator
3. **Results**: Side-by-side comparison of 3 model recommendations
4. **Selection**: User selects best therapist match
5. **Thank You**: Completion confirmation

## Project Structure

```
src/
├── components/
│   └── ui/          # Reusable UI components
├── pages/           # Main page components
├── store/           # Zustand state management
├── lib/
│   ├── api.ts       # API client
│   ├── types.ts     # TypeScript types
│   └── utils.ts     # Utility functions
└── App.tsx          # Main app component
```
