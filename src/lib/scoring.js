export function scoreProvider(provider, request) {
  const workloadFit = provider.bestFor.includes(request.task) ? 20 : 8;
  const uptimeScore = Math.round(provider.uptime30d * 30);
  const benchmarkScore = Math.round(provider.benchmarkScore * 0.3);
  const receiptScore = provider.receiptSupport ? 12 : 0;
  const budgetScore = provider.priceUsd <= request.budgetUsd ? 8 : -8;

  return Math.max(0, Math.min(100, workloadFit + uptimeScore + benchmarkScore + receiptScore + budgetScore));
}

export function selectProvider(providers, request) {
  return providers
    .map((provider) => ({
      provider,
      trustScore: scoreProvider(provider, request)
    }))
    .sort((a, b) => b.trustScore - a.trustScore || a.provider.priceUsd - b.provider.priceUsd)[0];
}
