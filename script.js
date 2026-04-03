
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

  // show username avatar initial
  const avatar = document.querySelector(".nav-avatar");
  avatar.innerText = localStorage.getItem("user_name")?.charAt(0).toUpperCase() || "U";

  // show role tooltip/badge
  const role = localStorage.getItem("user_role");
  avatar.title = role || "user";

  // apply role-based visibility
  applyRoleAccess();

  // scroll to top (important for mobile)
  window.scrollTo(0, 0);
}

function setWelcomeText() {
  const name = localStorage.getItem("user_name") || "User";
  document.getElementById("welcomeText").innerText = `👋 Welcome, ${name}`;
}

function populateFormWithCredentials() {
  const userName = localStorage.getItem("user_name") || "User";
  const userId = localStorage.getItem("user_id") || "R-00000";

  // Populate form fields with user data
  const formRiderId = document.getElementById("formRiderId");
  const formFullName = document.getElementById("formFullName");
  const formPhone = document.getElementById("formPhone");
  const formUPI = document.getElementById("formUPI");

  if (formRiderId) formRiderId.value = `R-${userId}`;
  if (formFullName) formFullName.value = userName;
  if (formPhone) formPhone.value = "+91 98765 43210"; // Keep default or get from DB
  if (formUPI) formUPI.value = `${userName.toLowerCase().replace(" ", ".")}@upi`;
}

async function loginUser() {
  const email = document.querySelector("#login-form input[type=email]").value;
  const password = document.querySelector("#login-form input[type=password]").value;

  try {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("user_role", data.user.role);

      enterDashboard(); // your existing function
      applyRoleAccess();
      loadDashboard();
      loadMyPolicy();
      setWelcomeText();
      loadMyActivity();
      getRisk();
      loadTriggers();
      populateFormWithCredentials();
    } else {
      alert("Invalid credentials");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

async function registerUser() {
  const name = document.querySelector("#register-form input[placeholder='Name']").value;
  const email = document.querySelector("#register-form input[type=email]").value;
  const password = document.querySelector("#register-form input[type=password]").value;

  try {
    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("Registered successfully!");
      toggleLoginTab(0);
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ---- PLAN SELECTION ----
let selectedPlan = "standard"; // default
let selectedPremium = 18;

function selectPlan(plan) {
  // remove highlight from all
  document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("selected"));

  // highlight selected
  document.getElementById(`plan-${plan}`).classList.add("selected");

  // get values from data attributes
  const card = document.getElementById(`plan-${plan}`);
  selectedPlan = card.dataset.plan;
  selectedPremium = card.dataset.price;

  console.log("Selected Plan:", selectedPlan, "Premium:", selectedPremium);
}

async function createPolicy() {
  const userId = localStorage.getItem("user_id");

  await fetch("http://127.0.0.1:5000/create-policy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      plan: selectedPlan,
      premium: selectedPremium
    })
  });

  alert("Policy created!");
}

async function simulateEvent() {
  const role = localStorage.getItem("user_role");

  if (role !== "driver") return; // 🚨 BLOCK ADMIN

  const events = ["rain", "aqi", "heat", "cyclone"];

  // pick random event
  const randomEvent = events[Math.floor(Math.random() * events.length)];

  currentEvent = randomEvent;

  // force HIGH severity
  currentSeverity = "HIGH";

  showAlert(randomEvent);
}

