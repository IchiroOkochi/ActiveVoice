# ActiveVoice

This simple project highlights instances of passive voice and "to be" verbs in a block of text. The analysis can be performed directly in the browser from `index.html` or through a serverless function.

## Serverless API

A Vercel-style serverless function is provided in `api/analyze.js`. It accepts a POST request with a JSON body containing `text` and returns an analysis including counts and suggestions.

Example request:

```bash
curl -X POST https://<your-deployment>/api/analyze -H 'Content-Type: application/json' \
  -d '{"text":"The report was written by the student."}'
```

