import { useEffect, useReducer, useState } from 'react'

import {
  applyMissionReward,
  beginMission,
  createInitialWorldState,
  missionDefinitions,
  missionIds,
  restoreWorldProgress,
  serializeWorldProgress,
  submitMissionEvidence,
} from '#/domain/world'
import type { MissionId, WorldState } from '#/domain/world'

const storageKey = 'devfront.world-progress.v1'

type WorldAction =
  | { type: 'restore'; state: WorldState }
  | { type: 'begin'; missionId: MissionId }
  | { type: 'submit' }
  | { type: 'apply-reward' }
  | { type: 'reset' }

export function WorldHome() {
  const [state, dispatch] = useReducer(
    worldReducer,
    undefined,
    createInitialWorldState,
  )
  const [hasRestored, setHasRestored] = useState(false)

  useEffect(() => {
    const storedProgress = window.localStorage.getItem(storageKey)

    if (storedProgress) {
      try {
        dispatch({
          type: 'restore',
          state: restoreWorldProgress(JSON.parse(storedProgress)),
        })
      } catch {
        window.localStorage.removeItem(storageKey)
      }
    }

    setHasRestored(true)
  }, [])

  useEffect(() => {
    if (hasRestored) {
      window.localStorage.setItem(storageKey, serializeWorldProgress(state))
    }
  }, [hasRestored, state])

  const activeMission = state.activeMissionId
    ? missionDefinitions[state.activeMissionId]
    : null
  const completedCount = state.completedMissionIds.length
  const goalComplete = completedCount === missionIds.length

  function resetProgress() {
    if (window.confirm('Reset this world and remove local progress?')) {
      dispatch({ type: 'reset' })
    }
  }

  return (
    <main className="world-shell">
      <header className="topbar">
        <a className="brand" href="#world" aria-label="devfront world home">
          <span className="brand-mark" aria-hidden="true">
            df
          </span>
          <span>devfront</span>
        </a>
        <div className="topbar-status">
          <span className="status-dot" aria-hidden="true" />
          Local world
        </div>
      </header>

      <section className="world-layout" id="world" aria-label="World home">
        <WorldViewport state={state} />

        <aside className="mission-console" aria-label="Mission console">
          <div className="console-header">
            <span className="eyebrow">World goal</span>
            <span className="sector-code">FRONTIER / 01</span>
          </div>

          <section className={`goal-card ${goalComplete ? 'is-complete' : ''}`}>
            <div>
              <span className="goal-state">
                {goalComplete ? 'Goal complete' : 'Active objective'}
              </span>
              <h1>
                {goalComplete
                  ? 'Connect the Northern Archive'
                  : 'Stabilize the Frontier'}
              </h1>
            </div>
            <p>
              {goalComplete
                ? 'The frontier is stable. A route to the archive is now available.'
                : 'Complete real work to restore the systems around the Command Core.'}
            </p>
            <div className="goal-progress-row">
              <span>{completedCount} / 3 systems online</span>
              <span>{Math.round((completedCount / 3) * 100)}%</span>
            </div>
            <div
              className="goal-progress"
              role="progressbar"
              aria-label="World goal progress"
              aria-valuemin={0}
              aria-valuemax={3}
              aria-valuenow={completedCount}
            >
              <span style={{ width: `${(completedCount / 3) * 100}%` }} />
            </div>
          </section>

          {activeMission ? (
            <ActiveMission
              missionId={activeMission.id}
              phase={state.phase}
              onSubmit={() => dispatch({ type: 'submit' })}
              onApplyReward={() => dispatch({ type: 'apply-reward' })}
            />
          ) : (
            <MissionList
              state={state}
              onBegin={(missionId) => dispatch({ type: 'begin', missionId })}
            />
          )}

          <footer className="console-footer">
            <div>
              <span>{state.domainProgress.stability} Stability</span>
              <span>{state.domainProgress.trust} Trust</span>
            </div>
            {completedCount > 0 ? (
              <button
                className="reset-button"
                type="button"
                onClick={resetProgress}
              >
                Reset world
              </button>
            ) : null}
          </footer>
        </aside>
      </section>
    </main>
  )
}

