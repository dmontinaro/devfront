import { describe, expect, it } from 'vitest'

import {
  applyMissionReward,
  beginMission,
  completeMission,
  createInitialWorldState,
  missionIds,
  restoreWorldProgress,
  submitMissionEvidence,
} from './world'

describe('world progress', () => {
  it('moves one mission through work, reward, and transformation', () => {
    const started = beginMission(createInitialWorldState(), 'secure-auth-flow')
    const submitted = submitMissionEvidence(started)
    const completed = applyMissionReward(submitted)

    expect(started.activeMissionId).toBe('secure-auth-flow')
    expect(submitted.phase).toBe('reward')
    expect(completed.activeMissionId).toBeNull()
    expect(completed.completedMissionIds).toEqual(['secure-auth-flow'])
    expect(completed.domainProgress.stability).toBe(18)
    expect(completed.skillXp.Testing).toBe(24)
    expect(completed.resources['Flux Core']).toBe(1)
  })

  it('does not reward the same mission twice', () => {
    const completed = completeMission(
      createInitialWorldState(),
      'secure-auth-flow',
    )

    expect(completeMission(completed, 'secure-auth-flow')).toEqual(completed)
  })

  it('reaches the same totals in every mission order', () => {
    const missionOrders = permutations([...missionIds])
    const outcomes = missionOrders.map((order) =>
      order.reduce(completeMission, createInitialWorldState()),
    )

    for (const outcome of outcomes) {
      expect(outcome.domainProgress.stability).toBe(33)
      expect(outcome.domainProgress.trust).toBe(10)
      expect(outcome.completedMissionIds).toHaveLength(3)
      expect(Object.values(outcome.resources)).toEqual([1, 1, 1])
    }
  })

  it('restores only valid, unique completed missions', () => {
    const restored = restoreWorldProgress({
      version: 1,
      completedMissionIds: ['stabilize-ci', 'unknown-mission', 'stabilize-ci'],
    })

    expect(restored.completedMissionIds).toEqual(['stabilize-ci'])
    expect(restored.domainProgress.stability).toBe(15)
  })
})

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) {
    return [[...values]]
  }

  return values.flatMap((value, index) =>
    permutations(
      values.filter((_, candidateIndex) => candidateIndex !== index),
    ).map((remaining) => [value, ...remaining]),
  )
}
