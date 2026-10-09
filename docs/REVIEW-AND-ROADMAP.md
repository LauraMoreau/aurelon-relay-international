# Relay Engineering Lab — Technical review and roadmap

## Confirmed runnable scope

- Dependency-free local Node.js HTTP service.
- One synthetic partner model with a fixed-window capacity and deterministic scenario outcomes.
- Operations, Trace, and Engineering Lab views with per-work-order results, event timeline, and JSON export.
- Presets for the Episode 1 baseline and controlled notification variant, plus Episode 2 retry-policy investigations.
- Eight Node test cases. They support reproducible investigation; they are not real-world performance claims.

## Reliability changes in the current implementation

- Attempts are processed in chronological time rather than exhausting every retry for one work order before starting the next.
- Invalid limits, probabilities, non-integer retry budgets, and invalid timing parameters are rejected.
- Tests cover chronological behaviour, validation, and event ordering.

## Known limitations — not evidence of readiness

1. `regionalRoutingEnabled` is presently a configuration input; the simulator does not implement alternative deployed paths when it changes.
2. `tenant` is a label, not a tenant router. There are no UK/Benelux adapters.
3. Partner window capacity is synthetic and unlike real rate-limit semantics; a throttled result is modelled, not received from an actual partner.
4. No queue service, PostgreSQL, Kubernetes, authentication, observability stack, HTTP client, or production service is running.
5. The simulated drop decision is deterministic by work-order index rather than stochastic. Report it as a scenario parameter, not a measured failure probability.
6. The model records a simulated device-display event, not a verifiable human read receipt.
7. The controls expose configuration knobs and event traces, but not task submissions or GitHub authentication.
8. Windows installation, responsive/accessibility behaviour, and any local environment issue remain separate checks for the learner.
9. The repository has no CI workflow, license decision, tagged release, or second partner adapter yet.
10. The scenario JSON files are investigation parameters and questions, not teacher solutions.

## Suggested investigation paths

### Episode 1 — first engineering encounter

1. Run the unchanged UK-pilot baseline.
2. Select one work order and record the event sequence and elapsed times.
3. Run a controlled variant, changing one input only.
4. Compare the baseline and variant traces, then export the JSON beside its configuration.
5. State which observations are in scope for the selected run and which require another source.

### Episode 2 — conflicting status claims

1. Inspect the issue, release-note wording, scenario fixture, source, and tests named in ENKI.
2. Identify the effective configuration used by the selected run.
3. Compare retry, partner-limit, and event outcomes without treating a local simulation as deployment evidence.
4. Preserve the original claim, revise it when evidence changes its scope, and record the owner and next verification.

## Keep the boundaries clear

The detailed learner mission, access controls, teacher overrides, assessment, and submissions belong to ENKI. This repository is an inspectable engineering sandbox and should not duplicate the ENKI student dashboard or publish teacher-only answers.

## Priority next engineering increments

1. Implement a meaningful regional-path switch with explicit unsupported configurations.
2. Add separate simulated partner adapters with per-partner rate policy and operational metric boundaries.
3. Add fixtures and tests for the next learner investigation while keeping claims source-bound.
4. Add a GitHub Actions `npm test` workflow, license decision, and tagged release.
