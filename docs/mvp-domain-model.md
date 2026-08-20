# MVP domain model

Status: Proposed for Issue #3

Scope: One player, one mission completion, one reward grant, one world transformation

## Purpose

The model records how real work changes a player's world. A future reader must be able to answer four questions from stored records:

1. What work did the player claim?
2. What evidence supported the claim?
3. Who or what accepted it?
4. Which progress, XP, resources, and world change did it create?

GitHub evidence and manual evidence share the same completion path. They remain visibly distinct throughout that path.

## Boundary

This slice owns the transition from an accepted mission to a visible world change:

```text
Mission definition
  -> Mission attempt
  -> Evidence submission
  -> Verification decision
  -> Mission completion
  -> Reward grant
  -> World transformation
```

It does not decide how missions are recommended, how GitHub is connected, how records are stored, or how the world is rendered.

## Contract sketch

The contracts use TypeScript as precise documentation. They are framework-independent and do not require a package.

```ts
type IsoTimestamp = string;

type PlayerId = `player_${string}`;
type MissionDefinitionId = `mission_${string}`;
type MissionAttemptId = `attempt_${string}`;
type EvidenceSubmissionId = `evidence_${string}`;
type VerificationDecisionId = `decision_${string}`;
type MissionCompletionId = `completion_${string}`;
type RewardGrantId = `grant_${string}`;
type WorldTransformationId = `transformation_${string}`;
type WorldElementId = `world_element_${string}`;
type SkillId = `skill_${string}`;
type ResourceTypeId = `resource_${string}`;

type WorldDomain =
  | "build"
  | "stability"
  | "knowledge"
  | "trust"
  | "automation";

type RewardLevel = 1 | 2 | 3 | 4 | 5;

interface MissionDefinitionRef {
  id: MissionDefinitionId;
  version: number;
}

interface MissionDefinition {
  ref: MissionDefinitionRef;
  title: string;
  outcome: string;
  evidenceRequirements: readonly string[];
  rewardBasis: {
    scope: RewardLevel;
    difficulty: RewardLevel;
    importance: RewardLevel;
  };
  intendedWorldChange: {
    worldElementKind: string;
    resultingState: string;
  };
}

interface WorldElement {
  id: WorldElementId;
  playerId: PlayerId;
  kind: string;
  state: string;
}

interface MissionAttemptBase {
  id: MissionAttemptId;
  playerId: PlayerId;
  missionDefinition: MissionDefinitionRef;
  targetWorldElementId: WorldElementId;
  acceptedAt: IsoTimestamp;
}

type MissionAttempt =
  | (MissionAttemptBase & { status: "active" })
  | (MissionAttemptBase & {
      status: "completed";
      completedAt: IsoTimestamp;
    });
```

A mission definition version never changes after a player accepts it. Editing a mission creates a new version. The attempt keeps the old reference so later reward audits use the rules the player accepted.

### Evidence

```ts
type GitHubSubjectKind =
  | "pull_request"
  | "issue"
  | "review"
  | "check_run"
  | "deployment";

interface GitHubEvidence {
  kind: "github";
  repository: `${string}/${string}`;
  subjectKind: GitHubSubjectKind;
  subjectNodeId: string;
  url: `https://github.com/${string}`;
  observedAt: IsoTimestamp;
}

interface ManualEvidence {
  kind: "manual";
  summary: string;
  artifactReferences: readonly string[];
  attestedBy: PlayerId;
}

type Evidence = GitHubEvidence | ManualEvidence;

interface EvidenceSubmission {
  id: EvidenceSubmissionId;
  attemptId: MissionAttemptId;
  evidence: readonly Evidence[];
  submittedAt: IsoTimestamp;
}
```

Manual evidence is not mislabeled as GitHub-verified. A private artifact reference may be opaque to other players, but it must stay attached to the submission for the owner or an authorized verifier.

### Verification

```ts
type DecisionMaker =
  | {
      kind: "github_rule";
      ruleId: string;
      ruleVersion: number;
    }
  | {
      kind: "manual_attestation";
      attestedBy: PlayerId;
    };

interface VerificationDecisionBase {
  id: VerificationDecisionId;
  evidenceSubmissionId: EvidenceSubmissionId;
  decidedBy: DecisionMaker;
  decidedAt: IsoTimestamp;
}

type VerificationDecision =
  | (VerificationDecisionBase & {
      outcome: "accepted";
      assessment: {
        quality: RewardLevel;
        impact: RewardLevel;
      };
      reasons: readonly string[];
    })
  | (VerificationDecisionBase & {
      outcome: "rejected";
      reasons: readonly [string, ...string[]];
    });
```

The decision maker says who or what made the decision. `github_rule` names a reproducible system rule. `manual_attestation` names the player who accepted responsibility for the claim. The UI can therefore show different trust markers without splitting the mission flow.

Rejected evidence does not complete the attempt. The player may submit new evidence, which receives a new decision.

### Completion and reward

```ts
interface MissionCompletion {
  id: MissionCompletionId;
  attemptId: MissionAttemptId;
  missionDefinition: MissionDefinitionRef;
  acceptedDecisionId: VerificationDecisionId;
  completedAt: IsoTimestamp;
}

