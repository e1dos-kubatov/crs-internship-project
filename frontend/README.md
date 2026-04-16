# Car Rental Bishkek

Professional car rental website for Bishkek and Kyrgyzstan.

## Features

- Multi-language (EN/RU/KG)
- Dynamic booking form w/ price calculation
- Car catalog with filters, search, favorites
- Car details page
- Contact/FAQ/Offices pages
- Admin panel
- Responsive mobile-first design
- TailwindCSS, React Router, Context API

## Tech Stack

- React 19
- Vite
- TailwindCSS
- React Router DOM
- Axios (API ready)

## Installation

```bash
npm install
npm run dev
```

## Usage

- Home: `/` - Search & hero
- Cars: `/cars` - Catalog & filters
- Details: `/cars/1`
- Admin: `/admin` (login required)

## Structure

```
src/
├── pages/     # Page components
├── components/ # Reusable UI
├── context/   # State management
├── services/  # API layer
├── hooks/     # Custom hooks
└── utils/
```

## Run

```bash
npm run dev  # http://localhost:5173
npm run build # Production build
npm run preview # Preview build
```

Production-ready car rental frontend.
