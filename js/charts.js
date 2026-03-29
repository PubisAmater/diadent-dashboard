// ═══ MAIN CHART (Group tab) ═══
function initMainChart() {
  new Chart(document.getElementById('mainChart'), {
    data: {
      labels: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
      datasets: [
        { type:'bar', label:'Факт',    data:[26.4,28.2,30.8,null,null,null,null,null,null,null,null,null], backgroundColor:'#2B5F8E', borderRadius:4, barPercentage:.65, stack:'r' },
        { type:'bar', label:'Прогноз', data:[null,null,4.2,null,null,null,null,null,null,null,null,null],  backgroundColor:'#B5D2EE', borderRadius:4, barPercentage:.65, stack:'r' },
        { type:'line', label:'План',   data:[30,32,35,38,40,42,42,44,46,50,52,55], borderColor:'#C87B1A', borderWidth:2, pointRadius:2.5, pointBackgroundColor:'#C87B1A', tension:.3, fill:false },
        { type:'line', label:'Норма',  data:[63.5,63.5,63.5,63.5,63.5,63.5,63.5,63.5,63.5,63.5,63.5,63.5], borderColor:'rgba(190,188,183,0.6)', borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ctx.parsed.y != null ? ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' млн' : ''
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: '#BBBAB5', font: { size: 10 } } },
        y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#BBBAB5', font: { size: 10 }, callback: v => v + ' млн' }, min: 0, max: 70 }
      }
    }
  });
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', initMainChart);
