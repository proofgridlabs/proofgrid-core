# Compute AI API

This is the starter API shape for the Compute AI beta.

## `GET /providers`

Returns available compute providers.

```json
[
  {
    "id": "node-7c9",
    "name": "Northstar H100 Pool",
    "hardware": "H100 class GPU",
    "region": "us-east",
    "uptime30d": 0.993,
    "trustScore": 94,
    "priceHint": "$0.38 / inference task"
  }
]
```

## `GET /providers/:id`

Returns provider details, benchmark history, policy limits, and trust signals.

## `POST /plan`

Creates a proposed compute plan before execution.

```json
{
  "task": "inference",
  "budgetUsd": 1,
  "region": "us-east",
  "requirements": {
    "gpu": true,
    "maxLatencyMs": 1200
  }
}
```

## `POST /jobs`

Creates an approved compute job from a plan.

## `GET /jobs/:id`

Returns job status, execution logs, result hash, and trust receipt.
