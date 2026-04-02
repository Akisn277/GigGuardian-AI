
// ---- LOGIN ----
function toggleLoginTab(i) {
  document.getElementById('lt1').classList.toggle('active', i===0);
  document.getElementById('lt2').classList.toggle('active', i===1);
  document.getElementById('login-form').style.display = i===0 ? 'block' : 'none';
  document.getElementById('register-form').style.display = i===1 ? 'block' : 'none';
}
function enterDashboard() {
  const login = document.getElementById('page-login');
  const app = document.getElementById('app-shell');
  const nav = document.getElementById('main-nav');

  // completely remove login page
  login.style.display = 'none';
  login.classList.remove('active');

  // force hide (extra safety)
  login.style.visibility = 'hidden';
  login.style.position = 'absolute';

  // show app
  app.style.display = 'block';
  nav.style.display = 'flex';

  // scroll to top (important for mobile)
  window.scrollTo(0, 0);
}

// ---- SECTIONS ----
function showSection(id) {
  document.querySelectorAll('#main-content section').forEach(s => s.style.display = 'none');
  document.getElementById('section-'+id).style.display = 'block';
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const sideMap = {dashboard:0,calculator:1,policy:2,triggers:3,claims:4,database:5};
  const sidebar = document.querySelectorAll('.sidebar-item');
  [1,2,3,4,5,6].forEach((pos,i) => { if(i === sideMap[id]) sidebar[pos] && sidebar[pos].classList.add('active'); });
  const navMap = {dashboard:0,calculator:1,policy:2,triggers:3,claims:4,database:5};
  document.querySelectorAll('.nav-tab')[navMap[id]]?.classList.add('active');
}

// ---- CALCULATOR ----
const conds = {rain:false, aqi:false, heat:false, cyclone:false};
function toggleCond(c) {
  conds[c] = !conds[c];
  document.getElementById('tog-'+c).classList.toggle('on', conds[c]);
  updateCalc();
}
function updateCalc() {
  const h = +document.getElementById('sl-hours').value;
  const d = +document.getElementById('sl-del').value;
  const n = +document.getElementById('sl-night').value;
  const e = +document.getElementById('sl-exp').value;
  document.getElementById('v-hours').textContent = h + ' hrs';
  document.getElementById('v-del').textContent = d + ' deliveries';
  document.getElementById('v-night').textContent = n + '%';
  document.getElementById('v-exp').textContent = e + ' months';
  ['hours','del','night','exp'].forEach(id => {
    const el = document.getElementById('sl-'+id);
    const mn = +el.min, mx = +el.max, v = +el.value;
    el.style.setProperty('--pct', ((v-mn)/(mx-mn)*100)+'%');
  });
  let base = 10 + (h * 0.5) + (d * 0.15) + (n * 0.04);
  if(conds.rain) base *= 1.25;
  if(conds.aqi) base *= 1.15;
  if(conds.heat) base *= 1.12;
  if(conds.cyclone) base *= 1.4;
  base = base * Math.max(0.7, 1 - (e/100));
  const risk = Math.min(9.9, Math.max(1, (h/16)*4 + (n/100)*3 + (conds.rain?1.5:0) + (conds.cyclone?2:0) - (e/60)*2));
  document.getElementById('calc-price').textContent = '₹'+base.toFixed(2);
  document.getElementById('calc-monthly').textContent = '₹'+(base*30).toFixed(0);
  document.getElementById('calc-annual').textContent = '₹'+(base*365).toFixed(0);
  document.getElementById('risk-score-val').textContent = risk.toFixed(1)+' / 10';
  document.getElementById('risk-fill').style.width = (risk/10*100)+'%';
  const cov = base > 25 ? '₹5L' : base > 15 ? '₹2L' : '₹50K';
  document.getElementById('cov-amt').textContent = cov;
  ['sl-hours','sl-del','sl-night','sl-exp'].forEach(id => {
    const el = document.getElementById(id);
    const mn=+el.min,mx=+el.max,v=+el.value;
    el.style.setProperty('--pct',((v-mn)/(mx-mn)*100)+'%');
  });
}
setTimeout(updateCalc, 100);

// ---- PLAN SELECT ----
function selectPlan(p) {
  ['basic','standard','premium'].forEach(n => document.getElementById('plan-'+n).classList.toggle('selected', n===p));
}

// ---- DB TABS ----
function switchDbTab(el, tab) {
  document.querySelectorAll('.db-tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  ['policies','claims','riders','json'].forEach(t => {
    const el2 = document.getElementById('db-'+t);
    if(el2) el2.style.display = t===tab ? 'block' : 'none';
  });
}

// ---- CHARTS ----
let chartsInit = false;
function initCharts() {
  if(chartsInit) return; chartsInit = true;

  // Bar chart
  const ctx = document.getElementById('barChart');
  if(ctx) new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
      datasets:[
        { label:'Payouts (₹L)', data:[18,22,19,31,26,24,28,34], backgroundColor:'rgba(0,210,170,0.6)', borderRadius:6, borderSkipped:false },
        { label:'Premiums (₹L)', data:[42,44,46,50,48,52,56,59], backgroundColor:'rgba(77,158,255,0.3)', borderRadius:6, borderSkipped:false }
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:true,
      plugins:{ legend:{ labels:{ color:'#6B7A8D', font:{ family:'DM Sans', size:11 } } } },
      scales:{
        x:{ grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#6B7A8D', font:{family:'DM Sans',size:11} } },
        y:{ grid:{ color:'rgba(255,255,255,0.04)' }, ticks:{ color:'#6B7A8D', font:{family:'DM Sans',size:11} } }
      }
    }
  });

  // Heatmap
  const hm = document.getElementById('heatmap');
  if(hm) {
    const vals = Array.from({length:56}, () => Math.random());
    vals.forEach(v => {
      const c = document.createElement('div');
      c.className = 'heatmap-cell';
      const a = v < 0.25 ? 0.08 : v < 0.5 ? 0.25 : v < 0.75 ? 0.55 : 1;
      c.style.background = `rgba(0,210,170,${a})`;
      c.title = `${Math.round(v*50)} claims`;
      hm.appendChild(c);
    });
  }

  // Policy doughnut
  const pc = document.getElementById('policyDoughnut');
  if(pc) new Chart(pc, {
    type:'doughnut',
    data:{
      labels:['Basic','Standard','Premium'],
      datasets:[{ data:[1,2,1], backgroundColor:['rgba(0,210,170,0.4)','rgba(77,158,255,0.4)','rgba(168,85,247,0.4)'], borderColor:['#00D2AA','#4D9EFF','#A855F7'], borderWidth:1.5 }]
    },
    options:{
      responsive:true, maintainAspectRatio:true, cutout:'68%',
      plugins:{ legend:{ labels:{ color:'#6B7A8D', font:{ family:'DM Sans', size:11 }, padding:12 } } }
    }
  });
}
