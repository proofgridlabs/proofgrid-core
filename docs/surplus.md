# Surplus Adapter

Proof Grid Core includes a starter adapter boundary for Surplus Intelligence.

Surplus can act as an inference execution and market-routing backend. Proof Grid
stays responsible for the pre-flight layer:

1. normalize available Surplus markets into provider-like profiles
2. score the route against other providers
3. create a plan before execution
4. require approval
5. attach Surplus execution metadata to the Proof Grid receipt

## Environment

```text
SURPLUS_BASE_URL=https://www.surplusintelligence.ai
SURPLUS_API_KEY=
```

The current adapter is a safe scaffold. It does not call private Surplus APIs or
assume credential-specific request formats. Wire live execution only after API
credentials and exact endpoint contracts are confirmed.

## Adapter Status

```http
GET /adapters/surplus
```

Returns whether the adapter has credentials configured and how many sample
markets are available locally.

## Planning With Surplus

Request a Surplus-backed route by setting `executionBackend`:

```json
{
  "task": "inference",
  "budgetUsd": 0.3,
  "executionBackend": "surplus"
}
```

The resulting plan includes:

```json
{
  "executionBackend": "surplus",
  "selectedProvider": {
    "source": "surplus",
    "model": "frontier-model"
  }
}
```

## Approval Intent

Approving a Surplus-backed job returns an `executionIntent`. This is not a live
Surplus API call yet. It is the object Proof Grid will hand to the live adapter
once credentials and exact endpoint contracts are configured.

## Provider IDs

Surplus markets are exposed as provider IDs prefixed with:

```text
surplus:
```

Example:

```text
surplus:frontier-inference
```

## Next Steps

1. Replace sample markets with live Surplus market discovery.
2. Add real chat/completion execution once credentials are available.
3. Store Surplus fill/settlement data in job receipts.
4. Add verifier checks for model, price, latency, and returned output metadata.
