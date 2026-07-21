// SpritEXAI Pay — System Settings.
// Mohammad Sijan (SpritexAI).

import type { ReactNode } from 'react'
import { Card } from '../ui'
import { PageHeader } from './_shared'

// Informational hub — each of these is managed via config on a self-host, so
// there's nothing to fetch or mutate from the dashboard.
const ITEMS: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: 'General Setting',
    desc: 'Core engine defaults and runtime flags',
    icon: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />,
  },
  {
    title: 'Cron Job',
    desc: 'Scheduled reconciliation and cleanup runs',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  },
  {
    title: 'Update',
    desc: 'Engine version and release channel',
    icon: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></>,
  },
  {
    title: 'Import',
    desc: 'Bulk data import and migration',
    icon: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  },
]

export default function SystemSettings() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="System Settings" subtitle="All Settings" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ITEMS.map((it) => (
          <Card key={it.title} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {it.icon}
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">{it.title}</div>
                <div className="mt-1 text-xs text-muted">{it.desc}</div>
                <div className="mt-2 text-xs text-muted/70">
                  Configured via environment / not applicable to self-host
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
