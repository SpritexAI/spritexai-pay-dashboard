// SpritEXAI Pay — Insights: AI reconciliation chat + fraud scan.
// Mohammad Sijan (SpritexAI).
//
// The AI only routes a plain-language question to an intent; the numbers below
// come from a real ledger/fraud query on the engine, never model-invented.

import { useState } from 'react'
import {
  api,
  formatMoney,
  ApiError,
  type ChatAnswer,
  type FraudReport,
  type Reconciliation,
} from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

const SEVERITY_LABEL: Record<string, string> = {
  duplicate_txid: 'Duplicate TXID',
  sender_mismatch: 'Sender mismatch',
  amount_anomaly: 'Amount anomaly',
}

export default function Insights() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Insights"
        subtitle="Ask about your settlements, or scan for anomalies"
      />
      <ReconChat />
      <FraudScan />
    </div>
  )
}

function ReconChat() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState<ChatAnswer | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function ask() {
    if (!q.trim()) return
    setBusy(true)
    setErr(null)
    try {
      setAnswer(await api.reconChat(q.trim()))
    } catch (e) {
      // 503 when no AI provider is configured on the engine.
      setErr(
        e instanceof ApiError && e.status === 503
          ? 'AI provider not configured on the engine.'
          : String(e),
      )
      setAnswer(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="mb-8 p-6">
      <div className="text-sm font-medium">Reconciliation chat</div>
      <p className="mt-1 text-xs text-muted">
        Plain language in, real ledger numbers out — the AI only picks the query.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="How much came in via bKash?"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <Button onClick={ask} disabled={busy}>
          {busy ? 'Asking…' : 'Ask'}
        </Button>
      </div>

      {err && <div className="mt-4 text-sm text-danger">{err}</div>}
      {answer && <ChatResult answer={answer} />}
    </Card>
  )
}

function ChatResult({ answer }: { answer: ChatAnswer }) {
  if (answer.intent === 'reconcile' && answer.data) {
    const r = answer.data as Reconciliation
    return (
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label={`Settled${r.gateway ? ` · ${r.gateway}` : ''}`} value={formatMoney(r.total_settled_minor)} />
        <Stat label="Transactions" value={String(r.settled_count)} />
        <Stat label="Pending" value={String(r.pending_charges)} />
      </div>
    )
  }
  if (answer.intent === 'fraud' && answer.data) {
    const f = answer.data as FraudReport
    return (
      <div className="mt-5">
        <AnomalyList report={f} />
      </div>
    )
  }
  return (
    <div className="mt-4 text-sm text-muted">
      Couldn't map that to a settlement or fraud query. Try asking about totals,
      pending payments, or suspicious transactions.
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight tnum">{value}</div>
    </div>
  )
}

function FraudScan() {
  const { data, loading, error, refetch } = useAsync(() => api.fraudScan())

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Fraud scan</div>
          <p className="mt-1 text-xs text-muted">
            Deterministic rules — duplicate TXIDs, sender mismatch, amount outliers.
          </p>
        </div>
        <button onClick={refetch} className="text-sm text-muted hover:text-fg">
          Rescan
        </button>
      </div>

      <div className="mt-5">
        {loading && <div className="text-sm text-muted">Scanning…</div>}
        {error && <div className="text-sm text-danger">{error}</div>}
        {data && <AnomalyList report={data} />}
      </div>
    </Card>
  )
}

function AnomalyList({ report }: { report: FraudReport }) {
  if (report.anomaly_count === 0) {
    return (
      <div className="rounded-lg border border-positive/30 bg-positive/5 px-4 py-3 text-sm text-positive">
        No anomalies detected.
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {report.anomalies.map((a, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface-2 px-4 py-3"
        >
          <div>
            <div className="text-sm text-fg">{SEVERITY_LABEL[a.kind] ?? a.kind}</div>
            <div className="mt-0.5 text-xs text-muted">{a.detail}</div>
            {(a.txn_id || a.charge_id) && (
              <div className="mt-1">
                <Mono>{a.txn_id ?? a.charge_id}</Mono>
              </div>
            )}
          </div>
          <StatusBadge status={a.severity === 'high' ? 'failed' : 'pending'} />
        </div>
      ))}
    </div>
  )
}
