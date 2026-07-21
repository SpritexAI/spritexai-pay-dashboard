// SpritEXAI Pay — dashboard shell (sidebar + topbar + footer).
// Mohammad Sijan (SpritexAI). Grouped left nav, brand mark, a compact topbar with
// the active-brand chip and the admin avatar, a quiet footer.

import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { token } from './api'

type NavItem = { to: string; label: string; icon: ReactNode; end?: boolean }
type NavGroup = { heading?: string; items: NavItem[] }

// Inline stroke icons (no icon dependency) — 20px, currentColor.
const I = (d: string) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    {d.split('|').map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
)

const NAV: NavGroup[] = [
  {
    items: [
      { to: '/', label: 'Dashboard', end: true, icon: I('M5 12l-2 0l9 -9l9 9l-2 0|M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7|M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6') },
      { to: '/reports', label: 'Reports', icon: I('M3 3v18h18|M20 9l-6 6l-4 -4l-4 4') },
      { to: '/gateways', label: 'Gateways', icon: I('M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z|M3 10h18|M7 15h.01|M11 15h2') },
      { to: '/customers', label: 'Customers', icon: I('M9 7a3 3 0 1 0 0 6a3 3 0 0 0 0 -6|M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2|M16 3.13a4 4 0 0 1 0 7.75|M21 21v-2a4 4 0 0 0 -3 -3.85') },
      { to: '/transactions', label: 'Transactions', icon: I('M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1|M3 10h18|M7 15h2') },
      { to: '/invoices', label: 'Invoice', icon: I('M5 3h14a1 1 0 0 1 1 1v17l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2v-17a1 1 0 0 1 1 -1|M9 7h6|M9 11h6|M9 15h4') },
      { to: '/payment-links', label: 'Payment Link', icon: I('M9 15l6 -6|M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464|M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463') },
    ],
  },
  {
    heading: 'Appearance',
    items: [
      { to: '/brand-settings', label: 'Brand Settings', icon: I('M4 4h6v6h-6z|M14 4h6v6h-6z|M4 14h6v6h-6z|M14 14h6v6h-6z') },
    ],
  },
  {
    heading: 'MFS Automation',
    items: [
      { to: '/sms-data', label: 'SMS Data', icon: I('M8 9h8|M8 13h6|M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1') },
      { to: '/devices', label: 'Devices', icon: I('M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14|M11 4h2|M12 17v.01') },
    ],
  },
  {
    heading: 'Administration',
    items: [
      { to: '/addons', label: 'Addons', icon: I('M12 3l0 6|M12 15l0 6|M3 12l6 0|M15 12l6 0|M7 7l3 3|M14 14l3 3|M17 7l-3 3|M10 14l-3 3') },
      { to: '/domains', label: 'Domains', icon: I('M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0|M3.6 9h16.8|M3.6 15h16.8|M11.5 3a17 17 0 0 0 0 18|M12.5 3a17 17 0 0 1 0 18') },
      { to: '/api-keys', label: 'API Keys', icon: I('M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.977a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.977a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0|M15 9h.01') },
      { to: '/staff', label: 'Staff Management', icon: I('M12 7a3 3 0 1 0 0 6a3 3 0 0 0 0 -6|M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2') },
      { to: '/system-settings', label: 'System Settings', icon: I('M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065|M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0') },
      { to: '/activities', label: 'Activities', icon: I('M3 12h4l3 8l4 -16l3 8h4') },
    ],
  },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-canvas text-fg">
      {/* Topbar */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-5">
        <div className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
            S
          </span>
          SpritEXAI <span className="text-accent">Pay</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 sm:flex">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-fg text-xs font-semibold text-canvas">
              R
            </span>
            <div className="leading-tight">
              <div className="text-sm font-medium">RexiO</div>
              <div className="text-[11px] text-muted">Active brand</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-xs font-semibold">
              SI
            </span>
            <div className="hidden leading-tight sm:block">
              <div className="text-sm font-medium">Sijan</div>
              <div className="text-[11px] text-muted">Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed inset-y-0 top-16 z-10 flex w-60 flex-col overflow-y-auto border-r border-border bg-surface px-3 py-5">
        <nav className="flex flex-col gap-6">
          {NAV.map((group, gi) => (
            <div key={gi}>
              {group.heading && (
                <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {group.heading}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-accent/10 font-medium text-accent'
                          : 'text-muted hover:bg-surface-2 hover:text-fg'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {token.get() && (
          <button
            onClick={() => {
              token.clear()
              location.reload()
            }}
            className="mt-6 px-3 text-left text-sm text-muted hover:text-fg"
          >
            Sign out
          </button>
        )}
      </aside>

      {/* Content */}
      <main className="ml-60 px-8 pb-16 pt-24">
        <div className="mx-auto max-w-6xl">{children}</div>
        <footer className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-border pt-5 text-xs text-muted">
          <span>© 2026 SpritEXAI Pay · Built by Mohammad Sijan (SpritexAI · RexiO)</span>
          <span className="flex gap-4">
            <span>v1.0</span>
          </span>
        </footer>
      </main>
    </div>
  )
}