function MissionList({
  state,
  onBegin,
}: Readonly<{
  state: WorldState
  onBegin: (missionId: MissionId) => void
}>) {
  return (
    <section className="mission-list" aria-labelledby="mission-list-title">
      <div className="section-heading">
        <span className="eyebrow" id="mission-list-title">
          Available missions
        </span>
        <span>
          {missionIds.length - state.completedMissionIds.length} remaining
        </span>
      </div>

      {missionIds.map((missionId) => {
        const mission = missionDefinitions[missionId]
        const isComplete = state.completedMissionIds.includes(missionId)

        return (
          <article
            className={`mission-card ${isComplete ? 'is-complete' : ''}`}
            key={missionId}
          >
            <div className="mission-meta">
              <span>{mission.domain}</span>
              <span>{mission.duration}</span>
            </div>
            <h2>{mission.title}</h2>
            <p>{mission.summary}</p>
            <div className="mission-reward-preview">
              <span>
                +{mission.reward.domainProgress} {mission.domain}
              </span>
              <span>{mission.reward.resource}</span>
            </div>
            <button
              className="mission-action"
              type="button"
              disabled={isComplete}
              onClick={() => onBegin(missionId)}
            >
              {isComplete ? 'System online' : 'Start mission'}
            </button>
          </article>
        )
      })}
    </section>
  )
}

function ActiveMission({
  missionId,
  phase,
  onSubmit,
  onApplyReward,
}: Readonly<{
  missionId: MissionId
  phase: WorldState['phase']
  onSubmit: () => void
  onApplyReward: () => void
}>) {
  const mission = missionDefinitions[missionId]

  if (phase === 'reward') {
    return (
      <section className="active-mission reward-step" aria-live="polite">
        <span className="eyebrow">Reward ready</span>
        <h2>Work accepted</h2>
        <p>Your completed work will change the world.</p>
        <dl className="reward-grid">
          <div>
            <dt>Domain progress</dt>
            <dd>
              +{mission.reward.domainProgress} {mission.domain}
            </dd>
          </div>
          <div>
            <dt>Skill XP</dt>
            <dd>
              +{mission.reward.skillXp} {mission.skill}
            </dd>
          </div>
          <div>
            <dt>Resource</dt>
            <dd>1 {mission.reward.resource}</dd>
          </div>
          <div>
            <dt>World change</dt>
            <dd>{mission.transformation.elementName}</dd>
          </div>
        </dl>
        <button
          className="primary-action"
          type="button"
          onClick={onApplyReward}
        >
          Apply reward to world
        </button>
      </section>
    )
  }

  return (
    <section className="active-mission">
      <span className="eyebrow">Mission active</span>
      <h2>{mission.title}</h2>
      <p>{mission.summary}</p>
      <div className="evidence-panel">
        <span className="evidence-label">Required evidence</span>
        <p>{mission.evidence}</p>
        <div className="evidence-status">
          <span className="status-dot" aria-hidden="true" />
          Ready for manual submission
        </div>
      </div>
      <button className="primary-action" type="button" onClick={onSubmit}>
        Submit completed work
      </button>
    </section>
  )
}

function WorldViewport({ state }: Readonly<{ state: WorldState }>) {
  const completed = new Set(state.completedMissionIds)

  return (
    <section className="world-viewport" aria-label="Frontier world view">
      <div className="world-grid" aria-hidden="true" />
      <div className="world-horizon" aria-hidden="true" />
      <div className="world-label">
        <span className="eyebrow">Personal world</span>
        <strong>Frontier Sector</strong>
      </div>

      <div className="route route-shield" aria-hidden="true" />
      <div className="route route-power" aria-hidden="true" />
      <div className="route route-signal" aria-hidden="true" />

      <WorldElement
        className="command-core"
        label="Command Core"
        state="online"
      />
      <WorldElement
        className="shield-tower"
        label="Shield Tower"
        state={completed.has('secure-auth-flow') ? 'online' : 'offline'}
      />
      <WorldElement
        className="power-relay"
        label="Power Relay"
        state={completed.has('stabilize-ci') ? 'online' : 'offline'}
      />
      <WorldElement
        className="signal-beacon"
        label="Signal Beacon"
        state={completed.has('review-pull-request') ? 'online' : 'offline'}
      />

      <div className="world-readout" aria-live="polite">
        <span>{state.completedMissionIds.length} transformations</span>
        <strong>
          {state.completedMissionIds.length === 3
            ? 'Northern route unlocked'
            : 'Frontier restoration in progress'}
        </strong>
      </div>
    </section>
  )
}

function WorldElement({
  className,
  label,
  state,
}: Readonly<{
  className: string
  label: string
  state: 'online' | 'offline'
}>) {
  return (
    <div className={`world-element ${className} is-${state}`}>
      <div className="element-structure" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="element-label">
        <strong>{label}</strong>
        <span>{state}</span>
      </div>
    </div>
  )
}

function worldReducer(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case 'restore':
      return action.state
    case 'begin':
      return beginMission(state, action.missionId)
    case 'submit':
      return submitMissionEvidence(state)
    case 'apply-reward':
      return applyMissionReward(state)
    case 'reset':
      return createInitialWorldState()
  }
}
