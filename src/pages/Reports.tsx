// SpritEXAI Pay — Reports.
// Mohammad Sijan (SpritexAI).

import { api, formatMoney } from '../api'
import { useAsync } from '../useAsync'
import { StatCard } from '../ui'
import { PageHeader } from './_shared'

export default function Reports() {
  const recon = useAsync(() => api.reconcile())
  const r = recon.data

  // settled_count is the completed slice; pending_charges the rest. Success rate
  // is settled over everything the engine has seen. No data → 0.00%.
  const total = r ? r.settled_count + r.pending_charges : 0
  const successRate =
    r && total > 0 ? ((r.settled_count / total) * 100).toFixed(2) : '0.00'
  const avg =
    r && r.settled_count > 0
      ? formatMoney(Math.round(r.total_settled_minor / r.settled_count))
      : formatMoney(0)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Reports" subtitle="Financial summary" />

      <div className="mb-4 text-sm text-muted">This year</div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue"
          value={r ? formatMoney(r.total_settled_minor) : '—'}
        />
        <StatCard label="Success Rate" value={`${successRate}%`} />
        <StatCard label="Average Transaction" value={avg} />
      </div>

      {recon.error && <p className="mt-4 text-sm text-danger">{recon.error}</p>}
    </div>
  )
}
