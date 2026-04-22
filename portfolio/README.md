# Portfolio

A modular React + Vite portfolio scaffold with separate `components`, `sections`,
`data`, `hooks`, and `utils` folders so content updates stay simple.

## Run Locally

```bash
cd portfolio
npm install
npm run dev
```

To run the resume upload backend locally in a second terminal:

```bash
cd backend
npm install
npm run dev
```

## Project Structure

```text
src/
  components/
  sections/
  data/
  hooks/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Customization

- Update copy and links in `src/utils/constants.js`.
- Replace the project, skill, and experience placeholders in `src/data/`.
- Drop real assets into `public/` or `src/assets/` when you are ready to publish.

## Dynamic Resume Uploads

This project now supports a simple dynamic resume flow backed by Express and S3-compatible storage.

### What it adds

- `GET /api/resume` returns the current live resume URL.
- `POST /api/resume/upload` uploads a replacement PDF to a fixed S3 object key.
- The navbar opens the API-provided resume URL, with `/resume.pdf` as a fallback.
- A small admin screen is available at `?admin=resume`.

### Setup

1. Copy `.env.example` to `.env`.
2. In the sibling `backend` folder, copy `backend/.env.example` to `backend/.env`.
3. Fill in your S3-compatible storage values and `ADMIN_SECRET_KEY` in `backend/.env`.
4. Make sure the bucket or CDN URL in `S3_PUBLIC_URL_BASE` is publicly readable.
5. Run the frontend and backend:

```bash
cd portfolio
npm run dev

cd ../backend
npm install
npm run dev
```

6. Open the portfolio and visit:

```text
http://localhost:5173?admin=resume
```

7. Enter your secret key and upload a PDF.

### Deployment shape

- Frontend: deploy `portfolio/` to Vercel
- Backend: deploy `backend/` to Vercel as a separate project from the same repo
- Frontend env: set `VITE_RESUME_API_BASE_URL` to the deployed backend origin
- Backend env: set `CORS_ORIGIN` to your live frontend origin and the R2 credentials for your bucket

## Vercel Monorepo Deployment

Deploy this repo to Vercel as two projects connected to the same GitHub repository.

### Frontend on Vercel

1. Import the repo into Vercel.
2. Set the root directory to:

```text
portfolio
```

3. Framework preset: `Vite`
4. Add:

```text
VITE_RESUME_API_BASE_URL=https://your-backend-project.vercel.app
```

There is also a sample file at [\.env.vercel.example](/Users/atif/Desktop/PortfolioWeb/portfolio/.env.vercel.example:1).

### Backend on Vercel

1. Import the same repo again into Vercel.
2. Set the root directory to:

```text
backend
```

3. Add these environment variables:
   - `ADMIN_SECRET_KEY`
   - `CORS_ORIGIN`
   - `MAX_UPLOAD_SIZE_MB`
   - `S3_REGION`
   - `S3_ENDPOINT`
   - `S3_BUCKET_NAME`
   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`
   - `S3_PUBLIC_URL_BASE`
   - `S3_FORCE_PATH_STYLE`
   - `RESUME_OBJECT_KEY`

4. Vercel will detect the Express backend from [backend/index.js](/Users/atif/Desktop/PortfolioWeb/backend/index.js:1).

### Final wiring

After both projects are live:

1. Set `VITE_RESUME_API_BASE_URL` to the backend Vercel URL.
2. Set `CORS_ORIGIN` to the frontend Vercel URL.
3. Open:

```text
https://your-frontend-project.vercel.app?admin=resume
```

4. Enter the `ADMIN_SECRET_KEY`.
5. Upload a PDF.
6. The main `Resume` button will open the latest uploaded file.
