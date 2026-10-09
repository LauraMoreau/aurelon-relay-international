# Engineering notes — instructor and student boundaries

## Canonical simulation facts

The model uses discrete event times in seconds and a synthetic window-based partner allowance. It records a partner accepted event, an acknowledgement, and a separately simulated device display event. These are different facts. In this educational approximation, acknowledged API calls may still lack device display.

## Intentional gaps

The pilot does not prove production readiness. There is no actual Kubernetes deployment, external API, distributed queue, PostgreSQL database, live observability, authenticated production user, or guaranteed delivery SLA. These should be treated as claims requiring other forms of verification, not manufactured from simulator output.

## Later extensions

Possible extensions include configurable backoff, event replay, failure-injection scenarios, a real request queue, concurrent traffic, per-partner routing, latency percentiles, test coverage and change-review workflow. Extend progressively across episodes rather than implementing all advanced features for the first teaching day.

## Safety

No secrets, personal data, paid service credentials or live partner connections. Use fixtures only.
