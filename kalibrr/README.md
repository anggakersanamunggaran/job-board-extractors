# Kalibrr extractor

axios-only extractor for Kalibrr Indonesia. It reads the job-board search API per keyword, then per-job detail from Kalibrr's Next.js data endpoint (`/_next/data/{buildId}/...`), and POSTs each record to the ingestion API.

Config: `INGEST_API_TOKEN` in `.env`. The API endpoint is `https://api.example.com/jobs` (sanitized from the original internal endpoint).

Note: `buildId` is hardcoded in this snapshot. See the top-level README for why, and what the production version does instead.
