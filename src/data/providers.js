export const providers = [
  {
    id: "node-7c9",
    name: "Northstar H100 Pool",
    type: "gpu",
    region: "us-east",
    hardware: "H100 class GPU",
    bestFor: ["inference", "low-latency"],
    priceUsd: 0.38,
    uptime30d: 0.993,
    benchmarkScore: 96,
    receiptSupport: true,
    policy: {
      maxRuntimeSeconds: 900,
      requiresApproval: true
    }
  },
  {
    id: "vector-forge",
    name: "Vector Forge Cluster",
    type: "gpu",
    region: "us-west",
    hardware: "A100/H100 mixed pool",
    bestFor: ["fine-tune", "batch-inference"],
    priceUsd: 12.8,
    uptime30d: 0.981,
    benchmarkScore: 92,
    receiptSupport: true,
    policy: {
      maxRuntimeSeconds: 14400,
      requiresApproval: true
    }
  },
  {
    id: "edge-cpu-grid",
    name: "EdgeMesh CPU Grid",
    type: "cpu",
    region: "global",
    hardware: "Distributed CPU pool",
    bestFor: ["batch", "fallback"],
    priceUsd: 2.14,
    uptime30d: 0.976,
    benchmarkScore: 84,
    receiptSupport: true,
    policy: {
      maxRuntimeSeconds: 3600,
      requiresApproval: true
    }
  }
];
