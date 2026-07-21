// SpritEXAI Pay — Customers.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Field, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

const TABS = ['All', 'Active', 'Inactive']

export default function Customers() {
  const list = useAsync(() => api.listCustomers())
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const rows = (list.data ?? []).filter((c) => {
    if (tab === 'Active' && c.status !== 'active') return false
    if (tab === 'Inactive' && c.status !== 'inactive') return false
    if (q) {
      const hay = `${c.name ?? ''} ${c.msisdn ?? ''}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    try {
      await api.createCustomer({
        name: String(form.get('name') || '') || undefined,
        email: String(form.get('email') || '') || undefined,
        msisdn: String(form.get('msisdn') || '') || undefined,
      })
      formEl.reset()
      setOpen(false)
      list.refetch()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Customers"
        subtitle="People who have paid you"
        action={
          <Button onClick={() => setOpen((v) => !v)}>
            {open ? 'Cancel' : 'Create Customer'}
          </Button>
        }
      />

      {open && (
        <Card className="mb-6 p-6">
          <div className="mb-4 text-sm font-medium">New customer</div>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name" name="name" placeholder="Full name" />
            <Field label="Email" name="email" type="email" placeholder="name@example.com" />
            <Field label="Mobile" name="msisdn" placeholder="01700000000" />
            <div className="sm:col-span-3">
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save customer'}
              </Button>
              {err && <span className="ml-3 text-sm text-danger">{err}</span>}
            </div>
          </form>
        </Card>
      )}

      <DataTable
        columns={['Customer', 'Mobile Number', 'Created Date', 'Status']}
        tabs={TABS}
        activeTab={tab}
        onTab={setTab}
        search={q}
        onSearch={setQ}
        count={rows.length}
        empty={rows.length === 0}
        emptyLabel="No customers yet"
      >
        {rows.map((c) => (
          <tr key={c.id} className="border-b border-border/50 last:border-0">
            <td className="px-5 py-3">
              <div className="font-medium text-fg">{c.name ?? '—'}</div>
              <div className="text-xs text-muted">{c.email ?? '—'}</div>
            </td>
            <td className="px-5 py-3">
              <Mono>{c.msisdn ?? '—'}</Mono>
            </td>
            <td className="px-5 py-3 text-muted">
              {new Date(c.created_at).toLocaleDateString()}
            </td>
            <td className="px-5 py-3">
              <StatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </DataTable>

      {list.error && <p className="mt-4 text-sm text-danger">{list.error}</p>}
    </div>
  )
}