function showAlert(event) {
  const alertBox = document.getElementById("alertBox");

  alertBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:start;">
      <div style="flex:1;">
        ⚠️ ${event.toUpperCase()} risk detected<br>
        Recommended: Take a break<br><br>
        <button onclick="takeBreak()">Take Break</button>
        <button onclick="continueWork()">Continue</button>
      </div>
      <button onclick="closeAlert()" style="background:none; border:none; color:white; font-size:20px; cursor:pointer; padding:0; margin-left:10px;">×</button>
    </div>
  `;

  alertBox.classList.remove("hidden");
}

async function triggerClaim(amount) {
  const userId = localStorage.getItem("user_id");

  await fetch("http://127.0.0.1:5000/auto-claim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      amount: amount,
      event: currentEvent
    })
  });

  // refresh dashboard
  loadDashboard();
  loadMyClaims();
}

function updateTriggerMessage(event) {
  const el = document.getElementById("triggerMessage");

  if (event === "rain") {
    el.innerText = "🌧️ Rain detected — You are eligible for payout";
  } else if (event === "aqi") {
    el.innerText = "🌫️ AQI spike — You may receive compensation";
  } else {
    el.innerText = "✅ No risk detected";
  }
}

async function loadDashboard() {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("user_role");

  const res = await fetch(
    `http://127.0.0.1:5000/dashboard?user_id=${userId}&role=${role}`
  );

  const data = await res.json();

  if (role === "admin") {
    document.getElementById("stat1").innerText = data.users;
    document.getElementById("stat2").innerText = data.policies;
    document.getElementById("stat3").innerText = "₹" + data.payout;
  } else {
    document.getElementById("stat1").innerText = data.policies;
    document.getElementById("stat2").innerText = data.claims;
    document.getElementById("stat3").innerText = "₹" + data.payout;

    document.getElementById("myPolicies").innerText = data.policies;
    document.getElementById("myClaims").innerText = data.claims;
    document.getElementById("myPayout").innerText = "₹" + data.payout;

    const risk = data.claims > 2 ? "High" : data.claims > 0 ? "Medium" : "Low";
    document.getElementById("myRisk").innerText = risk;
  }
}

// ---- MY POLICY ----
async function loadMyPolicy() {
  const userId = localStorage.getItem("user_id");

  const res = await fetch(
    `http://127.0.0.1:5000/my-policy?user_id=${userId}`
  );

  const data = await res.json();

  if (data) {
    document.getElementById("myPlan").innerText = data.plan;
    document.getElementById("myPremium").innerText = data.premium;
    document.getElementById("myDate").innerText =
      new Date(data.created_at).toLocaleDateString();
  }
}

// ---- MY ACTIVITY ----
async function loadMyActivity() {
  const userId = localStorage.getItem("user_id");

  const res = await fetch(`http://127.0.0.1:5000/my-activity?user_id=${userId}`);
  const data = await res.json();

  const container = document.getElementById("activityList");
  container.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");

    div.innerText =
      item.type === "policy"
        ? "🛡️ You created a policy"
        : "💰 You received a payout";

    container.appendChild(div);
  });
}

