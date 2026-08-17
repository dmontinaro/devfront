# First Transformation prototype

This is throwaway code for GitHub issue #1. It explores one question:

> Which visual direction makes the connection between real work, reward, and world transformation feel clearest and most motivating?

Run it from the repository root:

```sh
python3 -m http.server 4173 -d prototype
```

Then open <http://localhost:4173>.

Use the floating switcher or the left and right arrow keys to compare:

- `?variant=A` — Living atlas
- `?variant=B` — Cinematic signal
- `?variant=C` — Field console

Each variant implements the same four-step flow. State is intentionally kept in memory and resets when switching variants or reloading.