interface RewardFactors {
  scope: RewardLevel;
  difficulty: RewardLevel;
  importance: RewardLevel;
  verification: RewardLevel;
  quality: RewardLevel;
  impact: RewardLevel;
}

interface DomainProgressGrant {
  domain: WorldDomain;
  amount: number;
}

interface SkillXpGrant {
  skillId: SkillId;
  amount: number;
}

interface ResourceGrant {
  resourceTypeId: ResourceTypeId;
  quantity: number;
}

interface RewardGrant {
  id: RewardGrantId;
  completionId: MissionCompletionId;
  policy: {
    id: string;
    version: number;
  };
  inputs: RewardFactors;
  outputs: {
    domainProgress: readonly DomainProgressGrant[];
    skillXp: readonly SkillXpGrant[];
    resources: readonly ResourceGrant[];
  };
  grantedAt: IsoTimestamp;
}
```

The grant stores the policy version, its inputs, and its outputs. This does not prescribe a reward formula. It makes any future formula inspectable and reproducible.

### World transformation

```ts
interface WorldTransformation {
  id: WorldTransformationId;
  rewardGrantId: RewardGrantId;
  worldElementId: WorldElementId;
  fromState: string;
  toState: string;
  transformedAt: IsoTimestamp;
}
```

The transformation is a domain fact, not an animation. A renderer may present the same fact in 2D, text, or another visual form.

## Lifecycle

```text
accept mission
  -> active attempt
  -> submit evidence
  -> reject evidence -> active attempt
  -> submit replacement evidence
  -> accept evidence
  -> create completion
  -> issue reward grant
  -> apply world transformation
  -> completed attempt
```

Only these state changes are allowed in this slice:

- A new attempt starts as `active`.
- A rejected decision leaves the attempt `active`.
- The first accepted decision creates the attempt's only completion.
- Creating the completion changes the attempt to `completed`.
- A completed attempt cannot receive another completion.

## Invariants

These rules must hold regardless of the future database or API design.

1. A mission attempt belongs to one player and one mission definition version.
2. The target world element belongs to the same player and matches the kind required by the mission definition.
3. Every verification decision refers to one evidence submission.
4. Only an accepted verification decision can create a mission completion.
5. The accepted decision and completion must belong to the same attempt.
6. One attempt can have at most one mission completion.
7. One mission completion can have at most one reward grant.
8. One reward grant can create at most one world transformation in the MVP.
9. Domain progress, skill XP, and resources remain separate reward outputs.
10. A reward grant stores enough input data to reproduce its outputs with the named policy version.
11. Repeating a completion, grant, or transformation command returns the existing record instead of creating another one.
12. GitHub evidence never becomes manual evidence, and manual evidence never receives a GitHub verification marker.
13. Mission completions, reward grants, and world transformations are append-only facts.

The unique keys implied by rules 6 through 8 are the retry protection:

```text
MissionCompletion(attemptId)
RewardGrant(completionId)
WorldTransformation(rewardGrantId)
```

## Worked example: GitHub-verified testing mission

1. Mission definition `mission_secure-auth-flow` version 1 asks for E2E coverage of the sign-in path. Its intended world change is `Shield Tower -> online`.
2. Player `player_ada` accepts attempt `attempt_auth-42`.
3. Evidence submission `evidence_auth-42` points to a merged pull request and its passing check run in `acme/web`.
4. GitHub rule `merged-pr-with-passing-checks` version 2 accepts the evidence.
5. Completion `completion_auth-42` records the mission version and accepted decision.
6. Reward policy `mvp-rewards` version 1 issues `+18 Stability`, Testing XP, and one Flux Core. The grant stores all six reward factors.
7. Transformation `transformation_auth-42` changes the Shield Tower from `offline` to `online`.

An audit can follow the transformation back to the grant, completion, accepted decision, evidence, attempt, and exact mission version.

## Worked example: Private manual debugging mission

1. Mission definition `mission_debug-private-integration` version 1 asks the player to find and fix an integration failure. Its intended world change is `Power Relay -> repaired`.
2. Player `player_ada` accepts attempt `attempt_private-17`.
3. Evidence submission `evidence_private-17` contains a summary and an opaque reference to a private client runbook entry. It contains no client secret or copied private source.
4. Player `player_ada` accepts responsibility through a manual attestation.
5. Completion `completion_private-17` records that manual decision. It does not claim GitHub verification.
6. Reward policy `mvp-rewards` version 1 issues Stability progress, Debugging XP, and one Energy Cell with a lower verification factor than the GitHub example.
7. Transformation `transformation_private-17` changes the Power Relay from `damaged` to `repaired`.

The world still changes, but the evidence and verification method remain visible as manual.

## Decisions left open

These decisions need real application constraints. This slice does not guess them.

- Who may accept manual evidence besides the player?
- Which GitHub signals qualify for each mission type?
- What is the reward formula, and how are factor levels assigned?
- Can a reward grant be reversed after fraud, deletion, or provider correction?
- May one mission completion transform more than one world element after the MVP?
- Which records require public visibility, owner-only visibility, or redaction?
- Will persistence use current-state tables, domain events, or both?

## Excluded concepts

The model contains no guild, PvP, leaderboard, token, marketplace, shared-world ownership, or multiplayer fields. Those concepts must not shape MVP identifiers or ownership rules.
