import { createServer } from "node:http";
import { providers } from "./data/providers.js";
import { surplusMarkets } from "./data/surplus-markets.js";
import { createSurplusAdapter } from "./adapters/surplus.js";
import { createComputePlan } from "./lib/planner.js";
import { createJobReceipt } from "./lib/receipts.js";

const jobs = new Map();
const plans = new Map();
const surplus = createSurplusAdapter();

const providerCatalog = [
  ...providers,
  ...surplusMarkets.map((market) => surplus.normalizeProvider(market))
];

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      return sendJson(response, 200, { ok: true, service: "proofgrid-api" });
    }

    if (request.method === "GET" && url.pathname === "/providers") {
      return sendJson(response, 200, providerCatalog);
    }

    if (request.method === "GET" && url.pathname.startsWith("/providers/")) {
      const providerId = decodeURIComponent(url.pathname.split("/").at(-1));
      const provider = providerCatalog.find((item) => item.id === providerId);
      return provider
        ? sendJson(response, 200, provider)
        : sendJson(response, 404, { error: "Provider not found" });
    }

    if (request.method === "GET" && url.pathname === "/adapters/surplus") {
      return sendJson(response, 200, {
        id: surplus.id,
        name: surplus.name,
        configured: surplus.configured,
        baseUrl: surplus.baseUrl,
        markets: surplusMarkets.length
      });
    }

    if (request.method === "POST" && url.pathname === "/plan") {
      const body = await readJson(request);
      const result = createComputePlan(providerCatalog, body);
      plans.set(result.plan.id, result.plan);
      return sendJson(response, 200, result);
    }

    if (request.method === "POST" && url.pathname === "/jobs") {
      const body = await readJson(request);
      const plan = plans.get(body.planId);
      if (!plan) {
        return sendJson(response, 404, { error: "Plan not found" });
      }

      const job = {
        id: `job_${Date.now()}`,
        planId: plan.id,
        providerId: plan.selectedProvider.id,
        status: "waiting_for_approval",
        approvalState: plan.approvalState,
        createdAt: new Date().toISOString()
      };
      jobs.set(job.id, job);
      return sendJson(response, 201, job);
    }

    if (request.method === "GET" && url.pathname.startsWith("/jobs/")) {
      const job = jobs.get(url.pathname.split("/").at(-1));
      return job ? sendJson(response, 200, job) : sendJson(response, 404, { error: "Job not found" });
    }

    if (request.method === "POST" && url.pathname.match(/^\/jobs\/[^/]+\/approve$/)) {
      const jobId = url.pathname.split("/").at(-2);
      const body = await readJson(request);
      const job = jobs.get(jobId);
      if (!job) {
        return sendJson(response, 404, { error: "Job not found" });
      }

      const plan = plans.get(job.planId);
      const approved = {
        ...job,
        status: "approved",
        approvalState: "approved",
        approvedAt: new Date().toISOString()
      };

      const executionIntent = plan.executionBackend === "surplus"
        ? surplus.createExecutionIntent({
            plan,
            prompt: body.prompt || null,
            maxTokens: body.maxTokens
          })
        : null;

      approved.executionIntent = executionIntent;
      approved.receipt = createJobReceipt({ job: approved, plan, executionIntent });
      jobs.set(job.id, approved);
      return sendJson(response, 200, approved);
    }

    return sendJson(response, 404, { error: "Route not found" });
  } catch (error) {
    return sendJson(response, 400, { error: error.message });
  }
});

const port = Number(process.env.PORT || 8787);
server.listen(port, () => {
  console.log(`Proofgrid API listening on http://localhost:${port}`);
});

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    request.on("error", reject);
  });
}
