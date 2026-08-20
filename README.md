# devfront.dev

> **Real work → visible progress → better missions → a richer world.**

`devfront.dev` is an open-source product concept that turns real software development with humans and agents into a persistent world-building loop.

Not “Jira with XP.” Not just a coding game. The core idea is that productive work should visibly shape a personal world that grows in identity, capability, history, and connections.

## Core loop

1. Choose the next goal for your world
2. Select a fitting mission
3. Complete real development work
4. Verify the outcome
5. Gain skill XP, resources, and visible world progress

## World domains

- **Build** — features, UI, implementation, and product work
- **Stability** — tests, bug fixes, security, and reliability
- **Knowledge** — documentation, research, architecture, and teaching
- **Trust** — reviews, mentoring, and collaboration
- **Automation** — agents, CI/CD, DevOps, and tooling

These domains can manifest as structures, regions, systems, biomes, infrastructure, landmarks, and relationships. The product is designed as a world-builder from the start.

## Product documents

- [Vision Paper](docs/vision-paper.html)
- [Product and MVP Plan](docs/product-plan.html)
- [Machine-readable Agent Handoff](docs/product-plan.agent.json)
- [MVP Domain Model](docs/mvp-domain-model.md)

## MVP direction

The first proof is a focused **2D world-building vertical slice**:

- one personal starting world
- five world domains
- three real mission types
- hybrid work verification
- one high-quality completion and transformation moment

Intentionally excluded from the MVP: 3D exploration, guilds, PvP, company worlds, recruiting, tokens, and global leaderboards.

## Status

**Single-player MVP in development.** The first app slice contains the World Home, three local missions, auditable reward inputs, local progress, and one visible transformation per mission.

## Local development

```sh
pnpm install
pnpm dev
```

Run the focused project checks with `pnpm check`.

## License

MIT. See [LICENSE](LICENSE).
