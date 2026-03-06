# Forge i-DAS — Integrated Digital Automation System

A professional manufacturing lifecycle management dashboard built with React, Vite, and Material UI.

## Tech Stack

- **Frontend**: React 18, Vite 5, Material UI 7
- **Routing**: React Router v7
- **State**: React Context API (no external state library)
- **Data**: In-memory demo data (no backend required)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── App.jsx              # Root component, routes, providers
├── main.jsx             # Entry point
├── index.css            # Global styles
├── theme.jsx            # MUI theme configuration
├── context/
│   ├── AuthContext.jsx   # Authentication (demo users)
│   └── DataContext.jsx   # Projects, clients, vendors data
├── components/
│   ├── Layout.jsx        # App shell (sidebar + content)
│   └── tabs/             # ProjectDetail tab panels
│       ├── DocumentsTab.jsx
│       ├── EstimationTab.jsx
│       ├── LogisticsTab.jsx
│       ├── ProductionTab.jsx
│       ├── QualityTab.jsx
│       ├── QuotationTab.jsx
│       └── SalesOrderTab.jsx
└── pages/
    ├── Dashboard.jsx     # KPIs, pipeline, projects overview
    ├── Projects.jsx      # Projects list
    ├── ProjectDetail.jsx # Single project with tabs
    ├── Clients.jsx       # Client management
    ├── Vendors.jsx       # Vendor management
    ├── Settings.jsx      # App settings
    └── Login.jsx         # Authentication page
```

## Demo Credentials

| Role       | Email                  | Password   |
|------------|------------------------|------------|
| Admin      | admin@forgedas.com     | admin1234  |
| Engineer   | john@forgedas.com      | eng123     |
| Sales      | sarah@forgedas.com     | sales123   |
| Production | mike@forgedas.com      | prod123    |
| Quality    | lisa@forgedas.com      | qual123    |
| Logistics  | tom@forgedas.com       | log123     |

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. It auto-detects Vite — just click Deploy

### Netlify
1. Push to GitHub
2. Import on [netlify.com](https://app.netlify.com)
3. Build command: `npm run build`, publish directory: `dist`

### Manual / Any Static Host
```bash
npm run build
# Upload the dist/ folder to any static hosting
```

> **Note**: This is a frontend-only app with in-memory data. There is no backend server — all data resets on page refresh. To persist data, connect to a backend API or database.

## License

Private — Developed by Cholan Dynamics Private Limited.
