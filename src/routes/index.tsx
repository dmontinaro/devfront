import { createFileRoute } from '@tanstack/react-router'

import { WorldHome } from '#/world/WorldHome'

export const Route = createFileRoute('/')({
  component: WorldHome,
})
