// SpritEXAI Pay — Payment Links: create shareable pay-me links (fixed or open
// amount) and copy their public URL.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, formatMoney } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Field, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

export default function PaymentLinks() {
  const list = useAsync(() => api.listPaymentLinks())
  const [open, setOpen] = useState(false)

  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [quantity, setQuantity] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await api.createPaymentLink({
        product_name: product,
        amount_minor: amount ? Math.round(Number(amount) * 100) : undefined,
        quantity: quantity ? Number(quantity) : undefined,
      })
      setProduct('')
      setAmount('')
      setQuantity('')
      setOpen(false)
      list.refetch()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function copy(ref: string) {
    const url = `${location.origin}/link/${ref}`
    await navigator.clipboard.writeText(url)
    setCopied(ref)
    setTimeout(() => setCopied(null), 1500)
  }

  const links = list.data ?? []

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Payment Links"
        subtitle="Shareable links that collect a fixed or open amount"
        action={
          <Button onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Create Payment Link'}
          </Button>
        }
      />

      {open && (
        <Card className="mb-6 p-6">
          <div className="mb-4 text-sm font-medium">New payment link</div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field
              label="Product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Premium plan"
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Amount (৳)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Leave blank for open amount"
                inputMode="decimal"
              />
              <Field
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Optional"
                inputMode="numeric"
              />
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create link'}
            </Button>
            {err && <p className="text-sm text-danger">{err}</p>}
          </form>
        </Card>
      )}

      <DataTable
        columns={['Product', 'Quantity', 'Amount', 'Created Date', 'Status', 'Link']}
        count={links.length}
        empty={links.length === 0}
        emptyLabel={list.error ?? (list.loading ? 'Loading…' : 'No payment links yet')}
      >
        {links.map((l) => (
          <tr key={l.id} className="border-b border-border/50 last:border-0">
            <td className="px-5 py-3">{l.product_name}</td>
            <td className="px-5 py-3">{l.quantity ?? '—'}</td>
            <td className="px-5 py-3 tnum">
              {l.amount_minor == null
                ? 'Open amount'
                : formatMoney(l.amount_minor, l.currency)}
            </td>
            <td className="px-5 py-3 text-muted">
              {new Date(l.created_at).toLocaleDateString()}
            </td>
            <td className="px-5 py-3">
              <StatusBadge status={l.status} />
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center gap-2">
                <Mono>/link/{l.ref}</Mono>
                <Button variant="ghost" onClick={() => copy(l.ref)}>
                  {copied === l.ref ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
