// SpritEXAI Pay — Gateways: register bKash/Nagad instances, list them, and pull
// AI-suggested parser updates from real SMS drift.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, ApiError, type RegexSuggestion } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, DataTable, Field, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

const GATEWAYS = [
  { id: 'bkash', name: 'bKash' },
  { id: 'nagad', name: 'Nagad' },
]

export default function Gateways() {
  const list = useAsync(() => api.listGateways())
  const [gateway, setGateway] = useState('bkash')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    setErr(null)
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    try {
      const gw = await api.registerGateway({
        gateway,
        label: String(form.get('label') || '') || undefined,
        account_msisdn: String(form.get('account_msisdn') || '') || undefined,
      })
      setMsg(`Registered ${gw.gateway} · ${gw.id}`)
      formEl.reset()
      list.refetch()
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 text-sm font-medium">Register a gateway</div>
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

        <RegexSuggest />
      </div>

      <div className="mt-6">
        {list.loading && <div className="text-sm text-muted">Loading…</div>}
        {list.error && <div className="text-sm text-danger">{list.error}</div>}
        {!list.loading && !list.error && (
          <DataTable
            columns={['Gateway', 'Label', 'Account', 'Status']}
            count={list.data?.length ?? 0}
            empty={!list.data || list.data.length === 0}
            emptyLabel="No gateways registered yet"
          >
            {list.data?.map((g) => (
              <tr key={g.id} className="border-b border-border/50 last:border-0">
                <td className="px-5 py-3 capitalize">{g.gateway}</td>
                <td className="px-5 py-3">{g.label ?? '—'}</td>
                <td className="px-5 py-3">
                  <Mono>{g.account_msisdn ?? '—'}</Mono>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={g.enabled ? 'active' : 'revoked'} />
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </div>
  )
}

// Pulls the AI's proposed regex from real SMS the parsers missed. Advisory only —
// a maintainer copies patterns into the engine by hand; nothing is hot-swapped.
function RegexSuggest() {
  const [gateway, setGateway] = useState('bkash')
  const [busy, setBusy] = useState(false)
  const [sug, setSug] = useState<RegexSuggestion | null>(null)
  const [note, setNote] = useState<string | null>(null)

  async function pull() {
    setBusy(true)
    setNote(null)
    setSug(null)
    try {
      setSug(await api.regexSuggestion(gateway))
    } catch (e) {
      setNote(
        e instanceof ApiError && e.status === 404
          ? 'No drifted SMS recovered for this gateway yet (or AI disabled).'
          : String(e),
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="text-sm font-medium">Parser drift suggestions</div>
      <p className="mt-1 text-xs text-muted">
        When a template changes and regex misses, the AI recovers it — then proposes
        an updated pattern from real samples. Review before applying.
      </p>

      <div className="mt-4 flex gap-2">
        <select
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {GATEWAYS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <Button variant="ghost" onClick={pull} disabled={busy}>
          {busy ? 'Analyzing…' : 'Suggest'}
        </Button>
      </div>

      {note && <div className="mt-4 text-sm text-muted">{note}</div>}
      {sug && (
        <div className="mt-4 space-y-3">
          <div className="text-xs text-muted">
            From {sug.sample_count} recovered sample{sug.sample_count === 1 ? '' : 's'}.
            {sug.note && <span className="text-fg"> {sug.note}</span>}
          </div>
          <PatternRow label="TxID" value={sug.txid} />
          <PatternRow label="Amount" value={sug.amount} />
          <PatternRow label="Sender" value={sug.sender} />
        </div>
      )}
    </Card>
  )
}

function PatternRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <code className="mt-1 block break-all rounded-md bg-canvas px-3 py-2 font-mono text-[12px] text-accent">
        {value}
      </code>
    </div>
  )
}
