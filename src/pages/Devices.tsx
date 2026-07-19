// SpritEXAI Pay — Devices: pair Android forwarders and list them.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, type PairedDevice } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

export default function Devices() {
  const { data, loading, error, refetch } = useAsync(() => api.listDevices())
  const [label, setLabel] = useState('')
  const [fresh, setFresh] = useState<PairedDevice | null>(null)
  const [busy, setBusy] = useState(false)

  async function pair() {
    setBusy(true)
    try {
      const d = await api.pairDevice(label || undefined)
      setFresh(d)
      setLabel('')
      refetch()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Devices"
        subtitle="Android SMS forwarders linked to this account"
      />

      <Card className="mb-6 p-6">
        <div className="mb-4 text-sm font-medium">Pair a new device</div>
        <div className="flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Device label (e.g. Pixel 8)"
            className="w-full max-w-xs rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <Button onClick={pair} disabled={busy}>
            {busy ? 'Pairing…' : 'Generate token'}
          </Button>
        </div>

        {fresh && (
          <div className="mt-5 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="text-sm text-fg">
              Pairing token — shown once. Scan or paste it into the Android app.
            </div>
            <div className="mt-2 break-all rounded-md bg-canvas px-3 py-2 font-mono text-[13px] text-accent">
              {fresh.pairing_token}
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        {loading && <div className="p-6 text-sm text-muted">Loading…</div>}
        {error && <div className="p-6 text-sm text-danger">{error}</div>}
        {data && data.length === 0 && (
          <div className="p-6 text-sm text-muted">No devices paired yet.</div>
        )}
        {data && data.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-6 py-3 font-medium">Label</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Device ID</th>
                <th className="px-6 py-3 font-medium">Paired</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="border-b border-border/50 last:border-0">
                  <td className="px-6 py-3">{d.label ?? '—'}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-6 py-3">
                    <Mono>{d.id}</Mono>
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
