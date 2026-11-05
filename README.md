# Scraping code sample

Two extractors from a job-board data pipeline I built, sanitized for sharing: internal endpoints replaced with `https://api.example.com/jobs`, token environment variable renamed, and employer-specific assets removed. Behavior is otherwise unchanged.

| Folder | Source | Approach |
|---|---|---|
| `jobstreet/` | JobStreet Indonesia | Puppeteer. Reads `data-automation` attributes from result cards and job detail pages, paginates, posts each record to an ingestion API. |
| `kalibrr/` | Kalibrr Indonesia | axios only. Reads the job-board search API, then per-job detail from Kalibrr's Next.js data endpoint, posts to the same ingestion API. |

Run with Node 18+: `npm install`, copy `.env.example` to `.env`, `npm start`.

## What this snapshot deliberately still shows

This is the state of the code that produced the failure described in my application email, not a rewritten showpiece.

- `kalibrr/kalibrr-scraper.js` hardcodes the Next.js `buildId` (`RHBx-W8Ym0gWx0tw46C5b`). When Kalibrr redeploys, that id changes and every detail request fails.
- Several `catch` blocks are empty, so a failed detail or POST leaves no trace and the run still looks successful.
- `reRunScrapper` is called without `await`, so pagination failures go unseen.
- A new Puppeteer browser is launched per job in `getDescriptionJob`, which is slow.
- The client sends no idempotency key. Repeating a run can post the same record twice, and any duplicate suppression would have to live in the ingestion API.

The production version reads `buildId` from `__NEXT_DATA__` on the first page load and surfaces failed detail fetches. The rest of the list is honest debt in a first-pass pipeline, and it is the reason I now treat silent success as the bug rather than the absence of an error.
