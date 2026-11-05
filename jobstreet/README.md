# JobStreet extractor

Puppeteer extractor for JobStreet Indonesia. For each keyword slug it opens the category page, reads the job ids and card fields, opens each job detail page for the description, follows pagination while a page is full, and POSTs each record to the ingestion API.

Fields posted: `job_title`, `company_logo`, `company_name`, `company_location`, `company_url`, `job_description`, `schedule_type`, `job_url`.

Config: `INGEST_API_TOKEN` in `.env`. The API endpoint is `https://api.example.com/jobs` (sanitized from the original internal endpoint).
