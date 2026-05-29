const allowedTasks = new Set(["inference", "fine-tune", "batch"]);

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

  return {
    task,
    budgetUsd,
    requirements: request.requirements || {},
    approvalPolicy: request.approvalPolicy || {
      mode: "manual",
      required: true
    }
  };
}
