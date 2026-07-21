// SpritEXAI Pay — shared UI primitives.
// Mohammad Sijan (SpritexAI). Small, composable, unopinionated building blocks.

import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-border bg-surface ${className}`}
    >
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <Card className="p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight tnum">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </Card>
  )
}

const STATUS_STYLES: Record<string, string> = {
  paid: 'text-positive bg-positive/10',
  active: 'text-positive bg-positive/10',
  pending: 'text-warning bg-warning/10',
  failed: 'text-danger bg-danger/10',
  revoked: 'text-danger bg-danger/10',
  expired: 'text-muted bg-surface-2',
}

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'text-muted bg-surface-2'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-accent-fg hover:opacity-90'
      : 'border border-border text-fg hover:bg-surface-2'
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <input
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none placeholder:text-muted/60 focus:border-accent"
        {...props}
      />
    </label>
  )
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[13px] text-muted">{children}</span>
}

// A boxed data table matching the admin list layout: optional filter tabs, a
// search box, the table itself, and a friendly empty state. Purely presentational
// — the page owns fetching/filtering and passes rows in.
export function DataTable({
  columns,
  children,
  tabs,
  activeTab,
  onTab,
  search,
  onSearch,
  empty = true,
  emptyLabel = 'Nothing here yet',
  count,
}: {
  columns: string[]
  children: ReactNode
  tabs?: string[]
  activeTab?: string
  onTab?: (t: string) => void
  search?: string
  onSearch?: (s: string) => void
  empty?: boolean
  emptyLabel?: string
  count?: number
}) {
  return (
    <div>
      {tabs && tabs.length > 0 && (
        <div className="mb-5 flex justify-center">
          <div className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => onTab?.(t)}
                className={`rounded-lg px-4 py-1.5 text-sm transition-colors ${
                  activeTab === t
                    ? 'bg-accent/10 font-medium text-accent'
                    : 'text-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="text-sm text-muted">
            {count != null ? `${count} ${count === 1 ? 'entry' : 'entries'}` : ''}
          </div>
          {onSearch && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Search</span>
              <input
                value={search ?? ''}
                onChange={(e) => onSearch(e.target.value)}
                className="w-56 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
                placeholder="Search…"
              />
            </div>
          )}
        </div>

        {empty ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted/50"
            >
              <path d="M9 10h.01M15 10h.01M9.5 15.25a3.5 3.5 0 0 1 5 0" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <div className="text-sm font-medium">{emptyLabel}</div>
            <div className="text-xs text-muted">No data is available at the moment.</div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                {columns.map((c) => (
                  <th key={c} className="px-5 py-3 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
