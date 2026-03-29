// ═══ TAB NAVIGATION ═══
let prevTab = 'group';
let prevTabBtn = null;

function sw(tab, btn) {
  document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  ['vg','vc','vd','vedu','vlab'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const map = { group:'vg', clinics:'vc', doctors:'vd', education:'vedu', lab:'vlab' };
  const viewId = map[tab];
  if (viewId) document.getElementById(viewId).classList.remove('hidden');

  if (tab === 'doctors' && !currentDoctor) {
    buildDocList();
    selectDoctor('karaseva');
  }
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('collapsed');
}

function toggleClinicsDrop(btn) {
  const group = document.getElementById('sb-clinics-group');
  const isOpen = group.classList.contains('open');
  group.classList.toggle('open', !isOpen);
  // If opening, also navigate to clinics tab
  if (!isOpen) sw('clinics', btn);
}

function openClinic(id) {
  // Navigate to clinics tab and highlight the given clinic
  const clinicsBtn = document.querySelector('.sb-item[data-tab=clinics]');
  sw('clinics', clinicsBtn);
  // Scroll to clinic card
  const nameMap = {
    serpukhovskaya: 'Серпуховская', bukharestskaya: 'Бухарестская',
    svetlanovsky: 'Светлановский', engelsa: 'Энгельса', kupchinskaya: 'Купчинская'
  };
  document.querySelectorAll('.sb-subitem').forEach(b => b.classList.remove('on'));
  setTimeout(() => {
    const cards = document.querySelectorAll('.nc-name');
    for (const c of cards) {
      if (c.textContent.trim() === nameMap[id]) {
        c.closest('.nc').scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  }, 50);
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
  const btn = document.getElementById('tab-doctors');
  prevTabBtn = document.querySelector('.sb-item.on');
  prevTab = prevTabBtn ? (prevTabBtn.dataset.tab || 'group') : 'group';

  sw('doctors', btn);
  document.getElementById('back-link').style.display = 'flex';
  buildDocList();
  selectDoctor(id);
}

function goBack() {
  document.getElementById('back-link').style.display = 'none';
  const tabKey = prevTab || 'group';
  const targetBtn = document.querySelector(`.sb-item[data-tab="${tabKey}"]`);
  if (targetBtn) sw(tabKey, targetBtn);
  else sw('group', document.querySelector('.sb-item[data-tab=group]'));
}
