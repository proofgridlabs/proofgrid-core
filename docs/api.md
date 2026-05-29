# Proof Grid Core API

This is the starter API for Proof Grid's verifiable compute planning layer.

## `GET /health`

Returns service health.

```json
{
  "ok": true,
  "service": "proofgrid-api"
}
```

## `GET /providers`

Returns available sample compute providers.

## `GET /providers/:id`

Returns provider details, benchmark history, policy limits, and trust signals.

## `GET /adapters/surplus`

Returns Surplus adapter configuration status and local sample market count.

## `POST /plan`

Creates a proposed compute plan before execution.

```json
{
  "task": "inference",
  "budgetUsd": 1,
  "approvalPolicy": {
    "mode": "manual",
    "required": true
  },
  "requirements": {
    "gpu": true,
    "maxLatencyMs": 1200
  }
}
```

The response includes a plan and hash-based plan receipt.

## `POST /jobs`

Creates a job from an existing plan.

```json
{
  "planId": "plan_..."
}
```

Jobs start in `waiting_for_approval`.

## `POST /jobs/:id/approve`

Approves a waiting job and returns a job receipt.

## `GET /jobs/:id`

Returns job status, approval state, provider ID, and receipt data when available.
