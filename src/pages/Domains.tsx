// SpritEXAI Pay — Domains: whitelist the hosts allowed as checkout return/webhook
// callbacks. An empty list allows all.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Field } from '../ui'
import { PageHeader } from './_shared'

export default function Domains() {
  const list = useAsync(() => api.listDomains())
  const [open, setOpen] = useState(false)
  const [host, setHost] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await api.createDomain(host)
      setHost('')
      setOpen(false)
      list.refetch()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    try {
      await api.deleteDomain(id)
      list.refetch()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const domains = list.data ?? []

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Domains"
        subtitle="Restrict checkout callbacks to trusted hosts"
        action={
          <Button onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Whitelist Domain'}
          </Button>
        }
      />

      {open && (
        <Card className="mb-6 p-6">
          <div className="mb-4 text-sm font-medium">Whitelist a domain</div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field
              label="Domain host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="shop.example.com"
              required
            />
            <Button type="submit" disabled={busy}>
              {busy ? 'Adding…' : 'Add domain'}
            </Button>
            {err && <p className="text-sm text-danger">{err}</p>}
          </form>
        </Card>
      )}

      <Card className="mb-6 p-4">
        <p className="text-sm text-muted">
          An empty whitelist allows all return/webhook URLs. Add a domain to
          restrict checkout callbacks to it.
        </p>
      </Card>

      <DataTable
        columns={['Domain', 'Created Date', 'Actions']}
        count={domains.length}
        empty={domains.length === 0}
        emptyLabel={list.error ?? (list.loading ? 'Loading…' : 'No domains whitelisted')}
      >
        {domains.map((d) => (
          <tr key={d.id} className="border-b border-border/50 last:border-0">
            <td className="px-5 py-3">{d.domain}</td>
            <td className="px-5 py-3 text-muted">
              {new Date(d.created_at).toLocaleDateString()}
            </td>
            <td className="px-5 py-3">
              <Button variant="ghost" onClick={() => remove(d.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
