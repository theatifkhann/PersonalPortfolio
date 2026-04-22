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

- Frontend: deploy the Vite app as usual.
- Backend: deploy the separate `backend` app on any Node host such as Render, Railway, Fly.io, or your VPS.
- Frontend env: set `VITE_RESUME_API_BASE_URL` to the deployed backend origin.
- Backend env: set `CORS_ORIGIN` to your live frontend origin and the S3 credentials for your bucket.

## Render + Vercel Deployment

This repo now includes a Render blueprint for the backend at [render.yaml](/Users/atif/Desktop/PortfolioWeb/render.yaml:1), and the backend source now lives in [backend](/Users/atif/Desktop/PortfolioWeb/backend).

### Backend on Render

1. Push this repo to GitHub.
2. In Render, create a new Blueprint instance from the repo.
3. Render will detect `render.yaml` and create the `portfolio-resume-api` service from the `backend` folder.
4. Before going live, replace these placeholder env values in Render:
   - `CORS_ORIGIN`
   - `S3_REGION`
   - `S3_ENDPOINT` if your provider needs a custom endpoint
   - `S3_BUCKET_NAME`
   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`
   - `S3_PUBLIC_URL_BASE`
5. Keep the generated `ADMIN_SECRET_KEY` safe. You will use it in the upload screen.
6. After deploy, note the backend URL, for example:

```text
https://portfolio-resume-api.onrender.com
```

### Frontend on Vercel

1. Import the `portfolio` folder into Vercel as the frontend project.
2. Set the framework to Vite if Vercel does not detect it automatically.
3. Set the root directory to:

```text
portfolio
```

4. Add this environment variable in Vercel:

```text
VITE_RESUME_API_BASE_URL=https://your-render-service.onrender.com
```

There is also a sample file at [\.env.vercel.example](/Users/atif/Desktop/PortfolioWeb/portfolio/.env.vercel.example:1).

5. Redeploy the Vercel app after saving the env variable.

### Final wiring

After both deployments are live:

1. Update `CORS_ORIGIN` in Render to the exact Vercel frontend origin.
2. Open your live frontend with:

```text
https://your-portfolio-domain.vercel.app?admin=resume
```

3. Enter the `ADMIN_SECRET_KEY` from Render.
4. Upload a PDF.
5. The main `Resume` button will now open the newly uploaded live file.
