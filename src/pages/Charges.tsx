// SpritEXAI Pay — Charges: create a charge and look one up.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, formatMoney, type Charge } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, Field, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

export default function Charges() {
  const list = useAsync(() => api.listCharges())
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
      list.refetch()
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

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm font-medium">Recent charges</div>
          <button
            onClick={list.refetch}
            className="text-sm text-muted hover:text-fg"
          >
            Refresh
          </button>
        </div>
        {list.loading && <div className="px-6 pb-6 text-sm text-muted">Loading…</div>}
        {list.error && <div className="px-6 pb-6 text-sm text-danger">{list.error}</div>}
        {list.data && list.data.length === 0 && (
          <div className="px-6 pb-6 text-sm text-muted">No charges yet.</div>
        )}
        {list.data && list.data.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Charge ID</th>
                <th className="px-6 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0">
                  <td className="px-6 py-3">{c.order_id}</td>
                  <td className="px-6 py-3 tnum">
                    {formatMoney(c.amount_minor, c.currency)}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setLookupId(c.id)
                        setLooked(c)
                        setLookErr(null)
                      }}
                      className="font-mono text-[13px] text-muted hover:text-accent"
                    >
                      {c.id}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(c.created_at).toLocaleDateString()}
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <dt className="text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
