# Engineering notes — simulator boundaries

## Canonical simulation facts

The model uses discrete event times in seconds and a synthetic, window-based partner allowance. It records separate events for work-order confirmation, partner handling, acknowledgement, and simulated device display. These are distinct observations in the trace; investigate the boundary between them rather than treating one event as proof of another.

## General simulator limitations

The pilot does not prove production readiness. There is no actual Kubernetes deployment, external API, distributed queue, PostgreSQL database, live observability stack, authenticated production user, or guaranteed delivery SLA. Simulator output must therefore be labelled as modelled behaviour with a defined configuration and scope.

The regional-routing flag and tenant label are configuration inputs in this educational model, not evidence of multiple deployed regional paths. Partner capacity is synthetic, and device-display outcomes are simulation records rather than verifiable human read receipts.

## Later engineering work

Possible extensions include configurable backoff, event replay, failure-injection scenarios, a real request queue, concurrent traffic, per-partner routing, latency percentiles, additional tests, and a change-review workflow. Extend progressively across episodes rather than implementing all advanced features for the first teaching day.

## Safety

No secrets, personal data, paid-service credentials, live partner connections, or real customer telemetry are used. Use fixtures only and keep any experimental changes reversible.
