// SpritEXAI Pay — Staff Management.
// Mohammad Sijan (SpritexAI).

import { Button, Card } from '../ui'
import { PageHeader } from './_shared'

export default function Staff() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Staff Management"
        // ponytail: no handler, single-admin auth today
        action={
          <Button disabled className="pointer-events-none">
            Create Staff
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="text-base font-medium">Team access</div>
        <p className="max-w-sm text-sm text-muted">
          Multi-user staff accounts are coming with the cloud release. This instance
          uses a single admin login.
        </p>
      </Card>
    </div>
  )
}
