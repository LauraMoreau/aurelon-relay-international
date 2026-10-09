/** Deterministic educational event simulator. Not live telemetry or a production SLA. */
export const DEFAULT_CONFIG = Object.freeze({
  tenant: 'uk-pilot',
  regionalRoutingEnabled: true,
  partnerMaxAttempts: null,
  fallbackMaxAttempts: 5,
  partnerRateLimitPerWindow: 3,
  windowSeconds: 10,
  backoffSeconds: 2,
  processingSeconds: 0.4,
  partnerLatencySeconds: 0.6,
  deviceDelaySeconds: 1.2
});

function positiveNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new Error(`Invalid ${name}`);
}
export function validateConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Invalid config');
  for (const key of ['fallbackMaxAttempts', 'partnerRateLimitPerWindow', 'windowSeconds', 'backoffSeconds', 'processingSeconds', 'partnerLatencySeconds', 'deviceDelaySeconds']) positiveNumber(config[key],key);
  for (const key of ['fallbackMaxAttempts','partnerRateLimitPerWindow']) if (!Number.isInteger(config[key])) throw new Error(`Invalid ${key}`);
  if (config.partnerMaxAttempts !== null && (!Number.isInteger(config.partnerMaxAttempts) || config.partnerMaxAttempts <= 0)) throw new Error('Invalid partnerMaxAttempts');
  if (typeof config.regionalRoutingEnabled !== 'boolean') throw new Error('Invalid regionalRoutingEnabled');
  return config;
}

export function simulate(config = {}, scenario = {}) {
  if (!scenario || typeof scenario !== 'object' || Array.isArray(scenario)) throw new Error('Invalid scenario');
  const c = validateConfig({...DEFAULT_CONFIG, ...config});
  const requests = scenario.requests ?? 8;
  if (!Number.isInteger(requests) || requests < 1 || requests > 100) throw new Error('requests must be 1..100');
  const rateLimit = scenario.rateLimit ?? c.partnerRateLimitPerWindow;
  if (!Number.isInteger(rateLimit) || rateLimit < 1 || rateLimit > 1000) throw new Error('Invalid rateLimit');
  const deviceDropRate = scenario.deviceDropRate ?? 0;
  if (typeof deviceDropRate !== 'number' || !Number.isFinite(deviceDropRate) || deviceDropRate < 0 || deviceDropRate > 1) throw new Error('Invalid deviceDropRate');
  const maxAttempts = c.partnerMaxAttempts ?? c.fallbackMaxAttempts;
  const events = [];
  const outcomes = Array.from({length:requests},(_,i)=>({id:`WO-${4001+i}`,status:'pending',attempts:0,acknowledgedAt:null,displayedAt:null}));
  const queue = [];
  for(let i=0;i<requests;i++) {
    const at=i*0.25;
    events.push({id:outcomes[i].id,at,type:'work_order_confirmed',message:'Work-order change entered Relay'});
    queue.push({i,attempt:1,at:at+c.processingSeconds});
  }
  const acceptedByWindow=new Map();
  let throttled=0;
  while(queue.length) {
    queue.sort((a,b)=>a.at-b.at || a.i-b.i);
    const {i,attempt,at}=queue.shift();
    const output=outcomes[i];
    output.attempts++;
    const window=Math.floor(at/c.windowSeconds);
    const used=acceptedByWindow.get(window)??0;
    if (used>=rateLimit) {
      throttled++;
      events.push({id:output.id,at,type:'partner_throttled',attempt,message:'HTTP 429 simulated; retry queued if budget remains'});
      if(attempt<maxAttempts) queue.push({i,attempt:attempt+1,at:at+c.backoffSeconds});
      else {output.status='failed';events.push({id:output.id,at,type:'attempts_exhausted',message:'No partner acknowledgement'});}
    } else {
      acceptedByWindow.set(window,used+1);
      const acknowledgedAt=at+c.partnerLatencySeconds;
      output.acknowledgedAt=acknowledgedAt;
      events.push({id:output.id,at,type:'partner_accepted',attempt,message:'Partner accepted request'});
      events.push({id:output.id,at:acknowledgedAt,type:'partner_acknowledged',attempt,message:'API acknowledgement; not device receipt'});
      const dropped=((i*37+13)%100)/100<deviceDropRate;
      if(dropped) output.status='acknowledged_only';
      else {
        output.displayedAt=acknowledgedAt+c.deviceDelaySeconds;
        output.status='displayed';
        events.push({id:output.id,at:output.displayedAt,type:'device_displayed',message:'Simulated device displayed notification'});
      }
    }
  }
  events.sort((a,b)=>a.at-b.at || a.id.localeCompare(b.id));
  return {config:c,scenario:{requests,rateLimit,deviceDropRate},summary:{processed:requests,acknowledged:outcomes.filter(x=>x.acknowledgedAt!==null).length,displayed:outcomes.filter(x=>x.displayedAt!==null).length,throttled},events,outcomes};
}
