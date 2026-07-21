// SpritEXAI Pay — Dashboard.
// Mohammad Sijan (SpritexAI).

import { api, formatMoney } from '../api'
import { useAsync } from '../useAsync'
import { Card, StatCard } from '../ui'
import { PageHeader } from './_shared'

export default function Dashboard() {
  const recon = useAsync(() => api.reconcile())
  const invoices = useAsync(() => api.listInvoices())
  const customers = useAsync(() => api.listCustomers())

  const unpaid = invoices.data?.filter((i) => i.status === 'unpaid').length
  const dash = '—'

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Dashboard" subtitle="Overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Payments"
          value={
            recon.data
              ? formatMoney(recon.data.total_settled_minor, 'BDT')
              : dash
          }
        />
        <StatCard
          label="Pending Payments"
          value={recon.data ? recon.data.pending_charges : dash}
        />
        <StatCard label="Unpaid Invoices" value={unpaid ?? dash} />
        <StatCard label="Customers" value={customers.data?.length ?? dash} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="text-sm font-medium">Transaction Statistics</div>
          <div className="flex h-48 items-center justify-center text-sm text-muted">
            No chart data yet
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium">Gateway Statistics</div>
          <div className="flex h-48 items-center justify-center text-sm text-muted">
            No chart data yet
          </div>
        </Card>
      </div>
    </div>
  )
}
