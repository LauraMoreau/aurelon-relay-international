# Relay Engineering Lab — Technical and teaching review (2026-10-09)

## Confirmed runnable scope
- Dependency-free local Node.js HTTP service.
- One synthetic partner API with fixed-window capacity and deterministic device-display outcomes.
- Interactive control panel, per-work-order outcomes, event timeline, JSON export.
- Engineering Lab presets for the Episode 1 baseline, acknowledgement/display gap, and Episode 2 retry-pressure/partner-override investigations.
- Eight Node test cases. Intended for experimentation, **not** real-world performance claims.

## Changes in audit pass
- Process attempts in chronological time rather than processing every retry for one work order before starting the next; eliminates causally misleading rate-limit results.
- Reject invalid limits, probability, non-integer retry budgets and invalid timing parameters.
- Add tests for chronological behaviour, validation and event ordering.

## Known limitations — not evidence of readiness
1. `regionalRoutingEnabled` is presently configuration only: the simulator does not implement alternative paths when the flag is false. Do not claim it validates enabled regional routing.
2. `tenant` is a label, not a tenant router. There are no UK/Benelux adapters.
3. Partner window capacity is synthetic and unlike real rate-limit semantics; a 429 is deliberately modelled, not received from an actual partner.
4. No queue service, PostgreSQL, Kubernetes, authentication, observability stack, HTTP client or production service is actually running.
5. The drop decision is deterministic by work-order index rather than stochastic. Report it as a scenario parameter, not measured failure probability.
6. The model records a simulated **device display**, not a verifiable human read receipt.
7. The initial controls reveal configuration knobs but not a repository-style investigation workspace. No task submissions or GitHub authentication are included.
8. Browser responsive/accessibility QA and student installation on Windows remain to be performed.
9. The starter repository has no CI workflow, license decision, tagged release or exercise-specific test fixtures yet.
10. Only scenario 01 and 02 JSON files exist. They are outlines, not complete guided lab instructions or teacher solutions.

## Teaching recommendation
### Episode 1 — first engineering encounter
1. Launch localhost lab with supplied starter.
2. Trace WO-4001 through `work_order_confirmed`, `partner_accepted`, `partner_acknowledged`, and (where available) `device_displayed`.
3. Run 8 requests with rate limit 3 and export the trace.
4. Run with simulated dropped device displays; compare count of acknowledged versus displayed work orders.
5. Check which claims about technician receipt are supported, contradicted, or beyond the model.
6. Record a justified follow-up investigation. For early support, provide a walkthrough for one work order. For advanced groups, investigate window boundaries and falsifiable hypotheses.

### Episode 2 — fact check the release claim
1. Read issue #842, draft release note and Product message in ENKI.
2. Inspect `DEFAULT_CONFIG` and effective configuration in JSON export.
3. Distinguish flag enabled, per-partner attempt override, fallback retry budget, and rate-limit capacity.
4. Explain why a UK-only synthetic run does not establish a global international rollout.
5. Produce a corrected engineering status and a stakeholder-safe status, referencing file paths and trace events.
6. Advanced: add tests for per-partner retry policy and implement a second tenant; make the revised claim evidence-backed.

## Important: align with existing ENKI rather than duplicating teaching material
The detailed learner mission, access/teacher override, assessment and submissions belong to Enki. The repository is an engineering sandbox. This repo should not attempt to implement the Enki student dashboard.

## Priority next engineering increment
1. Meaningful on/off path for regional feature flag and explicit unsupported configurations.
2. Separate two simulated partner adapters (UK and Benelux), with per-partner rate policy and operational metric boundaries.
3. A testable suite of initial fixtures and a student task that alters observable behaviour.
4. GitHub Actions `npm test` workflow and clean public starter history.
5. README Windows setup and `npm` troubleshooting.
6. Integrate links from Episodes 1–2 only after repo is published and location stable.
