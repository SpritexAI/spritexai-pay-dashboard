// SpritEXAI Pay — Devices: pair Android forwarders and list them.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import QRCode from 'qrcode'
import { api, type PairedDevice } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

export default function Devices() {
  const { data, loading, error, refetch } = useAsync(() => api.listDevices())
  const [label, setLabel] = useState('')
  const [fresh, setFresh] = useState<PairedDevice | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function pair() {
    setBusy(true)
    try {
      const d = await api.pairDevice(label || undefined)
      setFresh(d)
      // The forwarder app scans this — engine URL + pairing token only. The HMAC
      // secret is NOT here; the app exchanges the token for it over TLS.
      const bundle = JSON.stringify({ v: 1, url: location.origin, token: d.pairing_token })
      setQr(await QRCode.toDataURL(bundle, { margin: 1, width: 220 }))
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
        action={
          <Button onClick={pair} disabled={busy}>
            {busy ? 'Pairing…' : 'Connect Device'}
          </Button>
        }
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
              Scan this with the SpritexAI Pay Engine app to link the device.
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              {qr && (
                <img
                  src={qr}
                  alt="Device pairing QR"
                  className="h-[180px] w-[180px] shrink-0 rounded-lg bg-white p-2"
                />
              )}
              <div className="min-w-0">
                <div className="text-xs text-muted">
                  Or paste this token into the app manually — shown once:
                </div>
                <div className="mt-2 break-all rounded-md bg-canvas px-3 py-2 font-mono text-[13px] text-accent">
                  {fresh.pairing_token}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {loading && <div className="text-sm text-muted">Loading…</div>}
      {error && <div className="text-sm text-danger">{error}</div>}
      {!loading && !error && (
        <DataTable
          columns={['Label', 'Status', 'Device ID', 'Paired']}
          count={data?.length ?? 0}
          empty={!data || data.length === 0}
          emptyLabel="No devices paired yet"
        >
          {data?.map((d) => (
            <tr key={d.id} className="border-b border-border/50 last:border-0">
              <td className="px-5 py-3">{d.label ?? '—'}</td>
              <td className="px-5 py-3">
                <StatusBadge status={d.status} />
              </td>
              <td className="px-5 py-3">
                <Mono>{d.id}</Mono>
              </td>
              <td className="px-5 py-3 text-muted">
                {new Date(d.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  )
}
