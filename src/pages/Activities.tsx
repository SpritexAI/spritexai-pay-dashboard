// SpritEXAI Pay — Activities.
// Mohammad Sijan (SpritexAI).

import { useState } from 'react'
import { api } from '../api'
import { useAsync } from '../useAsync'
import { DataTable, Mono } from '../ui'
import { PageHeader } from './_shared'

export default function Activities() {
  const list = useAsync(() => api.listActivities())
  const [search, setSearch] = useState('')

  const rows = (list.data ?? []).filter((a) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return a.action.toLowerCase().includes(q) || a.entity.toLowerCase().includes(q)
  })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Activities" subtitle="Audit log of admin actions" />

      {list.loading && <div className="text-sm text-muted">Loading… —</div>}
      {list.error && <div className="text-sm text-danger">{list.error}</div>}

      {list.data && (
        <DataTable
          columns={['Action', 'Entity', 'Actor', 'Detail', 'Date']}
          search={search}
          onSearch={setSearch}
          count={rows.length}
          empty={rows.length === 0}
          emptyLabel="No activity yet"
        >
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-border/50 last:border-0">
              <td className="px-5 py-3 font-medium">{a.action}</td>
              <td className="px-5 py-3">
                {a.entity} <Mono>{a.entity_id}</Mono>
              </td>
              <td className="px-5 py-3">{a.actor}</td>
              <td className="px-5 py-3 text-muted">{a.detail ?? '—'}</td>
              <td className="px-5 py-3 text-muted">{a.created_at}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  )
}
