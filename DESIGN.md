# Project Name

**ContractCanvas — Smart Contract Visual Tester**

---

# System Design

> This document describes the system design for **ContractCanvas**, a web application that converts a deployed smart contract address into an interactive visual testing UI. It covers requirements, high-level architecture, component design, data flows, APIs, security, deployment, monitoring, and a development roadmap.

---

## 1. Goals & Objectives

### Primary goal
Provide developers with a single, reliable web tool to inspect, test, and interact with deployed smart contracts across multiple chains without writing scripts.

### Key objectives
- Auto-fetch verified ABIs and render interactive UI for functions & events
- Allow read calls (no wallet required) and write calls (wallet integration with gas estimation and transaction preview)
- Real-time event viewer with decoding and filters
- Multi-chain support and selectable RPCs with RPC health checks
- Shareable workspace links for team collaboration

---

## 2. Non-functional requirements

- **Performance:** UI must render contract functions within 1–2 seconds for verified contracts
- **Reliability:** Fallbacks for ABI fetch (Etherscan → Polygonscan → user upload)
- **Security:** No private key storage; CSRF/XXS protections; input sanitization
- **Scalability:** Support thousands of contract lookups per day via caching and rate limiting
- **Extensibility:** Easy to add new blockchains, explorer APIs, or features

---

## 3. Target Users

- Blockchain developers (smart contract authors)
- QA/test engineers testing deployed contracts
- Technical product managers who want to demo contract behaviour
- Developer educators / instructors demonstrating contracts

---

## 4. High-level Architecture

```
[Frontend (React + Vite)] <---> [Backend API (Node/Express) optional] <---> [RPC Providers]
          |                                         |
          |                                         --> Etherscan/Polygonscan APIs (ABI verification)
          |
          --> Wallets (MetaMask / WalletConnect)

Other components:
- Cache layer (Redis)
- Indexing (The Graph optional)
- Logging / Monitoring (Prometheus + Grafana / Sentry)
- CDN + Static hosting (Vercel/Netlify)
```

### Notes
- The app works in two modes:
  - **Serverless-only (v1 MVP)**: Frontend directly queries explorer APIs and RPCs. No server required except for optional proxy for rate-limited APIs.
  - **Backend-assisted (production)**: Backend provides caching, API key hiding, rate-limiting, verification helper (flattening/compilation matching), workspace persistence, shareable links, and analytics.

---

## 5. Component Design

### 5.1 Frontend (React + Vite)

**Responsibilities**
- Address input + chain selector
- ABI fetching orchestration & status UI
- Dynamic function renderer (read/write separation)
- Event viewer (polling + websocket support)
- Transaction builder & preview (calldata, gas estimate)
- Wallet integration (Ethers.js + WalletConnect)
- Shareable workspace creation (encode state in URL or store on backend)
- UI/UX polish: TailwindCSS + shadcn UI, GSAP animations

**Key Components**
- `AddressInput` — input validation + chain selection
- `ABIManager` — fetch ABI, parse, fallback to upload
- `FunctionList` — grouped functions (read-only, state changing)
- `FunctionCard` — field generator for inputs, invoke/call UI
- `EventViewer` — decoded event stream, filtering, export
- `TransactionPreview` — calldata, gas estimate, simulation result
- `WorkspaceSharer` — encode/shareable link generation


### 5.2 Backend (Node/Express) — optional but recommended

**Responsibilities**
- Cache ABIs, RPC responses, rate-limit Etherscan calls
- Provide verification helper (flatten + match compiler settings)
- Store persisted workspaces (short ID), API tokens per team
- Provide RPC health check & aggregator endpoints
- Provide a queue/relayer for optional gasless meta-transactions

**Endpoints (examples)**
- `GET /api/abi?address={addr}&chain={chain}` — returns ABI or 404
- `POST /api/workspace` — persist workspace JSON → returns short id
- `GET /api/rpc-health` — returns latency & status of RPCs
- `POST /api/verify` — attempt automated verification helper (requires source)

**Data stores**
- Redis — caching ABIs, RPC latencies
- Postgres (optional) — persisted workspaces, user/team data


### 5.3 Indexing / Event stream

