// SpritEXAI Pay — Brand Settings.
// Mohammad Sijan (SpritexAI).

import { useEffect, useState } from 'react'
import { api } from '../api'
import { useAsync } from '../useAsync'
import { Button, Card, Field } from '../ui'
import { PageHeader } from './_shared'

const HUB = [
  { title: 'General Setting', desc: 'Store name, contact, and defaults' },
  { title: 'API Settings', desc: 'Keys and integration endpoints' },
  { title: 'Themes', desc: 'Colors and dashboard appearance' },
  { title: 'Currency Settings', desc: 'Display currency and formatting' },
]

// Only these three keys are editable here; the rest of the brand group is untouched.
const FIELDS = [
  { key: 'brand.name', label: 'Brand name', placeholder: 'SpritEXAI Pay' },
  { key: 'brand.color_primary', label: 'Primary color', placeholder: '#4f46e5' },
  { key: 'brand.currency', label: 'Currency', placeholder: 'BDT' },
]

export default function BrandSettings() {
  const settings = useAsync(() => api.getSettings('brand'))
  const [values, setValues] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  // Seed the form once settings land; remember the original to detect changes.
  const [initial, setInitial] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!settings.data) return
    const seed: Record<string, string> = {}
    for (const s of settings.data) seed[s.key] = s.value ?? ''
    setValues(seed)
    setInitial(seed)
  }, [settings.data])

  async function onSave() {
    setBusy(true)
    setMsg(null)
    setErr(null)
    try {
      const changed = FIELDS.filter((f) => (values[f.key] ?? '') !== (initial[f.key] ?? ''))
      for (const f of changed) await api.setSetting(f.key, values[f.key] ?? '')
      setInitial({ ...initial, ...Object.fromEntries(changed.map((f) => [f.key, values[f.key] ?? ''])) })
      setMsg(changed.length ? `Saved ${changed.length} setting${changed.length === 1 ? '' : 's'}.` : 'No changes to save.')
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Brand Settings" subtitle="Store identity and appearance" />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HUB.map((h) => (
          <Card key={h.title} className="p-5">
            <div className="text-sm font-medium">{h.title}</div>
            <div className="mt-1 text-xs text-muted">{h.desc}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-4 text-sm font-medium">Brand</div>

        {settings.loading && <div className="text-sm text-muted">Loading… —</div>}
        {settings.error && <div className="text-sm text-danger">{settings.error}</div>}

        {settings.data && (
          <div className="space-y-4">
            {FIELDS.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                value={values[f.key] ?? ''}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            ))}
            <Button onClick={onSave} disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </Button>
            {msg && <p className="text-sm text-positive">{msg}</p>}
            {err && <p className="text-sm text-danger">{err}</p>}
          </div>
        )}
      </Card>
    </div>
  )
}
