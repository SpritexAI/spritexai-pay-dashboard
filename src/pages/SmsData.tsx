// SpritEXAI Pay — SMS Data: the raw payment SMS the forwarder captured, and
// whether each one matched a charge.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api, formatMoney } from '../api'
import { useAsync } from '../useAsync'
import { DataTable, Mono, StatusBadge } from '../ui'
import { PageHeader } from './_shared'

const TABS = ['All', 'Matched', 'Unmatched']

export default function SmsData() {
  const list = useAsync(() => api.listSmsEvents())
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')

  const events = list.data ?? []
  const q = search.trim().toLowerCase()
  const filtered = events.filter((s) => {
    if (tab === 'Matched' && !s.matched) return false
    if (tab === 'Unmatched' && s.matched) return false
    if (!q) return true
    return (
      s.txn_id.toLowerCase().includes(q) ||
      (s.sender_msisdn ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="SMS Data"
        subtitle="Payment SMS captured by the forwarder and their match status"
      />

      <DataTable
        columns={[
          'Gateway',
          'Type',
          'Mobile Number',
          'Transaction ID',
          'Amount',
          'Status',
          'Date',
        ]}
        tabs={TABS}
        activeTab={tab}
        onTab={setTab}
        search={search}
        onSearch={setSearch}
        count={filtered.length}
        empty={filtered.length === 0}
        emptyLabel={list.error ?? (list.loading ? 'Loading…' : 'No SMS events yet')}
      >
        {filtered.map((s) => (
          <tr key={s.id} className="border-b border-border/50 last:border-0">
            <td className="px-5 py-3 capitalize">{s.gateway}</td>
            <td className="px-5 py-3">Payment</td>
            <td className="px-5 py-3">{s.sender_msisdn ?? '—'}</td>
            <td className="px-5 py-3">
              <Mono>{s.txn_id}</Mono>
            </td>
            <td className="px-5 py-3 tnum">{formatMoney(s.amount_minor)}</td>
            <td className="px-5 py-3">
              <StatusBadge status={s.matched ? 'active' : 'pending'} />
            </td>
            <td className="px-5 py-3 text-muted">
              {new Date(s.received_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
