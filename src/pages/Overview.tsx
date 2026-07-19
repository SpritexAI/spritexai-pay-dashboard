// SpritEXAI Pay — Overview.
// Mohammad Sijan (SpritexAI).

import { api, formatMoney } from '../api'
import { useAsync } from '../useAsync'
import { Card, StatCard } from '../ui'
import { PageHeader } from './_shared'

export default function Overview() {
  const { data, error, loading, refetch } = useAsync(() => api.reconcile())
  const health = useAsync(() => api.health())

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Overview"
        subtitle="Live reconciliation across your gateways"
        action={
          <button
            onClick={refetch}
            className="text-sm text-muted hover:text-fg"
          >
            Refresh
          </button>
        }
      />

      {error && (
        <Card className="border-danger/40 bg-danger/5 p-4 text-sm text-danger">
          Could not reach the engine: {error}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total settled"
          value={loading ? '—' : formatMoney(data?.total_settled_minor ?? 0)}
          hint={`${data?.settled_count ?? 0} settled transactions`}
        />
        <StatCard
          label="Pending charges"
          value={loading ? '—' : (data?.pending_charges ?? 0)}
          hint="Awaiting a matching SMS"
        />
        <StatCard
          label="Engine"
          value={
            health.loading ? (
              '—'
            ) : health.data?.status === 'ok' ? (
              <span className="text-positive">Healthy</span>
            ) : (
              <span className="text-danger">Down</span>
            )
          }
          hint={health.data?.db ? 'Database connected' : 'pay.rexio.pro'}
        />
      </div>

      <Card className="mt-8 p-6">
        <div className="text-sm font-medium">How settlement works</div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A charge stays <span className="text-fg">pending</span> until the Android
          forwarder relays a matching bKash or Nagad confirmation SMS. The engine
          verifies its signature, posts a balanced double-entry ledger record, and
          fires a signed webhook back to your callback URL — exactly once.
        </p>
      </Card>
    </div>
  )
}
