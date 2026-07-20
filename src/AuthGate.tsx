// SpritEXAI Pay — auth gate + login screen.
// Mohammad Sijan (SpritexAI).
//
// On mount we ask the engine whether login is required. If it is and we have no
// (or an invalid) token, the whole console is replaced by the login screen. A
// valid token lets the app through; a 401 anywhere clears it and bounces back.

import { useEffect, useState, type ReactNode } from 'react'
import { api, token } from './api'
import { Button, Card } from './ui'

type Phase = 'checking' | 'login' | 'ready'

export default function AuthGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('checking')

  useEffect(() => {
    api
      .authStatus()
      .then((s) => setPhase(!s.auth_required || token.get() ? 'ready' : 'login'))
      // If we can't even reach the status endpoint, let the app render and show
      // its own connection error rather than trapping the user on a blank gate.
      .catch(() => setPhase('ready'))
  }, [])

  if (phase === 'checking') {
    return (
      <div className="grid min-h-svh place-items-center text-sm text-muted">
        Loading…
      </div>
    )
  }
  if (phase === 'login') {
    return <Login onSuccess={() => setPhase('ready')} />
  }
  return <>{children}</>
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      const { token: t } = await api.login(password)
      token.set(t)
      onSuccess()
    } catch {
      setErr('Incorrect password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-svh place-items-center bg-canvas px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="text-[15px] font-semibold tracking-tight">
          SpritEXAI <span className="text-accent">Pay</span>
        </div>
        <div className="mt-1 text-sm text-muted">Sign in to the merchant console</div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Admin password</span>
            <input
              type="password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
            />
          </label>
          <Button type="submit" disabled={busy || !password} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          {err && <p className="text-sm text-danger">{err}</p>}
        </form>
      </Card>
    </div>
  )
}
