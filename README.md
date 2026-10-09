# Aurelon Systems — Relay International Engineering Lab

A small **real, forkable Node.js repository** for the EADL technical-leadership simulation. Students can run the browser dashboard, examine event traces, change source code, write tests, commit work, and compare evidence with professional claims.

This is a *simulation*, not a production notification system. No external API, credentials, database or paid cloud service is required.

## Start

Requirements: Node.js 20+.

```bash
npm start
```

Open http://localhost:3000 in a browser. Run automated checks:

```bash
npm test
```

Fork this repository to your GitHub account once the instructor publishes it. Clone your fork or download the code as ZIP. Never put real credentials in your fork.

## Explore

- `src/relay.js` — deterministic simulated partner routing, retries, acknowledgements and device displays
- `src/server.js` — local static server and `/api/simulate`
- `public/` — interactive engineering dashboard
- `tests/` — tests to run, challenge and extend
- `scenarios/episode-01.json` — first investigation
- `scenarios/episode-02.json` — contradictory claims investigation
- `docs/ENGINEERING-NOTES.md` — constraints and future episodes

## Important distinctions

1. A work-order change entering Relay is not the same event as partner acknowledgement.
2. Partner acknowledgement is not device receipt or user display.
3. The current implementation is deterministic educational code, not measured production telemetry.
4. The starting configuration has an explicitly `null` partner-specific retry limit and a fallback of five attempts. This is not proof that production partner limits are satisfied.

## Working agreement

Write clear commits, test before claims, justify changes, and retain a short record of known evidence and unknowns. You may explore and modify this fork: it is **not** the canonical Aurelon production system.

## New guided interface

Open http://localhost:3000 after `npm.cmd start` in PowerShell. The app now opens in **Operations**, not the experiment parameters. Run the UK pilot, select a work order, and open **Trace a notification** to inspect its event sequence. The **Engineering lab** contains the original adjustable simulation and JSON evidence export.

This is a training simulation. Partner acknowledgements and device-display events are modelled, not collected from real hardware. Regional routing and multiple partner implementations remain future engineering tasks. Existing tests run with `npm.cmd test`.
