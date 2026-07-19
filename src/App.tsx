// SpritEXAI Pay — dashboard shell.
// Mohammad Sijan (SpritexAI).

import { NavLink, Route, Routes } from 'react-router-dom'
import Overview from './pages/Overview'
import Charges from './pages/Charges'
import Devices from './pages/Devices'
import Gateways from './pages/Gateways'

const NAV = [
  { to: '/', label: 'Overview', end: true },
  { to: '/charges', label: 'Charges' },
  { to: '/devices', label: 'Devices' },
  { to: '/gateways', label: 'Gateways' },
]

export default function App() {
  return (
    <div className="flex min-h-svh">
      <aside className="fixed inset-y-0 flex w-60 flex-col border-r border-border bg-surface px-4 py-6">
        <div className="px-2">
          <div className="text-[15px] font-semibold tracking-tight">
            SpritEXAI <span className="text-accent">Pay</span>
          </div>
          <div className="mt-0.5 text-xs text-muted">Merchant console</div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-surface-2 text-fg'
                    : 'text-muted hover:text-fg hover:bg-surface-2/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-3 text-xs text-muted">
          Built by Mohammad Sijan
          <div className="text-muted/60">SpritexAI · RexiO</div>
        </div>
      </aside>

      <main className="ml-60 flex-1 px-10 py-8">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/charges" element={<Charges />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/gateways" element={<Gateways />} />
        </Routes>
      </main>
    </div>
  )
}
