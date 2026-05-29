import { createHash, randomUUID } from "node:crypto";

export function createPlanReceipt({ plan, provider }) {
  const issuedAt = new Date().toISOString();
  const payload = {
    id: `receipt_${randomUUID()}`,
    issuedAt,
    providerId: provider.id,
    planId: plan.id,
    task: plan.task,
    estimatedCostUsd: plan.estimatedCostUsd,
    approvalState: plan.approvalState
  };

  return {
    ...payload,
    hash: hashPayload(payload)
  };
}

export function createJobReceipt({ job, plan }) {
  const issuedAt = new Date().toISOString();
  const payload = {
    id: `receipt_${randomUUID()}`,
    issuedAt,
    jobId: job.id,
    planId: plan.id,
    providerId: plan.selectedProvider.id,
    status: job.status,
    approvalState: job.approvalState
  };

  return {
    ...payload,
    hash: hashPayload(payload)
  };
}

function hashPayload(payload) {
  return `0x${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
}
