export const missionIds = [
  'secure-auth-flow',
  'stabilize-ci',
  'review-pull-request',
] as const

export type MissionId = (typeof missionIds)[number]
export type WorldDomain =
  'build' | 'stability' | 'knowledge' | 'trust' | 'automation'
export type MissionPhase = 'work' | 'reward'

export interface MissionDefinition {
  id: MissionId
  title: string
  domain: WorldDomain
  skill: string
  duration: string
  summary: string
  evidence: string
  reward: {
    domainProgress: number
    skillXp: number
    resource: string
  }
  transformation: {
    elementId: 'shield-tower' | 'power-relay' | 'signal-beacon'
    elementName: string
    result: string
  }
}

export interface WorldState {
  activeMissionId: MissionId | null
  phase: MissionPhase
  completedMissionIds: readonly MissionId[]
  domainProgress: Readonly<Record<WorldDomain, number>>
  skillXp: Readonly<Record<string, number>>
  resources: Readonly<Record<string, number>>
}

export const missionDefinitions: Readonly<
  Record<MissionId, MissionDefinition>
> = {
  'secure-auth-flow': {
    id: 'secure-auth-flow',
    title: 'Secure the auth flow with an E2E test',
    domain: 'stability',
    skill: 'Testing',
    duration: '60–90 min',
    summary: 'Protect the most important sign-in path with browser coverage.',
    evidence: 'A passing end-to-end check covering the critical auth path.',
    reward: {
      domainProgress: 18,
      skillXp: 24,
      resource: 'Flux Core',
    },
    transformation: {
      elementId: 'shield-tower',
      elementName: 'Shield Tower',
      result: 'The frontier shield comes online.',
    },
  },
  'stabilize-ci': {
    id: 'stabilize-ci',
    title: 'Investigate a flaky CI step',
    domain: 'stability',
    skill: 'Debugging',
    duration: '1–2 h',
    summary: 'Find the cause of an unreliable build and make the check stable.',
    evidence: 'A recorded cause and a stable CI run after the fix.',
    reward: {
      domainProgress: 15,
      skillXp: 20,
      resource: 'Energy Cell',
    },
    transformation: {
      elementId: 'power-relay',
      elementName: 'Power Relay',
      result: 'Energy reaches the frontier again.',
    },
  },
  'review-pull-request': {
    id: 'review-pull-request',
    title: 'Review an open pull request',
    domain: 'trust',
    skill: 'Review',
    duration: '30–45 min',
    summary: 'Help another developer ship safer work with useful feedback.',
    evidence: 'A completed review with at least one actionable observation.',
    reward: {
      domainProgress: 10,
      skillXp: 16,
      resource: 'Signal Token',
    },
    transformation: {
      elementId: 'signal-beacon',
      elementName: 'Signal Beacon',
      result: 'The northern route becomes visible.',
    },
  },
}

const emptyDomainProgress: Record<WorldDomain, number> = {
  build: 0,
  stability: 0,
  knowledge: 0,
  trust: 0,
  automation: 0,
}

export function createInitialWorldState(): WorldState {
  return {
    activeMissionId: null,
    phase: 'work',
    completedMissionIds: [],
    domainProgress: { ...emptyDomainProgress },
    skillXp: {},
    resources: {},
  }
}

export function beginMission(
  state: WorldState,
  missionId: MissionId,
): WorldState {
  if (state.activeMissionId || state.completedMissionIds.includes(missionId)) {
    return state
  }

  return {
    ...state,
    activeMissionId: missionId,
    phase: 'work',
  }
}

export function submitMissionEvidence(state: WorldState): WorldState {
  if (!state.activeMissionId || state.phase !== 'work') {
    return state
  }

  return {
    ...state,
    phase: 'reward',
  }
}

export function applyMissionReward(state: WorldState): WorldState {
  if (!state.activeMissionId || state.phase !== 'reward') {
    return state
  }

  const mission = missionDefinitions[state.activeMissionId]

  return {
    activeMissionId: null,
    phase: 'work',
    completedMissionIds: [...state.completedMissionIds, mission.id],
    domainProgress: {
      ...state.domainProgress,
      [mission.domain]:
        state.domainProgress[mission.domain] + mission.reward.domainProgress,
    },
    skillXp: {
      ...state.skillXp,
      [mission.skill]:
        (state.skillXp[mission.skill] ?? 0) + mission.reward.skillXp,
    },
    resources: {
      ...state.resources,
      [mission.reward.resource]:
        (state.resources[mission.reward.resource] ?? 0) + 1,
    },
  }
}

export function completeMission(
  state: WorldState,
  missionId: MissionId,
): WorldState {
  return applyMissionReward(
    submitMissionEvidence(beginMission(state, missionId)),
  )
}

export function restoreWorldProgress(value: unknown): WorldState {
  if (!isRecord(value) || value.version !== 1) {
    return createInitialWorldState()
  }

  const completedMissionIds = value.completedMissionIds
  if (!Array.isArray(completedMissionIds)) {
    return createInitialWorldState()
  }

  const uniqueMissionIds = completedMissionIds.filter(
    (missionId, index): missionId is MissionId =>
      isMissionId(missionId) &&
      completedMissionIds.indexOf(missionId) === index,
  )

  return uniqueMissionIds.reduce(completeMission, createInitialWorldState())
}

export function serializeWorldProgress(state: WorldState): string {
  return JSON.stringify({
    version: 1,
    completedMissionIds: state.completedMissionIds,
  })
}

function isMissionId(value: unknown): value is MissionId {
  return typeof value === 'string' && missionIds.some((id) => id === value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
