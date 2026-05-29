import { providers } from "./data/providers.js";
import { surplusMarkets } from "./data/surplus-markets.js";
import { createSurplusAdapter } from "./adapters/surplus.js";
import { createComputePlan } from "./lib/planner.js";

const result = createComputePlan(providers, {
  task: "inference",
  budgetUsd: 1,
  approvalPolicy: {
    mode: "manual",
    required: true
  },
  requirements: {
    gpu: true,
    maxLatencyMs: 1200
  }
});

if (!result.plan.id || !result.receipt.hash) {
  throw new Error("Planner smoke test failed");
}

const surplus = createSurplusAdapter();
const catalog = [
  ...providers,
  ...surplusMarkets.map((market) => surplus.normalizeProvider(market))
];

const surplusResult = createComputePlan(catalog, {
  task: "inference",
  budgetUsd: 0.3,
  executionBackend: "surplus"
});

if (surplusResult.plan.selectedProvider.source !== "surplus") {
  throw new Error("Surplus provider selection smoke test failed");
}

if (surplusResult.plan.executionBackend !== "surplus") {
  throw new Error("Surplus execution backend smoke test failed");
}

console.log(JSON.stringify(result, null, 2));
