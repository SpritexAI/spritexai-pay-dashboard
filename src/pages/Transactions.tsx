// SpritEXAI Pay — Transactions.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, formatMoney, type Charge } from '../api'
import { useAsync } from '../useAsync'
import { DataTable, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

const TABS = ['All', 'Completed', 'Pending', 'Refunded', 'Canceled']

// Charge status → tab label. Refunded has no charge status yet, so it never matches.
const STATUS_TAB: Record<Charge['status'], string> = {
  paid: 'Completed',
  pending: 'Pending',
  failed: 'Canceled',
  expired: 'Canceled',
}

export default function Transactions() {
  const list = useAsync(() => api.listCharges())
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')

  const rows = (list.data ?? []).filter((c) => {
    if (tab !== 'All' && STATUS_TAB[c.status] !== tab) return false
    if (q) {
      const hay = `${c.customer_name ?? ''} ${c.order_id}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Transactions" subtitle="All charges across gateways" />

      <DataTable
        columns={['Customer', 'Gateway', 'Amount', 'Transaction ID', 'Date', 'Status']}
        tabs={TABS}
        activeTab={tab}
        onTab={setTab}
        search={q}
        onSearch={setQ}
        count={rows.length}
        empty={rows.length === 0}
        emptyLabel="No transactions found"
      >
        {rows.map((c) => (
          <tr key={c.id} className="border-b border-border/50 last:border-0">
            <td className="px-5 py-3">{c.customer_name ?? '—'}</td>
            <td className="px-5 py-3 capitalize">—</td>
            <td className="px-5 py-3 tnum">{formatMoney(c.amount_minor, c.currency)}</td>
            <td className="px-5 py-3">
              <Mono>{c.order_id}</Mono>
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
