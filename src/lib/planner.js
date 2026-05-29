import { randomUUID } from "node:crypto";
import { selectProvider } from "./scoring.js";
import { createPlanReceipt } from "./receipts.js";

export function createComputePlan(providers, request) {
  const normalized = normalizeRequest(request);
  const selected = selectProvider(providers, normalized);

  if (!selected) {
    throw new Error("No providers available");
  }

  const plan = {
    id: `plan_${randomUUID()}`,
    task: normalized.task,
    selectedProvider: {
      id: selected.provider.id,
      name: selected.provider.name,
      hardware: selected.provider.hardware,
      region: selected.provider.region
    },
    trustScore: selected.trustScore,
    estimatedCostUsd: selected.provider.priceUsd,
    fallbackProviderId: findFallbackProvider(providers, selected.provider.id),
    approvalState: "requires_user_approval",
    checks: [
      "provider_identity",
      "hardware_claim",
      "uptime_history",
      "benchmark_score",
      "receipt_support"
    ]
  };

  return {
    plan,
    receipt: createPlanReceipt({ plan, provider: selected.provider })
  };
}

function normalizeRequest(request) {
  return {
    task: request?.task || "inference",
    budgetUsd: Number(request?.budgetUsd ?? 1),
    requirements: request?.requirements || {}
  };
}

function findFallbackProvider(providers, selectedId) {
  return providers.find((provider) => provider.id !== selectedId && provider.receiptSupport)?.id || null;
}
