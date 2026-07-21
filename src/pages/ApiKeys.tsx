// SpritEXAI Pay — API Keys: create merchant keys for the checkout API, list, revoke.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, type NewApiKey } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

export default function ApiKeys() {
  const { data, loading, error, refetch } = useAsync(() => api.listApiKeys())
  const [label, setLabel] = useState('')
  const [fresh, setFresh] = useState<NewApiKey | null>(null)
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      setFresh(await api.createApiKey(label || undefined))
      setLabel('')
      refetch()
    } finally {
      setBusy(false)
    }
  }

  async function revoke(id: string) {
    await api.revokeApiKey(id)
    refetch()
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="API Keys"
        subtitle="Authenticate the checkout API from your site or plugin"
        action={
          <Button onClick={create} disabled={busy}>
            {busy ? 'Creating…' : 'Create key'}
          </Button>
        }
      />

      <Card className="mb-6 p-6">
        <div className="mb-4 text-sm font-medium">Create a key</div>
        <div className="flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. My WooCommerce site)"
            className="w-full max-w-xs rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <Button onClick={create} disabled={busy}>
            {busy ? 'Creating…' : 'Create key'}
          </Button>
        </div>

        {fresh && (
          <div className="mt-5 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="text-sm text-fg">
              Copy this key now — it's shown once and never again.
            </div>
            <div className="mt-2 break-all rounded-md bg-canvas px-3 py-2 font-mono text-[13px] text-accent">
              {fresh.api_key}
            </div>
            <div className="mt-2 text-xs text-muted">
              Send it as the <Mono>x-sap-api-key</Mono> header (or{' '}
              <Mono>Authorization: Bearer</Mono>).
            </div>
          </div>
        )}
      </Card>

      {loading && <div className="text-sm text-muted">Loading…</div>}
      {error && <div className="text-sm text-danger">{error}</div>}
      {!loading && !error && (
        <DataTable
          columns={['Label', 'Scopes', 'Status', 'Created', 'Last Used', 'Actions']}
          count={data?.length ?? 0}
          empty={!data || data.length === 0}
          emptyLabel="No API keys yet"
        >
          {data?.map((k) => (
            <tr key={k.id} className="border-b border-border/50 last:border-0">
              <td className="px-5 py-3">{k.label ?? '—'}</td>
              <td className="px-5 py-3 text-muted">
                {(() => {
                  try {
                    return (JSON.parse(k.scopes) as string[]).join(', ')
                  } catch {
                    return '—'
                  }
                })()}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={k.status} />
              </td>
              <td className="px-5 py-3 text-muted">
                {new Date(k.created_at).toLocaleDateString()}
              </td>
              <td className="px-5 py-3 text-muted">
                {k.last_used_at
                  ? new Date(k.last_used_at).toLocaleDateString()
                  : 'never'}
              </td>
              <td className="px-5 py-3 text-right">
                {k.status === 'active' && (
                  <button
                    onClick={() => revoke(k.id)}
                    className="text-sm text-muted hover:text-danger"
                  >
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  )
}
