// SpritEXAI Pay — typed client for the core engine v1 API.
// Mohammad Sijan (SpritexAI).
//
// In dev, requests go through Vite's /api proxy to the live engine. In production
// the dashboard is served by the engine itself, so the API is same-origin (root).

const BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '/api' : '')

// Bearer token for the admin console, persisted so a refresh keeps you logged in.
const TOKEN_KEY = 'spx_admin_token'
export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const t = token.get()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(t ? { authorization: `Bearer ${t}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    // Token expired or revoked mid-session: drop it and bounce to the gate.
    // Skip on the login call itself (a 401 there is just a wrong password).
    if (res.status === 401 && token.get() && !path.startsWith('/v1/auth/')) {
      token.clear()
      location.reload()
    }
    throw new ApiError(res.status, body.error ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export interface Charge {
  id: string
  order_id: string
  amount_minor: number
  currency: string
  customer_name: string | null
  customer_msisdn: string | null
  callback_url: string | null
  status: 'pending' | 'paid' | 'failed' | 'expired'
  created_at: string
  updated_at: string
}

export interface Reconciliation {
  gateway: string | null
  total_settled_minor: number
  settled_count: number
  pending_charges: number
}

export interface Device {
  id: string
  label: string | null
  status: 'active' | 'revoked'
  last_seen_at: string | null
  created_at: string
}

export interface PairedDevice {
  id: string
  label: string | null
  pairing_token: string
}

export interface GatewayConfig {
  id: string
  gateway: string
  label: string | null
  account_msisdn: string | null
  enabled: number
  created_at: string
}

export interface Anomaly {
  kind: 'duplicate_txid' | 'sender_mismatch' | 'amount_anomaly'
  severity: 'high' | 'medium' | 'low'
  detail: string
  txn_id: string | null
  charge_id: string | null
}

export interface FraudReport {
  anomaly_count: number
  anomalies: Anomaly[]
}

// Reconciliation chat: the engine's AI layer only routes the question to an
// intent; the numbers come from a real ledger/fraud query, never invented.
export interface ChatAnswer {
  intent: 'reconcile' | 'fraud' | 'unknown'
  data: Reconciliation | FraudReport | null
}

// Advisory regex the AI proposes from real drift samples — a maintainer reviews
// and edits the engine's parsers by hand; it's never hot-swapped.
export interface RegexSuggestion {
  gateway: string
  sample_count: number
  txid: string
  amount: string
  sender: string
  note: string
}

export interface ApiKey {
  id: string
  label: string | null
  scopes: string // JSON array string
  status: 'active' | 'revoked'
  created_at: string
  last_used_at: string | null
}

export interface NewApiKey {
  id: string
  label: string | null
  scopes: string[]
  api_key: string // shown once
}

export const api = {
  health: () => req<{ status: string; db: boolean }>('/health'),
  authStatus: () => req<{ auth_required: boolean }>('/v1/auth/status'),
  login: (password: string) =>
    req<{ token: string }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  reconcile: (gateway?: string) =>
    req<Reconciliation>(`/v1/ledger/query${gateway ? `?gateway=${gateway}` : ''}`),
  getCharge: (id: string) => req<Charge>(`/v1/charges/${id}`),
  listCharges: () => req<Charge[]>('/v1/charges'),
  createCharge: (input: {
    order_id: string
    amount_minor: number
    currency?: string
    customer_name?: string
    customer_msisdn?: string
    callback_url?: string
  }) => req<Charge>('/v1/charges', { method: 'POST', body: JSON.stringify(input) }),
  listDevices: () => req<Device[]>('/v1/devices'),
  pairDevice: (label?: string) =>
    req<PairedDevice>('/v1/devices/pair', {
      method: 'POST',
      body: JSON.stringify({ label }),
    }),
  registerGateway: (input: {
    gateway: string
    label?: string
    account_msisdn?: string
  }) => req<GatewayConfig>('/v1/gateways', { method: 'POST', body: JSON.stringify(input) }),
  listGateways: () => req<GatewayConfig[]>('/v1/gateways'),
  regexSuggestion: (gateway: string) =>
    req<RegexSuggestion>(`/v1/gateways/${gateway}/regex-suggestion`),
  fraudScan: () => req<FraudReport>('/v1/fraud/scan'),
  reconChat: (question: string) =>
    req<ChatAnswer>('/v1/recon/chat', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
  listApiKeys: () => req<ApiKey[]>('/v1/merchant-keys'),
  createApiKey: (label?: string) =>
    req<NewApiKey>('/v1/merchant-keys', {
      method: 'POST',
      body: JSON.stringify({ label }),
    }),
  revokeApiKey: (id: string) =>
    req<{ revoked: boolean }>(`/v1/merchant-keys/${id}/revoke`, { method: 'POST' }),
}

// Money helpers — the engine speaks integer minor units (poisha).
export function formatMoney(minor: number, currency = 'BDT'): string {
  const major = (minor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${currency === 'BDT' ? '৳' : currency + ' '}${major}`
}
