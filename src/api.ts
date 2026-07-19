// SpritEXAI Pay — typed client for the core engine v1 API.
// Mohammad Sijan (SpritexAI).
//
// In dev, requests go through Vite's /api proxy to the live engine. In production
// the dashboard is served by the engine itself, so the API is same-origin (root).

const BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '/api' : '')

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
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

export const api = {
  health: () => req<{ status: string; db: boolean }>('/health'),
  reconcile: (gateway?: string) =>
    req<Reconciliation>(`/v1/ledger/query${gateway ? `?gateway=${gateway}` : ''}`),
  getCharge: (id: string) => req<Charge>(`/v1/charges/${id}`),
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
}

// Money helpers — the engine speaks integer minor units (poisha).
export function formatMoney(minor: number, currency = 'BDT'): string {
  const major = (minor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${currency === 'BDT' ? '৳' : currency + ' '}${major}`
}