// ---- MY CLAIMS ----
async function loadMyClaims() {
  const userId = localStorage.getItem("user_id");

  const res = await fetch(`http://127.0.0.1:5000/my-claims?user_id=${userId}`);
  const data = await res.json();

  const table = document.getElementById("myClaimsTable");
  table.innerHTML = "";

  data.forEach(claim => {
    const row = `
      <tr>
        <td>#C-${claim.id}</td>
        <td>${claim.status}</td>
        <td>₹${claim.amount}</td>
        <td>${claim.status}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// ---- SECTIONS ----
function showSection(section) {
  // hide all sections
  document.querySelectorAll("main section").forEach(sec => {
    sec.style.display = "none";
  });

  // show selected
  document.getElementById("section-" + section).style.display = "block";

  // reset nav tabs
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.classList.remove("active");

    if (tab.dataset.section === section) {
      tab.classList.add("active");
    }
  });

  // reset sidebar
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.classList.remove("active");

    if (item.dataset.section === section) {
      item.classList.add("active");
    }
  });

  // load data for section
  if (section === 'claims') {
    loadMyClaims();
    document.getElementById("claimRider").innerText = `${localStorage.getItem("user_name")} (#R-${localStorage.getItem("user_id")})`;
    document.getElementById("claimUPI").innerText = `${localStorage.getItem("user_name").toLowerCase().replace(" ", ".")}@paytm`;
  }
}

function logout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_role");

  location.reload();
}

function applyRoleAccess() {
  const role = localStorage.getItem("user_role");
  console.log("ROLE:", role); // debug

  if (role === "driver") {
    // hide admin features
    document.querySelectorAll("[data-admin]").forEach(el => {
      el.style.display = "none";
    });
    // show driver features
    document.querySelectorAll("[data-driver]").forEach(el => {
      el.style.display = "block";
    });
  } else {
    // for admins, hide driver features
    document.querySelectorAll("[data-driver]").forEach(el => {
      el.style.display = "none";
    });
  }
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
  document.getElementById('calc-price').textContent = '₹'+(base*7).toFixed(2);
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

// ---- ALERT SYSTEM ----
let score = 80;
let alertShown = false;

async function checkTrigger() {
  const res = await fetch("http://127.0.0.1:5000/trigger?city=Mumbai");
  const data = await res.json();

  const role = localStorage.getItem("user_role");

  if (data.events.some(e => e.value > e.threshold) && !alertShown) {
    if (role === "admin") {
      showAdminBanner(data.events.find(e => e.value > e.threshold));
    } else {
      showAlert(data.events.find(e => e.value > e.threshold).type);
    }
    alertShown = true;
  }
}

function showAdminBanner(event) {
  const alertBox = document.getElementById("alertBox");

  alertBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:start;">
      <div>
        📊 ALERT: ${event.type.toUpperCase()} - ${event.zone}<br>
        Value: ${event.value} (Threshold: ${event.threshold})<br>
        Status: ${event.value > event.threshold ? "CRITICAL" : "WARNING"}
      </div>
      <button onclick="closeAlert()" style="background:none; border:none; color:white; font-size:20px; cursor:pointer; padding:0; margin-left:10px;">×</button>
    </div>
  `;

  alertBox.classList.remove("hidden");
}

function closeAlert() {
  document.getElementById("alertBox").classList.add("hidden");
  alertShown = false;
}

function takeBreak() {
  document.getElementById("alertBox").classList.add("hidden");

  // HIGH payout
  triggerClaim(500);

  alert("✅ You followed the alert. Full payout credited: ₹500");
}

function continueWork() {
  document.getElementById("alertBox").classList.add("hidden");

  // LOWER payout
  triggerClaim(200);

  alert("⚠️ You ignored alert. Reduced payout: ₹200");
}

function resetAlert() {
  alertShown = false;
}

// Alerts only trigger on manual "Simulate Risk" click
// setInterval(checkTrigger, 60000);

// ---- TRIGGER CARDS ----
function getRiskInfo(event) {
  let risk = "SAFE";
  let action = "Continue working";

  if (event.type === "rain") {
    if (event.value > event.threshold) {
      risk = "HIGH";
      action = "Avoid working – payout active";
    } else if (event.value > event.threshold * 0.7) {
      risk = "MODERATE";
      action = "Take short break";
    }
  }

  if (event.type === "aqi") {
    if (event.value > 300) {
      risk = "HIGH";
      action = "Avoid outdoor work";
    } else if (event.value > 150) {
      risk = "MODERATE";
      action = "Limit exposure";
    }
  }

  if (event.type === "cyclone") {
    if (event.value >= 1) {
      risk = "HIGH";
      action = "Stop working immediately";
    }
  }

  if (event.type === "heat") {
    if (event.value > 45) {
      risk = "HIGH";
      action = "Avoid working";
    } else if (event.value > 38) {
      risk = "MODERATE";
      action = "Stay hydrated, take breaks";
    }
  }

  return { risk, action };
}

async function loadTriggers() {
  const res = await fetch("http://127.0.0.1:5000/trigger?city=Mumbai");
  const data = await res.json();

  const container = document.getElementById("triggerCards");
  container.innerHTML = "";

  data.events.forEach(event => {
    const { risk, action } = getRiskInfo(event);

    const card = `
      <div class="card">
        <h3>${event.type.toUpperCase()} - ${event.zone}</h3>
        <p>Value: ${event.value}</p>
        <p class="risk-${risk.toLowerCase()}">${risk} RISK</p>
        <p>${action}</p>
      </div>
    `;

    container.innerHTML += card;
  });
}

setInterval(loadTriggers, 10000);

// ---- FRAUD DETECTION ----
async function checkFraud() {
  const res = await fetch("http://127.0.0.1:5000/check-fraud", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ claims_today: 4 })
  });

  const data = await res.json();

  if (data.fraud) {
    alert("⚠️ Fraud detected! Claim rejected");
  }
}

// ---- FALSE ALARM CREDIT ----
function falseAlarm() {
  alert("₹30 credited for false alert 🎉");
}

// ---- AI RISK SCORE ----
async function getRisk() {
  const res = await fetch("http://127.0.0.1:5000/risk");
  const data = await res.json();

  document.getElementById("riskScore").innerText = data.score;
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
