const defaultBaseUrl = "https://www.surplusintelligence.ai";

export function createSurplusAdapter(options = {}) {
  const baseUrl = options.baseUrl || process.env.SURPLUS_BASE_URL || defaultBaseUrl;
  const apiKey = options.apiKey || process.env.SURPLUS_API_KEY || null;

  return {
    id: "surplus",
    name: "Surplus Intelligence",
    baseUrl,
    configured: Boolean(apiKey),
    headers: createHeaders(apiKey),
    normalizeProvider,
    createExecutionIntent
  };
}

export function normalizeProvider(market) {
  return {
    id: `surplus:${market.id || market.model || "market"}`,
    name: market.name || market.model || "Surplus market",
    type: "inference",
    source: "surplus",
    region: market.region || "market",
    hardware: market.model || "model marketplace",
    bestFor: market.bestFor || ["inference"],
    priceUsd: Number(market.priceUsd ?? market.estimatedPriceUsd ?? 0),
    uptime30d: Number(market.uptime30d ?? 0.98),
    benchmarkScore: Number(market.benchmarkScore ?? 85),
    receiptSupport: true,
    policy: {
      maxRuntimeSeconds: Number(market.maxRuntimeSeconds ?? 300),
      requiresApproval: true
    },
    market: {
      model: market.model,
      settlement: market.settlement || "crypto",
      routing: market.routing || "price_discovery"
    }
  };
}

export function createExecutionIntent({ plan, prompt, maxTokens }) {
  if (!plan?.selectedProvider?.id?.startsWith("surplus:")) {
    throw new Error("Plan is not routed to a Surplus provider");
  }

  return {
    backend: "surplus",
    providerId: plan.selectedProvider.id,
    model: plan.selectedProvider.model,
    input: {
      prompt,
      maxTokens: maxTokens || 512
    },
    maxTokens: maxTokens || 512,
    approvalState: plan.approvalState,
    proofgridPlanId: plan.id,
    status: "ready_for_surplus_execution"
  };
}

function createHeaders(apiKey) {
  return {
    "content-type": "application/json",
    ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {})
  };
}
