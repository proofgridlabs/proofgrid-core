export const surplusMarkets = [
  {
    id: "frontier-inference",
    name: "Surplus frontier inference",
    model: "frontier-model",
    priceUsd: 0.24,
    estimatedPriceUsd: 0.24,
    uptime30d: 0.985,
    benchmarkScore: 90,
    bestFor: ["inference"],
    settlement: "crypto",
    routing: "real_time_price_discovery"
  },
  {
    id: "cheap-batch",
    name: "Surplus batch inference",
    model: "batch-optimized-model",
    priceUsd: 0.11,
    estimatedPriceUsd: 0.11,
    uptime30d: 0.972,
    benchmarkScore: 82,
    bestFor: ["batch"],
    settlement: "crypto",
    routing: "lowest_eligible_offer"
  }
];
