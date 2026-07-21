// SpritEXAI Pay — Addons.
// Mohammad Sijan (SpritexAI).

import { Button, Card } from '../ui'
import { PageHeader } from './_shared'

export default function Addons() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Addons"
        // ponytail: no handler, feature not built
        action={
          <Button disabled className="pointer-events-none">
            New Addon
          </Button>
        }
      />

      <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-2 text-accent">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M17.5 14v7M14 17.5h7" />
          </svg>
        </div>
        <div className="text-base font-medium">Add-ons marketplace</div>
        <p className="max-w-sm text-sm text-muted">
          Plugin add-ons are coming in a future release.
        </p>
      </Card>
    </div>
  )
}
