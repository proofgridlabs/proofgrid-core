import { createServer } from "node:http";
import { providers } from "./data/providers.js";
import { createComputePlan } from "./lib/planner.js";

const jobs = new Map();

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      return sendJson(response, 200, { ok: true, service: "proofgrid-api" });
    }

    if (request.method === "GET" && url.pathname === "/providers") {
      return sendJson(response, 200, providers);
    }

    if (request.method === "GET" && url.pathname.startsWith("/providers/")) {
      const provider = providers.find((item) => item.id === url.pathname.split("/").at(-1));
      return provider
        ? sendJson(response, 200, provider)
        : sendJson(response, 404, { error: "Provider not found" });
    }

    if (request.method === "POST" && url.pathname === "/plan") {
      const body = await readJson(request);
      return sendJson(response, 200, createComputePlan(providers, body));
    }

    if (request.method === "POST" && url.pathname === "/jobs") {
      const body = await readJson(request);
      const job = {
        id: `job_${Date.now()}`,
        planId: body.planId,
        status: "waiting_for_approval",
        createdAt: new Date().toISOString()
      };
      jobs.set(job.id, job);
      return sendJson(response, 201, job);
    }

    if (request.method === "GET" && url.pathname.startsWith("/jobs/")) {
      const job = jobs.get(url.pathname.split("/").at(-1));
      return job ? sendJson(response, 200, job) : sendJson(response, 404, { error: "Job not found" });
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
