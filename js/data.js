// ═══ FINANCIAL DATA (source: Google Sheets ОДДС, 2026) ═══
// Revenue: Приход, Раздел ОДДС = '2. Основная деятельность',
//          Статья: 'Оплата за медицинские услуги' | 'Оплата от страховых компаний'
// Expenses: Расход, Раздел ОДДС = '2. Основная деятельность'
const FINANCIAL_DATA = {
  currentMonth: 3,
  currentYear:  2026,

  // Revenue per clinic per month (rubles)
  revenue: {
    diana:     { 1: 5148412, 2: 6003331, 3: 6367998, 4: 1460469 }, // Светлановский
    diadent:   { 1: 4276448, 2: 6276587, 3: 5605411, 4: 1246134 }, // Серпуховская
    diadent53: { 1: 4054382, 2: 4603284, 3: 5526138, 4: 1132974 }, // Просвещения
    diadent110:{ 1: 5755969, 2: 5260523, 3: 5416535, 4:  940793 }, // Бухарестская
    diadent124:{ 1: 4700535, 2: 5698846, 3: 5492321, 4: 1347372 }, // Энгельса
    ztl:       { 1:       0, 2:       0, 3:       0, 4:       0 }, // Лаборатория
  },

  // Operational expenses per clinic per month (rubles)
  expenses: {
    diana:     { 1: 2894541, 2: 3888366, 3: 3927897, 4:  503600 },
    diadent:   { 1: 3999833, 2: 4887134, 3: 3693489, 4:  928374 },
    diadent53: { 1: 3685269, 2: 4183205, 3: 5282320, 4:   68833 },
    diadent110:{ 1: 4699189, 2: 6216550, 3: 4121079, 4:  718166 },
    diadent124:{ 1: 4665105, 2: 4841400, 3: 5983122, 4: 1080706 },
    ztl:       { 1:   25575, 2:  211027, 3:  878960, 4:       0 },
  },

  // Group totals by month
  groupRevenue:  { 1: 23935746, 2: 27842571, 3: 28408403, 4: 6127742 },
  groupExpenses: { 1: 19969512, 2: 24227683, 3: 23886867, 4: 3299679 },

  // Taxes per month (included in expenses above, for EBITDA calc)
  taxes: { 1: 1067541, 2: 1405699, 3: 1795674, 4: 2483190 },

  // March 2026 expense breakdown by article (rubles)
  marchExpenses: {
    salary:      8655120, // ФОТ total (наличные + через банк)
    medMat:      4304677, // Медицинские материалы, медикаменты
    mainMat:     2186575, // Основные материалы для лечения
    rent:        2750000, // Аренда помещений
    admin:       1487729, // Административно-хозяйственные расходы
    taxes:       1795674, // Налоги
    marketing:    763736, // Реклама и маркетинг
    it:           531554, // Корпоративные цифровые сервисы
    services:     490582, // Услуги сторонних организаций
    equipMed:     390675, // Медицинское оборудование
    facility:     254193, // Содержание помещений
    training:     222636, // Подбор, обучение, развитие персонала
    bankComm:      42392, // Комиссия банка
    other:         11324, // Прочее
  },

  // Clinic metadata
  clinics: {
    diana:     { name: 'Светлановский',  company: 'ДИАНА',      color: '#2E8B57' },
    diadent:   { name: 'Серпуховская',   company: 'ДИАДЕНТ',    color: '#2B5F8E' },
    diadent53: { name: 'Просвещения',    company: 'ДИАДЕНТ53',  color: '#4A7FC1' },
    diadent110:{ name: 'Бухарестская',   company: 'ДИАДЕНТ110', color: '#D85A30' },
    diadent124:{ name: 'Энгельса',       company: 'ДИАДЕНТ124', color: '#C07E24' },
    ztl:       { name: 'Лаборатория',    company: 'ЗТЛ',        color: '#888'    },
  },
};

// Derived helpers
function fd_rev(code, month)  { return (FINANCIAL_DATA.revenue[code]  || {})[month] || 0; }
function fd_exp(code, month)  { return (FINANCIAL_DATA.expenses[code] || {})[month] || 0; }
function fd_grp_rev(month)    { return FINANCIAL_DATA.groupRevenue[month]  || 0; }
function fd_grp_exp(month)    { return FINANCIAL_DATA.groupExpenses[month] || 0; }
function fd_ebitda(month)     { return fd_grp_rev(month) - (fd_grp_exp(month) - (FINANCIAL_DATA.taxes[month] || 0)); }
function fd_net(month)        { return fd_grp_rev(month) - fd_grp_exp(month); }
function fd_pct(v, total)     { return total ? Math.round(v / total * 100) : 0; }
function fd_mln(rub, dec = 1) { return (rub / 1e6).toFixed(dec).replace('.', ','); }

