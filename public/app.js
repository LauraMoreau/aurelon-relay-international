const $ = (selector) => document.querySelector(selector);
let last = null;
const TECHNICIANS = ['Alex Morgan', 'Camille Dubois', 'Jordan Lee', 'Morgan Ellis', 'Sam Patel', 'Taylor Reed', 'Robin Clarke', 'Chris Martin'];
const PRESETS = {
  baseline: {label: 'Episode 1 · UK pilot baseline', requests: 8, rateLimit: 3, fallbackMaxAttempts: 5, partnerMaxAttempts: null, deviceDropRate: 0},
  'delivery-gap': {label: 'Episode 1 · controlled notification variant', requests: 8, rateLimit: 3, fallbackMaxAttempts: 5, partnerMaxAttempts: null, deviceDropRate: 0.25},
  'retry-pressure': {label: 'Episode 2 · retry-pressure run', requests: 12, rateLimit: 1, fallbackMaxAttempts: 5, partnerMaxAttempts: null, deviceDropRate: 0},
  'partner-override': {label: 'Episode 2 · partner-limit run', requests: 8, rateLimit: 3, fallbackMaxAttempts: 5, partnerMaxAttempts: 2, deviceDropRate: 0}
};
const esc = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function switchView(view) {
  document.querySelectorAll('.view').forEach((element) => { element.hidden = element.id !== view; });
  document.querySelectorAll('.tab').forEach((element) => {
    const active = element.dataset.view === view;
    element.classList.toggle('active', active);
    element.setAttribute('aria-selected', String(active));
  });
}
document.querySelectorAll('.tab').forEach((element) => { element.onclick = () => switchView(element.dataset.view); });

$('#drop').oninput = () => { $('#dropLabel').textContent = `${$('#drop').value}%`; };
const baseline = {config: {fallbackMaxAttempts: 5, partnerMaxAttempts: null}, scenario: {requests: 8, rateLimit: 3, deviceDropRate: 0}};

function setPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  $('#requests').value = preset.requests;
  $('#limit').value = preset.rateLimit;
  $('#attempts').value = preset.fallbackMaxAttempts;
  $('#partnerAttempts').value = preset.partnerMaxAttempts ?? '';
  $('#drop').value = Math.round(preset.deviceDropRate * 100);
  $('#dropLabel').textContent = `${$('#drop').value}%`;
  $('#presetNote').textContent = `${preset.label}. The values are educational scenario controls, not production measurements.`;
}
$('#preset').onchange = () => { if ($('#preset').value !== 'custom') setPreset($('#preset').value); else $('#presetNote').textContent = 'Custom values. Record your hypothesis before running and change one variable at a time.'; };

function experimentInput() {
  return {
    config: {fallbackMaxAttempts: Number($('#attempts').value), partnerMaxAttempts: $('#partnerAttempts').value ? Number($('#partnerAttempts').value) : null},
    scenario: {requests: Number($('#requests').value), rateLimit: Number($('#limit').value), deviceDropRate: Number($('#drop').value) / 100}
  };
}

async function run(input) {
  $('#error').textContent = '';
  try {
    const response = await fetch('/api/simulate', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(input)});
    const data = await response.json();
    if (!response.ok) throw Error(data.error);
    last = data;
    renderAll(data);
    return data;
  } catch (error) {
    $('#error').textContent = error.message;
    $('#operationStatus').textContent = `Simulation failed: ${error.message}`;
    return null;
  }
}

$('#runBaseline').onclick = async () => { const data = await run(baseline); if (data) switchView('operations'); };
$('#run').onclick = () => run(experimentInput());
$('#reset').onclick = () => { $('#preset').value = 'baseline'; setPreset('baseline'); run(baseline); };

function renderAll(data) {
  $('#export').disabled = false;
  const summary = data.summary;
  const stats = [['Processed', summary.processed], ['Partner ACK', summary.acknowledged], ['Device display', summary.displayed], ['Throttled attempts', summary.throttled]];
  const cards = stats.map(([label, value]) => `<div><strong>${value}</strong><small>${esc(label)}</small></div>`).join('');
  $('#metrics').innerHTML = cards;
  $('#operationsMetrics').innerHTML = cards;
  $('#operationStatus').textContent = `Pilot completed: ${summary.processed} work orders; ${summary.acknowledged} received partner acknowledgements and ${summary.displayed} produced simulated device displays. Select an order to inspect its trace.`;
  $('#operationsOrders').innerHTML = data.outcomes.map((outcome, index) => `<tr><td>${esc(outcome.id)}</td><td>${esc(TECHNICIANS[index % TECHNICIANS.length])}</td><td>${outcome.acknowledgedAt === null ? 'No ACK' : 'Acknowledged'}</td><td>${outcome.displayedAt === null ? 'Not observed' : 'Displayed'}</td><td><button class="small secondary traceBtn" data-id="${esc(outcome.id)}">Trace</button></td></tr>`).join('');
  document.querySelectorAll('.traceBtn').forEach((button) => { button.onclick = () => { showTrace(button.dataset.id); switchView('trace'); }; });
  $('#outcomes').innerHTML = data.outcomes.map((outcome) => `<tr><td>${esc(outcome.id)}</td><td>${esc(outcome.status)}</td><td>${outcome.acknowledgedAt?.toFixed(2) ?? '—'}</td><td>${outcome.displayedAt?.toFixed(2) ?? '—'}</td></tr>`).join('');
  $('#events').innerHTML = data.events.map((event) => `<tr><td>${event.at.toFixed(2)}</td><td>${esc(event.id)}</td><td>${esc(event.type)}</td><td>${esc(event.message)}</td></tr>`).join('');
  $('#orderSelect').innerHTML = data.outcomes.map((outcome) => `<option value="${esc(outcome.id)}">${esc(outcome.id)}</option>`).join('');
  showTrace(data.outcomes[0].id);
}

function showTrace(id) {
  if (!last) return;
  $('#orderSelect').value = id;
  const outcome = last.outcomes.find((item) => item.id === id);
  if (!outcome) return;
  $('#traceSummary').textContent = `${outcome.id}: ${outcome.status.replaceAll('_', ' ')} · ${outcome.attempts} attempt(s) · partner ACK ${outcome.acknowledgedAt?.toFixed(2) ?? 'not observed'} s · device display ${outcome.displayedAt?.toFixed(2) ?? 'not observed'} s`;
  $('#traceEvents').innerHTML = last.events.filter((event) => event.id === id).map((event) => `<div class="trace-item"><strong>${event.at.toFixed(2)} s · ${esc(event.type)}</strong><p>${esc(event.message)}</p></div>`).join('');
}
$('#orderSelect').onchange = (event) => showTrace(event.target.value);

$('#export').onclick = () => {
  if (!last) return;
  const blob = new Blob([JSON.stringify(last, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'relay-evidence.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
