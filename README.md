# Aurelon Systems — Relay International Engineering Lab

A small, forkable Node.js repository for the EADL technical-leadership simulation. Students can run a local browser dashboard, inspect event traces, change one controlled input at a time, write tests, and compare observed evidence with professional claims.

Relay is a deterministic training simulation, not a production notification system. It requires no external API, credentials, database, or paid cloud service.

## Start on Windows

Requirements: Node.js 20+.

In PowerShell, open the repository root and run:

```powershell
npm.cmd install
npm.cmd test
npm.cmd start
```

Open [http://localhost:3000](http://localhost:3000). The application opens in **Operations**. Run the UK pilot, select a work order, and open **Trace a notification** to inspect the recorded sequence. The **Engineering lab** provides controlled inputs and JSON evidence export.

If PowerShell blocks `npm.ps1`, use the `.cmd` commands above. Do not use VS Code Live Server: Relay needs the Node server. If port 3000 is unavailable, close the process using it or record the error and continue with the supplied scenario evidence. Never put credentials or personal information in a fork.

## Explore the repository

- `src/relay.js` — deterministic simulation logic and configuration validation
- `src/server.js` — local static server and `/api/simulate` endpoint
- `public/` — Operations, Trace, and Engineering Lab views
- `tests/` — runnable tests to inspect, challenge, and extend
- `scenarios/episode-01.json` — first investigation parameters and questions
- `scenarios/episode-02.json` — retry-policy investigation parameters and questions
- `docs/ENGINEERING-NOTES.md` — simulator boundaries and future engineering work

The dashboard exposes named events such as `work_order_confirmed`, `partner_accepted`, `partner_acknowledged`, and `device_displayed`. Treat each event as a separate observation. A trace can show the order and elapsed time of recorded events; it cannot by itself establish a production deployment, an external partner contract, or a human read receipt.

## Working agreement

Change one setting at a time, write down a prediction, run a baseline before a variant, keep the exported JSON beside its inputs, and cite the file or trace that supports each claim. The repository is a safe engineering sandbox rather than the canonical Aurelon production system. Keep implementation limitations visible and use the ENKI lesson for the scenario-specific decision and submission.

## Safety and scope

No secrets, personal data, paid-service credentials, live partner connections, or real customer telemetry are used. Regional routing, partner limits, delivery behaviour, and retry settings are modelled within the selected synthetic run. Use the source, tests, fixtures, and exported results to determine what a particular run supports and what still needs another source.
