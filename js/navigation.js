// ═══ NAVIGATION ═══
let prevTab = 'group';

function sw(tab, btn) {
  // Clear top tabs and sidebar items
  document.querySelectorAll('.tb-tab, .sb-item').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');

  // Hide all views
  ['vg','vc','vd','vedu','vlab'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Show target view
  const map = { group:'vg', clinics:'vc', doctors:'vd', education:'vedu', lab:'vlab' };
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
