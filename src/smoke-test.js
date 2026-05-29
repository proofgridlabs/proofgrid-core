import { providers } from "./data/providers.js";
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

console.log(JSON.stringify(result, null, 2));