- For real-time and historical event data, integrate with either:
  - The Graph (subgraph per contract or generic indexing) — best for heavy usage
  - Or lightweight event polling via RPC `getLogs` with caching & pagination

Tradeoffs:
- The Graph provides faster, queryable data but requires a subgraph deployment
- Polling is simpler; use for MVP and smaller scale

---

## 6. Detailed Flows

### 6.1 ABI Fetching Flow
1. User enters contract address & chooses chain.
2. Frontend calls `/api/abi?address=...&chain=...` (or directly calls explorer API if serverless).
3. Backend attempts (in order): cache -> Etherscan-like explorer -> fallback to indexer (TheGraph) -> respond 404.
4. If ABI found and verified: frontend parses ABI and renders function UI.
5. If ABI not found: prompt user to upload ABI JSON or source files for verification helper.

### 6.2 Read Call Flow (no wallet)
1. User clicks a read-only function (e.g., `totalSupply()`).
2. Frontend uses Ethers.js provider (public RPC) to `callStatic` the function.
3. Result displayed in UI with type decoding.

### 6.3 Write Call Flow (requires wallet)
1. User clicks a write function.
2. UI builds calldata using ABI and input fields.
3. Optionally estimateGas via provider.
4. Wallet popup (MetaMask / WalletConnect) to send the tx.
5. Show transaction hash, watch confirmations, and update event viewer.

### 6.4 Event Streaming
- **MVP**: Poll `getLogs` for specified block ranges; store in cache; deduplicate and display
- **Production**: Use websocket provider or The Graph to receive faster updates and backfill historical logs

---

## 7. Data Models

### ABI Cache (Redis)
- Key: `{chain}:{contract_address}:abi`
- Value: ABI JSON
- TTL: 24 hours (or longer if verified)

### Workspace (Postgres)
- `workspace_id` (uuid)
- `owner` (nullable)
- `chain`, `contract_address`
- `saved_state` (json) — selected function, input presets
- `created_at`, `updated_at`

### Event Log (if storing)
- `id` (txHash:index)
- `contract_address`
- `event_name`
- `decoded_args` (json)
- `block_number`, `timestamp`

---

## 8. Security Considerations

- **Never store private keys** — only connect wallets via standard providers.
- **Input sanitization** — validate address formats and ABI JSON before parsing.
- **Rate limiting & API key protection** — hide explorer API keys on backend, enforce quotas.
- **Content Security Policy (CSP)** — restrict allowed script sources to prevent XSS.
- **CORS** — restrict backend to serve only intended origins.
- **Reentrancy & other on-chain risks** — UI must warn users when calling unknown contracts and show full calldata for transparency.
- **Server hardening** — secure environment variables and secrets (use vault or cloud secret manager).

---

## 9. Performance & Scaling

### Caching
- Use Redis caching for ABIs, recent `getLogs` results, RPC latencies.
- Cache compiled ABI metadata and storage layouts.

### Load distribution
- Use CDN for frontend (Vercel/Netlify) and autoscaling for backend (serverless functions / containers).

### Rate limiting
- Protect expensive endpoints (ABI verification helper, `getLogs`) with per-IP and per-API-key rate limits.

### Cost optimization
- Use shared public RPCs for MVP and optionally offer paid premium RPCs for faster/guaranteed throughput.

---

## 10. Observability & Monitoring

- **Metrics:** Request rates, cache hit/miss, RPC latencies, Etherscan API usage
- **Error tracking:** Sentry for frontend & backend exceptions
- **Uptime & health:** Prometheus + Grafana or cloud monitoring; alert on high latency or failed ABI fetch rates
- **Logs:** Centralized logs (e.g., Datadog / CloudWatch)

---

## 11. CI / CD

- **Repo:** GitHub (monorepo with `frontend/` and `backend/`)
- **CI:** GitHub Actions
  - Linting + TypeScript checks
  - Unit tests (React testing library / Jest)
  - Build preview deploy on PRs to preview environment
- **CD:** On merge to `main`, deploy frontend to Vercel and backend to AWS Lambda / Cloud Run

---

## 12. API & Integration Points

