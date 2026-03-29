// ═══ NAVIGATION ═══
let prevTab = 'group';

// History
const navHistory = ['group'];
let navIndex = 0;

function _updateHistBtns() {
  const b = document.getElementById('btn-back');
  const f = document.getElementById('btn-fwd');
  if (b) b.disabled = navIndex <= 0;
  if (f) f.disabled = navIndex >= navHistory.length - 1;
}

function histBack() {
  if (navIndex <= 0) return;
  navIndex--;
  _swNoHistory(navHistory[navIndex]);
  _updateHistBtns();
}

function histForward() {
  if (navIndex >= navHistory.length - 1) return;
  navIndex++;
  _swNoHistory(navHistory[navIndex]);
  _updateHistBtns();
}

// Internal: navigate without pushing to history
function _swNoHistory(tab) {
  document.querySelectorAll('.tb-tab, .sb-item').forEach(b => b.classList.remove('on'));
  const btn = document.querySelector(`.tb-tab[data-tab="${tab}"]`) || document.querySelector(`.sb-item[data-tab="${tab}"]`);
  if (btn) btn.classList.add('on');
  ['vg','vc','vd','vedu','vlab','vdept-sales','vdept-marketing','vdept-hr','vdept-tech','vdept-production','vrev','vebitda'].forEach(id => {
    const el = document.getElementById(id); if (el) el.classList.add('hidden');
  });
  const map = { group:'vg', clinics:'vc', doctors:'vd', education:'vedu', lab:'vlab', 'dept-sales':'vdept-sales', 'dept-marketing':'vdept-marketing', 'dept-hr':'vdept-hr', 'dept-tech':'vdept-tech', 'dept-production':'vdept-production', revenue:'vrev', ebitda:'vebitda' };
  const viewId = map[tab]; if (viewId) document.getElementById(viewId).classList.remove('hidden');
  if (tab === 'doctors' && !currentDoctor) { buildDocList(); selectDoctor('karaseva'); }
}

function sw(tab, btn) {
  // Push to history (truncate forward stack)
  if (navHistory[navIndex] !== tab) {
    navHistory.splice(navIndex + 1);
    navHistory.push(tab);
    navIndex = navHistory.length - 1;
  }
  _updateHistBtns();

  // Clear top tabs and sidebar items
  document.querySelectorAll('.tb-tab, .sb-item').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');

  // Hide all views
  ['vg','vc','vd','vedu','vlab','vdept-sales','vdept-marketing','vdept-hr','vdept-tech','vdept-production','vrev','vebitda'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Show target view
  const map = {
    group:'vg', clinics:'vc', doctors:'vd', education:'vedu', lab:'vlab',
    'dept-sales':'vdept-sales', 'dept-marketing':'vdept-marketing',
    'dept-hr':'vdept-hr', 'dept-tech':'vdept-tech', 'dept-production':'vdept-production',
    revenue:'vrev', ebitda:'vebitda'
  };
  const viewId = map[tab];
  if (viewId) document.getElementById(viewId).classList.remove('hidden');

  if (tab === 'doctors' && !currentDoctor) {
    buildDocList();
    selectDoctor('karaseva');
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function toggleDrill(btn, panelId) {
  const panel = document.getElementById(panelId);
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

function toggleSpec(row, drillId) {
  const drill = document.getElementById(drillId);
  const isOpen = row.classList.contains('active');
  const card = row.closest('.dc');
  card.querySelectorAll('.spec-row.active').forEach(r => r.classList.remove('active'));
  card.querySelectorAll('.drill.open').forEach(d => d.classList.remove('open'));
  if (!isOpen) {
    row.classList.add('active');
    drill.classList.add('open');
  }
}

function openDoctor(id) {
  const activeTop = document.querySelector('.tb-tab.on');
  prevTab = activeTop ? activeTop.dataset.tab : 'group';

  sw('doctors', document.getElementById('tab-doctors'));
  document.getElementById('back-link').style.display = 'flex';
  buildDocList();
  selectDoctor(id);
}

function goBack() {
  document.getElementById('back-link').style.display = 'none';
  const tabKey = prevTab || 'group';
  const targetBtn = document.querySelector(`.tb-tab[data-tab="${tabKey}"]`);
  sw(tabKey, targetBtn || document.querySelector('.tb-tab[data-tab=group]'));
}
