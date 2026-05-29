# Proof Grid Core

Proof Grid Core is the starter API for verifiable compute planning.

It models the first technical layer of Proof Grid:

- provider discovery
- provider trust scoring
- compute plan generation
- approval-first job creation
- hash-based plan receipts
- approval receipts

## API Prototype

The prototype is dependency-free and runs on Node.js 18 or newer.

Available scripts:

```powershell
npm run api
npm run check
```

Core routes:

- `GET /health`
- `GET /providers`
- `GET /providers/:id`
- `POST /plan`
- `POST /jobs`
- `POST /jobs/:id/approve`
- `GET /jobs/:id`

## Technical Direction

Proof Grid Core starts with sample providers and in-memory jobs. The next steps are signed provider profiles, persistent plans and receipts, provider-side job runners, verifier checks, and approval policies before execution.
