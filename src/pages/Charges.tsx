// SpritEXAI Pay — Charges: create a charge and look one up.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, formatMoney, type Charge } from '../api'
import { Button, Card, Field, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

export default function Charges() {
  const [created, setCreated] = useState<Charge | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const [lookupId, setLookupId] = useState('')
  const [looked, setLooked] = useState<Charge | null>(null)
  const [lookErr, setLookErr] = useState<string | null>(null)

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    const form = new FormData(e.currentTarget)
    const amountBdt = Number(form.get('amount'))
    try {
      const charge = await api.createCharge({
        order_id: String(form.get('order_id')),
        amount_minor: Math.round(amountBdt * 100),
        customer_name: String(form.get('customer_name') || '') || undefined,
        customer_msisdn: String(form.get('customer_msisdn') || '') || undefined,
        callback_url: String(form.get('callback_url') || '') || undefined,
      })
      setCreated(charge)
      e.currentTarget.reset()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function onLookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLookErr(null)
    setLooked(null)
    try {
      setLooked(await api.getCharge(lookupId.trim()))
    } catch (e) {
      setLookErr((e as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Charges" subtitle="Create a payment intent or inspect one" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 text-sm font-medium">New charge</div>
          <form onSubmit={onCreate} className="space-y-4">
            <Field label="Order ID" name="order_id" required placeholder="ORD-1001" />
            <Field
              label="Amount (BDT)"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="500.00"
            />
            <Field label="Customer name" name="customer_name" placeholder="Optional" />
            <Field
              label="Customer mobile"
              name="customer_msisdn"
              placeholder="01700000000 (optional)"
            />
            <Field
              label="Callback URL"
              name="callback_url"
              placeholder="https://... (optional)"
            />
            <Button type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create charge'}
            </Button>
            {err && <p className="text-sm text-danger">{err}</p>}
          </form>

          {created && (
            <div className="mt-5 rounded-lg border border-positive/30 bg-positive/5 p-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={created.status} />
                <span className="text-lg font-semibold tnum">
                  {formatMoney(created.amount_minor, created.currency)}
                </span>
              </div>
              <div className="mt-2">
                <Mono>{created.id}</Mono>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 text-sm font-medium">Look up a charge</div>
          <form onSubmit={onLookup} className="flex gap-2">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="chg_…"
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <Button type="submit" variant="ghost">
              Find
            </Button>
          </form>
          {lookErr && <p className="mt-3 text-sm text-danger">{lookErr}</p>}
          {looked && (
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Status">
                <StatusBadge status={looked.status} />
              </Row>
              <Row label="Amount">
                <span className="tnum">
                  {formatMoney(looked.amount_minor, looked.currency)}
                </span>
              </Row>
              <Row label="Order">{looked.order_id}</Row>
              <Row label="Created">
                {new Date(looked.created_at).toLocaleString()}
              </Row>
              <Row label="ID">
                <Mono>{looked.id}</Mono>
              </Row>
            </dl>
          )}
        </Card>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <dt className="text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