- **Explorer APIs:** Etherscan, Polygonscan, Basescan, BscScan
- **RPC providers:** Alchemy, Infura, public endpoints, or self-hosted nodes
- **Wallets:** MetaMask, WalletConnect (v2)
- **Indexing:** The Graph (optional)
- **Storage:** IPFS for uploaded ABIs or contract metadata (optional)

---

## 13. Developer Experience

- **Local dev:** `pnpm` or `yarn` monorepo with root scripts
- **Environment variables:** `.env.local.example` with placeholders for explorer API keys and RPC endpoints
- **Mocking:** Provide local mock server to simulate `getLogs`, ABI fetch, and RPC responses for faster UI dev
- **Docs:** Auto-generate README for components & contributor guide

---

## 14. Folder Structure (Suggested)

```
/ (repo root)
  /frontend
    /src
      /components
      /hooks
      /pages
      /lib
      /styles
      main.jsx
  /backend
    /src
      /routes
      /services
      /jobs
  /infra
    terraform/
    k8s/
  /docs
    SYSTEM_DESIGN.md
    API.md
```

---

## 15. Feature Roadmap

**MVP (2–4 weeks)**
- Address input + chain selector
- ABI fetch from explorers + manual ABI upload
- Render read and write functions
- Wallet integration for write calls
- Event polling for recent logs

**v1 (1–2 months)**
- Workspace persistence + shareable links
- RPC health dashboard + selector
- Gas estimator + transaction preview
- ABI verification helper (source upload)

**v2 (3–6 months)**
- The Graph integration and subgraph support
- Auto-generated UI themes and smart function grouping
- Simulation/sandbox execution and gasless relayer support
- Team accounts and API keys (paid plans)

---

## 16. Example UX Flows (short)

1. **Quick inspect:** Paste address → ABI found → UI shows functions → Click `totalSupply()` → result appears.
2. **Test & write:** Paste address → choose `transfer(address,uint256)` → fill fields → preview calldata & gas → wallet popup → tx submitted → event logged.
3. **Shareable report:** Save workspace → copy short link → teammate opens exact same UI state.

---

## 17. Testing Strategy

- **Unit tests:** ABI parsing logic, input generation, calldata builder
- **Integration tests:** Ethers.js read calls against testnets (use Sepolia/Polygon Amoy)
- **E2E tests:** Cypress to simulate user flows including wallet popup mocks
- **Security tests:** Static analysis for backend dependencies and pen testing the service endpoints

---

## 18. Risks & Mitigations

- **Explorer API rate limits:** Mitigate with caching & fallback to other scanners or user upload
- **Unverified contracts:** Provide manual ABI upload and clear warnings for unknown contracts
- **RPC variability:** Use multiple RPCs and allow users to select preferred provider

---

## 19. Cost Estimate (monthly, rough)

- Hosting (Vercel/Netlify): free to $20–40 for pro tiers
- Backend (Cloud Run / Lambda): $10–100 depending on usage
- Redis (managed): $15–50
- RPC provider (Alchemy/Infura): $0 for free tiers; $20+ for reliable usage
- Monitoring & logging: $0–50 (starter)

---

## 20. Appendix — Sample API Request/Response

**GET /api/abi?address=0xABC...&chain=sepolia**

Response:
```json
{
  "verified": true,
  "source": "etherscan",
  "compilerVersion": "v0.8.19+commit",
  "abi": [ ... ]
}
```

**POST /api/workspace**
Request body:
```json
{
  "chain": "sepolia",
  "contract": "0xABC...",
  "presetInputs": {
    "transfer": ["0x...", "1000000000000000000"]
  }
}
```

Response:
```json
{ "workspace_id": "cw_2f3a...", "url": "https://contractcanvas.app/w/cw_2f3a..." }
```

---

# Closing notes

This design gives you a clear path from MVP to production-grade service. I included recommended technology choices that match your skills (React/Vite, Ethers.js, GSAP animations) and prioritized developer UX. If you want, I can now:

- Generate the full project scaffold (React + Vite frontend) with sample components
- Create the backend skeleton (Node + Express) with Redis caching
- Produce a deployment `terraform` or `docker-compose` manifest

Which of these should I generate next?

