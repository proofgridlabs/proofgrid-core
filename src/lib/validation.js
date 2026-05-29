const allowedTasks = new Set(["inference", "fine-tune", "batch"]);
const allowedBackends = new Set(["any", "native", "surplus"]);

export function validatePlanRequest(request) {
  if (!request || typeof request !== "object") {
    throw new Error("Plan request must be a JSON object");
  }

  const task = request.task || "inference";
  if (!allowedTasks.has(task)) {
    throw new Error(`Unsupported task '${task}'. Supported tasks: ${Array.from(allowedTasks).join(", ")}`);
  }

  const budgetUsd = Number(request.budgetUsd ?? 1);
  if (!Number.isFinite(budgetUsd) || budgetUsd <= 0) {
    throw new Error("budgetUsd must be a positive number");
  }

  const executionBackend = request.executionBackend || "any";
  if (!allowedBackends.has(executionBackend)) {
    throw new Error(`Unsupported executionBackend '${executionBackend}'. Supported backends: ${Array.from(allowedBackends).join(", ")}`);
  }

  return {
    task,
    budgetUsd,
    executionBackend,
    requirements: request.requirements || {},
    approvalPolicy: request.approvalPolicy || {
      mode: "manual",
      required: true
    }
  };
}
