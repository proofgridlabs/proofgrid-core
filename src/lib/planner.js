import { randomUUID } from "node:crypto";
import { selectProvider } from "./scoring.js";
import { createPlanReceipt } from "./receipts.js";
import { validatePlanRequest } from "./validation.js";

export function createComputePlan(providers, request) {
  const normalized = validatePlanRequest(request);
  const eligibleProviders = filterProviders(providers, normalized.executionBackend);
  const selected = selectProvider(eligibleProviders, normalized);

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
      region: selected.provider.region,
      source: selected.provider.source || "native",
      model: selected.provider.market?.model || null
    },
    trustScore: selected.trustScore,
    estimatedCostUsd: selected.provider.priceUsd,
    fallbackProviderId: findFallbackProvider(providers, selected.provider.id),
    executionBackend: selected.provider.source || "native",
    approvalPolicy: normalized.approvalPolicy,
    approvalState: normalized.approvalPolicy.required ? "requires_user_approval" : "preapproved",
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

function filterProviders(providers, executionBackend) {
  if (executionBackend === "any") {
    return providers;
  }

  return providers.filter((provider) => (provider.source || "native") === executionBackend);
}

function findFallbackProvider(providers, selectedId) {
  return providers.find((provider) => provider.id !== selectedId && provider.receiptSupport)?.id || null;
}
