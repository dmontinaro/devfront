# Devfront core loop

This context describes how real development work changes a player's world. It keeps product language stable before persistence, APIs, and UI make the terms expensive to change.

## Language

**Player**:
A person whose verified work shapes a personal world.
_Avoid_: User, account, developer

**World goal**:
A named outcome that the player advances through mission completions.
_Avoid_: Quest line, milestone

**Mission definition**:
A versioned description of a real unit of work, its evidence requirements, reward basis, and intended world change.
_Avoid_: Task, ticket, quest

**Mission attempt**:
A player's accepted instance of one mission definition version.
_Avoid_: Mission, run, assignment

**Evidence submission**:
A claim and its supporting references submitted for one mission attempt.
_Avoid_: Proof, completion

**GitHub evidence**:
Evidence that points to an independently observable GitHub object or signal.
_Avoid_: Automatic evidence, public evidence

**Manual evidence**:
A player's account of private or otherwise non-observable work, with optional supporting references.
_Avoid_: Unverified evidence, weak evidence

**Verification decision**:
An accepted or rejected judgment about one evidence submission, including who or what made the judgment.
_Avoid_: Verification, approval

**Mission completion**:
The immutable record created when one verification decision accepts the evidence for a mission attempt.
_Avoid_: Evidence, reward, finished mission

**Reward grant**:
The auditable award issued once for a mission completion. It records the calculation inputs and exact outputs.
_Avoid_: Reward, payout

**Domain progress**:
Measured progress in Build, Stability, Knowledge, Trust, or Automation.
_Avoid_: Domain XP, score

**Skill XP**:
Growth assigned to a named skill through a reward grant.
_Avoid_: Domain progress, experience

**Resource**:
A named world-building unit issued through a reward grant.
_Avoid_: Currency, token

**World element**:
A persistent place, structure, route, system, or other part of a player's world.
_Avoid_: Asset, decoration

**World transformation**:
The immutable record that a reward grant changed one world element from one named state to another.
_Avoid_: Animation, cosmetic reward, world update
