// ═══ DOCTORS TAB LOGIC ═══
let currentDoctor = null;
let shareChart = null;

function buildDocList() {
  const el = document.getElementById('doc-list');
  el.innerHTML = Object.entries(DOCTORS).map(([id, d]) => `
    <div class="doc-list-item" id="dli-${id}" onclick="selectDoctor('${id}')">
      <div class="dli-av" style="background:${d.av};color:${d.avt};">${d.initials}</div>
      <div>
        <div class="dli-name">${d.name}</div>
        <div class="dli-spec">${d.spec} · ${d.clinic}</div>
      </div>
      <div class="dli-val">${d.rev.toFixed(1)} млн</div>
    </div>
  `).join('');
}

function selectDoctor(id) {
  currentDoctor = id;
  document.querySelectorAll('.doc-list-item').forEach(el => el.classList.remove('sel'));
  document.getElementById('dli-'+id).classList.add('sel');
  renderDoctor(id);
}

function renderDoctor(id) {
  const d = DOCTORS[id];
  const shareDoc = document.getElementById('doc-detail');
  const sharePct = Math.round(d.rev / d.revSpec * 100);

  shareDoc.innerHTML = `
    <div class="doc-top">
      <div class="doc-big-av" style="background:${d.av};color:${d.avt};">${d.initials}</div>
      <div class="doc-id">
        <div class="doc-full-name">${d.name}</div>
        <div class="doc-full-spec">${d.spec}</div>
        <div class="doc-full-clinic">${d.clinic}</div>
      </div>
    </div>
    <div class="kpi4">
      <div class="kpi4-item">
        <div class="kpi4-label">Выручка · март</div>
        <div class="kpi4-val">${d.rev.toFixed(1)} <span style="font-size:14px;font-weight:400;color:#BBBAB5;">млн ₽</span></div>
        <div class="kpi4-sub" style="color:#3A8C62;font-weight:600;">↑ ${Math.round((d.rev/d.revPlan-1)*100+100-100)}% к прошлому году</div>
      </div>
      <div class="kpi4-item">
        <div class="kpi4-label">Визитов</div>
        <div class="kpi4-val">${d.visits}</div>
        <div class="kpi4-sub">за март 2026</div>
      </div>
      <div class="kpi4-item">
        <div class="kpi4-label">Средний чек</div>
        <div class="kpi4-val">${(d.avgTicket/1000).toFixed(0)}<span style="font-size:14px;font-weight:400;color:#BBBAB5;"> т ₽</span></div>
        <div class="kpi4-sub">за визит</div>
      </div>
      <div class="kpi4-item">
        <div class="kpi4-label">Маржа направл.</div>
        <div class="kpi4-val" style="color:#3A8C62;">${d.margin}</div>
        <div class="kpi4-sub">EBITDA</div>
      </div>
    </div>
    <div class="share-card">
      <div class="share-top">
        <div class="share-title">Доля врача от...</div>
        <select class="share-select" id="share-select" onchange="updateShareChart('${id}', this.value)">
          <option value="spec">выручки специальности (${d.specName})</option>
          <option value="clinic">выручки филиала (${d.clinic})</option>
          <option value="group">выручки группы (всего)</option>
        </select>
      </div>
      <div class="share-content">
        <div class="donut-wrap">
          <canvas id="shareChart" width="200" height="200"></canvas>
          <div class="donut-center">
            <div class="dc-pct" id="center-pct">${sharePct}%</div>
            <div class="dc-lbl" id="center-lbl">от<br>специальности</div>
          </div>
        </div>
        <div class="share-legend" id="share-legend"></div>
      </div>
    </div>
  `;

  setTimeout(() => buildShareChart(id, 'spec'), 30);
}

function buildShareChart(id, context) {
  const d = DOCTORS[id];
  const ctx = SHARE_CONTEXTS[context];
  const peers = ctx.getAll(d);
  const total = peers.reduce((s,p) => s+p.val, 0);
  const myIdx = peers.findIndex(p => p.name === d.name);

  const canvas = document.getElementById('shareChart');
  if (!canvas) return;

  if (shareChart) { shareChart.destroy(); shareChart = null; }

  shareChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: peers.map(p => p.name),
      datasets: [{ data: peers.map(p => p.val), backgroundColor: peers.map((_,i) => i === myIdx ? '#2B5F8E' : PALETTE[i+1] || '#E0DDD7'), borderWidth: 0, hoverOffset: 3 }]
    },
    options: {
      responsive: false,
      cutout: '65%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.toFixed(1)} млн (${Math.round(ctx.parsed/total*100)}%)` } } }
    }
  });

  const myPct = Math.round((d.rev / total) * 100);
  const centerPct = document.getElementById('center-pct');
  const centerLbl = document.getElementById('center-lbl');
  if (centerPct) centerPct.textContent = myPct + '%';
  if (centerLbl) centerLbl.textContent = 'от\n' + ctx.label;

  const leg = document.getElementById('share-legend');
  if (leg) {
    leg.innerHTML = peers.map((p, i) => {
      const pct = Math.round(p.val / total * 100);
      const isMe = i === myIdx;
      return `<div class="sl-row">
        <span class="sl-dot" style="background:${i === myIdx ? '#2B5F8E' : PALETTE[i+1] || '#E0DDD7'};"></span>
        <span class="sl-name">${p.name}</span>
        <span class="sl-val">${p.val.toFixed(1)} млн</span>
        <span class="sl-pct">${pct}%${isMe ? '<span class="sl-me">← вы</span>' : ''}</span>
      </div>`;
    }).join('');
  }
}

function updateShareChart(id, context) {
  buildShareChart(id, context);
  const d = DOCTORS[id];
  const ctx = SHARE_CONTEXTS[context];
  const peers = ctx.getAll(d);
  const total = peers.reduce((s,p) => s+p.val, 0);
  const myPct = Math.round(d.rev / total * 100);
  const centerPct = document.getElementById('center-pct');
  const centerLbl = document.getElementById('center-lbl');
  if (centerPct) centerPct.textContent = myPct + '%';
  if (centerLbl) centerLbl.textContent = 'от ' + ctx.label;
}
