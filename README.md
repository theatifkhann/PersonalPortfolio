# PortfolioWeb

This repo contains the full portfolio workspace:

- `portfolio/`: Vite frontend portfolio app
- `backend/`: Express resume upload API with Cloudflare R2-compatible storage
- `render.yaml`: Render blueprint for deploying the backend

## Local setup

Frontend:

```bash
cd portfolio
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Environment files

Do not commit local secret files.

- Frontend local env: `portfolio/.env`
- Backend local env: `backend/.env`

Use these safe templates instead:

- `portfolio/.env.example`
- `backend/.env.example`

## Deploy

- Frontend: deploy `portfolio/` to Vercel
- Backend: deploy `backend/` to Render using `render.yaml`
