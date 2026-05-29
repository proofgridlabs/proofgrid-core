# Proofgrid Architecture

Proofgrid is a starter control plane for verifiable compute planning.

## Core Objects

- Provider: a compute supplier with hardware claims, uptime, benchmark score, policy limits, and receipt support.
- Plan: a pre-execution decision that selects a provider, estimates cost, lists checks, and waits for user approval.
- Job: an approved execution request created from a plan.
- Receipt: a hashable record that connects a plan to provider context and execution metadata.

## Starter API

- `GET /health`
- `GET /providers`
- `GET /providers/:id`
- `POST /plan`
- `POST /jobs`
- `GET /jobs/:id`

## Direction

The prototype is intentionally simple. The next technical steps are:

1. Replace sample provider data with signed provider profiles.
2. Persist plans, jobs, and receipts in a database.
3. Add provider-side job runners.
4. Add verifier checks for hardware claims and execution receipts.
5. Add wallet or policy approval before job execution.
