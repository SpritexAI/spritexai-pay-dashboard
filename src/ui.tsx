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
