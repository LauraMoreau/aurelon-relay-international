import test from 'node:test';import assert from 'node:assert/strict';import {simulate,DEFAULT_CONFIG} from '../src/relay.js';
test('baseline simulates work orders',()=>{const r=simulate();assert.equal(r.summary.processed,8);assert.equal(r.outcomes.length,8)});
test('acknowledgement does not guarantee device display',()=>{const r=simulate(DEFAULT_CONFIG,{requests:4,deviceDropRate:1});assert.ok(r.summary.acknowledged>0);assert.equal(r.summary.displayed,0)});
test('rate-limiting produces retry pressure',()=>{const r=simulate(DEFAULT_CONFIG,{requests:12,rateLimit:1});assert.ok(r.summary.throttled>0)});
test('invalid configuration fails',()=>{assert.throws(()=>simulate({fallbackMaxAttempts:0}),/Invalid fallbackMaxAttempts/)});

test('concurrent work orders respect chronological partner capacity',()=>{
  const r=simulate(DEFAULT_CONFIG,{requests:8,rateLimit:3});
  const first=r.events.filter(e=>e.type==='partner_accepted'&&e.at<10);
  assert.deepEqual(first.map(e=>e.id),['WO-4001','WO-4002','WO-4003']);
  assert.equal(r.summary.acknowledged,4); // one retry succeeds in the next time window
});
test('a disabled regional feature is not proof of regional routing',()=>{
  const r=simulate({...DEFAULT_CONFIG,regionalRoutingEnabled:false},{requests:1});
  assert.equal(r.config.regionalRoutingEnabled,false);
});
test('reject invalid input limits and probabilities',()=>{
  assert.throws(()=>simulate({}, {rateLimit:-1}),/Invalid rateLimit/);
  assert.throws(()=>simulate({}, {deviceDropRate:2}),/Invalid deviceDropRate/);
  assert.throws(()=>simulate({}, {requests:1.5}),/requests must/);
  assert.throws(()=>simulate({fallbackMaxAttempts:2.5}),/Invalid fallbackMaxAttempts/);
});
test('event timestamps are nondecreasing',()=>{
  const r=simulate(DEFAULT_CONFIG,{requests:40,rateLimit:2});
  assert.ok(r.events.every((event,i)=>i===0||event.at>=r.events[i-1].at));
});
