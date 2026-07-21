// SpritEXAI Pay — Invoices: draft an invoice from line items, list them, and
// pull a hosted pay link for any invoice.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, formatMoney, type LineItem } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Field, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

const TABS = ['All', 'Paid', 'Unpaid', 'Refunded', 'Canceled']
// Tab label → invoice.status. 'All' short-circuits the filter.
const TAB_STATUS: Record<string, string> = {
  Paid: 'paid',
  Unpaid: 'unpaid',
  Refunded: 'refunded',
  Canceled: 'canceled',
}

type Row = { description: string; quantity: string; unit: string }
const emptyRow = (): Row => ({ description: '', quantity: '1', unit: '' })

export default function Invoices() {
  const list = useAsync(() => api.listInvoices())
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('All')

  const [customerId, setCustomerId] = useState('')
  const [currency, setCurrency] = useState('BDT')
  const [rows, setRows] = useState<Row[]>([emptyRow()])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function setRow(i: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      const items: LineItem[] = rows.map((r) => ({
        description: r.description,
        quantity: Number(r.quantity) || 0,
        unit_minor: Math.round(Number(r.unit || 0) * 100),
      }))
      await api.createInvoice({
        currency,
        customer_id: customerId || undefined,
        items,
      })
      setCustomerId('')
      setRows([emptyRow()])
      setOpen(false)
      list.refetch()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function getPayLink(id: string) {
    try {
      const { sap_url } = await api.issueInvoice(id)
      alert(sap_url)
      list.refetch()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const invoices = list.data ?? []
  const filtered = invoices.filter(
    (inv) => tab === 'All' || inv.status === TAB_STATUS[tab],
  )

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Invoices"
        subtitle="Bill customers and collect via a hosted pay link"
        action={
          <Button onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Create Invoice'}
          </Button>
        }
      />

      {open && (
        <Card className="mb-6 p-6">
          <div className="mb-4 text-sm font-medium">New invoice</div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Optional"
              />
              <Field
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="BDT"
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm text-muted">Line items</span>
              <div className="space-y-2">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <div className="flex-1">
                      <input
                        value={r.description}
                        onChange={(e) => setRow(i, { description: e.target.value })}
                        placeholder="Description"
                        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted/60 focus:border-accent"
                      />
                    </div>
                    <input
                      value={r.quantity}
                      onChange={(e) => setRow(i, { quantity: e.target.value })}
                      placeholder="Qty"
                      inputMode="numeric"
                      className="w-20 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted/60 focus:border-accent"
                    />
                    <input
                      value={r.unit}
                      onChange={(e) => setRow(i, { unit: e.target.value })}
                      placeholder="Unit ৳"
                      inputMode="decimal"
                      className="w-28 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted/60 focus:border-accent"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                      disabled={rows.length === 1}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRows((rs) => [...rs, emptyRow()])}
                className="mt-2 text-sm text-accent hover:opacity-80"
              >
                + Add item
              </button>
            </div>

            <Button type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create invoice'}
            </Button>
            {err && <p className="text-sm text-danger">{err}</p>}
          </form>
        </Card>
      )}

      <DataTable
        columns={['Customer', 'Items', 'Amount', 'Created Date', 'Status', 'Actions']}
        tabs={TABS}
        activeTab={tab}
        onTab={setTab}
        count={filtered.length}
        empty={filtered.length === 0}
        emptyLabel={list.error ?? (list.loading ? 'Loading…' : 'No invoices yet')}
      >
        {filtered.map((inv) => (
          <tr key={inv.id} className="border-b border-border/50 last:border-0">
            <td className="px-5 py-3">{inv.customer_id ?? '—'}</td>
            <td className="px-5 py-3">{inv.number}</td>
            <td className="px-5 py-3 tnum">
              {formatMoney(inv.amount_minor, inv.currency)}
            </td>
            <td className="px-5 py-3 text-muted">
              {new Date(inv.created_at).toLocaleDateString()}
            </td>
            <td className="px-5 py-3">
              <StatusBadge status={inv.status} />
            </td>
            <td className="px-5 py-3">
              <Button variant="ghost" onClick={() => getPayLink(inv.id)}>
                Get pay link
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
