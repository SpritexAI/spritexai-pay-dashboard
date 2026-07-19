// SpritEXAI Pay — Gateways: register bKash/Nagad instances.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api } from '../api'
import { Button, Card, Field } from '../ui'
import { PageHeader } from './_shared'

const GATEWAYS = [
  { id: 'bkash', name: 'bKash' },
  { id: 'nagad', name: 'Nagad' },
]

export default function Gateways() {
  const [gateway, setGateway] = useState('bkash')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    setErr(null)
    const form = new FormData(e.currentTarget)
    try {
      const gw = await api.registerGateway({
        gateway,
        label: String(form.get('label') || '') || undefined,
        account_msisdn: String(form.get('account_msisdn') || '') || undefined,
      })
      setMsg(`Registered ${gw.gateway} · ${gw.id}`)
      e.currentTarget.reset()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Gateways"
        subtitle="Configure the MFS accounts that receive payments"
      />

      <Card className="max-w-lg p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <span className="mb-1.5 block text-sm text-muted">Gateway</span>
            <div className="flex gap-2">
              {GATEWAYS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGateway(g.id)}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    gateway === g.id
                      ? 'border-accent bg-accent/10 text-fg'
                      : 'border-border text-muted hover:text-fg'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <Field label="Label" name="label" placeholder="Main bKash number" />
          <Field
            label="Account mobile"
            name="account_msisdn"
            placeholder="01700000000"
          />
          <Button type="submit" disabled={busy}>
            {busy ? 'Registering…' : 'Register gateway'}
          </Button>

          {msg && <p className="text-sm text-positive">{msg}</p>}
          {err && <p className="text-sm text-danger">{err}</p>}
        </form>
      </Card>
    </div>
  )
}
