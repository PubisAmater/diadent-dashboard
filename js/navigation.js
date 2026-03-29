// ═══ TAB NAVIGATION ═══
let prevTab = 'group';
let prevTabBtn = null;

function sw(tab, btn) {
  document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  ['vg','vc','vd'].forEach(id => document.getElementById(id).classList.add('hidden'));
  const map = { group:'vg', clinics:'vc', doctors:'vd' };
  document.getElementById(map[tab]).classList.remove('hidden');

  if (tab === 'doctors' && !currentDoctor) {
    buildDocList();
    selectDoctor('karaseva');
  }
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
  prevTab = prevTabBtn ? prevTabBtn.textContent.trim() : 'group';

  sw('doctors', btn);
  document.getElementById('back-link').style.display = 'flex';
  buildDocList();
  selectDoctor(id);
}

function goBack() {
  document.getElementById('back-link').style.display = 'none';
  const map = { 'Группа': 'group', 'Филиалы': 'clinics' };
  const tabKey = map[prevTab] || 'group';
  const btns = document.querySelectorAll('.sb-item');
  const targetBtn = Array.from(btns).find(b => {
    const t = b.textContent.trim();
    return (tabKey === 'group' && t === 'Группа') || (tabKey === 'clinics' && t === 'Филиалы');
  });
  if (targetBtn) sw(tabKey, targetBtn);
}