// ═══ DOCTORS DATA ═══
const DOCTORS = {
  volkov:    { initials:'ВД', name:'Волков Д.С.',   spec:'Имплантология',  clinic:'Бухарестская',  av:'#E6F1FB', avt:'#185FA5', rev:3.8, revSpec:8.4, revClinic:9.5, revGroup:30.8, revPlan:4.5, specName:'Имплантология', visits:42, avgTicket:90476, margin:'38%' },
  nilov:     { initials:'НА', name:'Нилов А.Р.',    spec:'Имплантология',  clinic:'Серпуховская',  av:'#EAF3DE', avt:'#3B6D11', rev:2.6, revSpec:8.4, revClinic:7.2, revGroup:30.8, revPlan:3.0, specName:'Имплантология', visits:30, avgTicket:86667, margin:'36%' },
  gorin:     { initials:'ГС', name:'Горин С.В.',    spec:'Имплантология',  clinic:'Энгельса',      av:'#FAECE7', avt:'#993C1D', rev:2.0, revSpec:8.4, revClinic:4.1, revGroup:30.8, revPlan:2.2, specName:'Имплантология', visits:22, avgTicket:90909, margin:'35%' },
  karaseva:  { initials:'КМ', name:'Карасёва М.А.', spec:'Ортодонтия',     clinic:'Серпуховская',  av:'#E6F1FB', avt:'#185FA5', rev:4.8, revSpec:6.4, revClinic:7.2, revGroup:30.8, revPlan:5.0, specName:'Ортодонтия',   visits:38, avgTicket:126316, margin:'35%' },
  lebedeva:  { initials:'ЛЕ', name:'Лебедева Е.А.', spec:'Ортодонтия',    clinic:'Бухарестская',  av:'#EAF3DE', avt:'#3B6D11', rev:1.0, revSpec:6.4, revClinic:9.5, revGroup:30.8, revPlan:1.2, specName:'Ортодонтия',   visits:14, avgTicket:71429, margin:'33%' },
  mitina:    { initials:'МТ', name:'Митина Т.В.',   spec:'Ортодонтия',     clinic:'Светлановский', av:'#F4F2EE', avt:'#888',    rev:0.6, revSpec:6.4, revClinic:3.8, revGroup:30.8, revPlan:0.8, specName:'Ортодонтия',   visits:10, avgTicket:60000, margin:'30%' },
  zakharov:  { initials:'ЗА', name:'Захаров А.В.',  spec:'Хирургия',       clinic:'Бухарестская',  av:'#FAECE7', avt:'#993C1D', rev:2.2, revSpec:4.0, revClinic:9.5, revGroup:30.8, revPlan:2.5, specName:'Хирургия',     visits:28, avgTicket:78571, margin:'31%' },
  morozov:   { initials:'МО', name:'Морозов О.К.',  spec:'Хирургия',       clinic:'Энгельса',      av:'#F4F2EE', avt:'#888',    rev:1.1, revSpec:4.0, revClinic:4.1, revGroup:30.8, revPlan:1.3, specName:'Хирургия',     visits:15, avgTicket:73333, margin:'28%' },
  kuznetsov: { initials:'КА', name:'Кузнецов А.Д.', spec:'Хирургия',       clinic:'Серпуховская',  av:'#EAF3DE', avt:'#3B6D11', rev:0.7, revSpec:4.0, revClinic:7.2, revGroup:30.8, revPlan:0.9, specName:'Хирургия',     visits:10, avgTicket:70000, margin:'27%' },
  serov:     { initials:'СП', name:'Серов П.Г.',    spec:'Протезирование', clinic:'Бухарестская',  av:'#E6F1FB', avt:'#185FA5', rev:2.1, revSpec:3.6, revClinic:9.5, revGroup:30.8, revPlan:2.3, specName:'Протезирование', visits:32, avgTicket:65625, margin:'29%' },
  kozlov:    { initials:'КВ', name:'Козлов В.Н.',   spec:'Протезирование', clinic:'Серпуховская',  av:'#EAF3DE', avt:'#3B6D11', rev:1.1, revSpec:3.6, revClinic:7.2, revGroup:30.8, revPlan:1.3, specName:'Протезирование', visits:18, avgTicket:61111, margin:'27%' },
  petrova:   { initials:'ПИ', name:'Петрова И.Н.',  spec:'Терапия',        clinic:'Серпуховская',  av:'#FAECE7', avt:'#993C1D', rev:1.4, revSpec:2.8, revClinic:7.2, revGroup:30.8, revPlan:1.6, specName:'Терапия',      visits:62, avgTicket:22581, margin:'21%' },
  fedorova:  { initials:'ФА', name:'Фёдорова А.С.', spec:'Терапия',        clinic:'Светлановский', av:'#F4F2EE', avt:'#888',    rev:0.9, revSpec:2.8, revClinic:3.8, revGroup:30.8, revPlan:1.0, specName:'Терапия',      visits:44, avgTicket:20455, margin:'19%' },
  nilova:    { initials:'НО', name:'Нилова О.Р.',   spec:'Пародонтология', clinic:'Бухарестская',  av:'#EAF3DE', avt:'#3B6D11', rev:1.0, revSpec:1.5, revClinic:9.5, revGroup:30.8, revPlan:1.1, specName:'Пародонтология', visits:24, avgTicket:41667, margin:'19%' },
};

// ═══ SHARE CONTEXTS ═══
const SHARE_CONTEXTS = {
  spec:   { label: 'специальности', getTotal: d => d.revSpec,   getAll: d => getSpecPeers(d) },
  clinic: { label: 'выручки филиала', getTotal: d => d.revClinic, getAll: d => getClinicPeers(d) },
  group:  { label: 'выручки группы', getTotal: d => d.revGroup, getAll: d => [{ name: d.name, val: d.rev }, { name: 'Остальные', val: d.revGroup - d.rev }] },
};

const PALETTE = ['#2B5F8E','#4A8B6E','#7BA7BF','#B87416','#D85A30','#AA3B3B','#888','#C8C6BD'];

function getSpecPeers(d) {
  return Object.values(DOCTORS).filter(x => x.spec === d.spec).sort((a,b) => b.rev - a.rev).map(x => ({ name: x.name, val: x.rev }));
}

function getClinicPeers(d) {
  const others = d.revClinic - d.rev;
  return [{ name: d.name, val: d.rev }, { name: 'Остальные врачи', val: others }];
}
