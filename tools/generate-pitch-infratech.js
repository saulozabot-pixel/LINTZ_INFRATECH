const fs = require('fs');
const path = require('path');

const css = `
:root{--p:#6C63FF;--c:#00D4FF;--gold:#F59E0B;--g:#10B981;--dk:#0A0E1A;--dk2:#111827;--tx:#E2E8F0;--mt:#64748B;--mt2:#94A3B8;--rd:#EF4444;--or:#F97316;--pk:#EC4899;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;background:var(--dk);color:var(--tx);font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;}
.deck{width:100vw;height:100vh;position:relative;}
.slide{position:absolute;inset:0;display:none;flex-direction:column;padding:24px 46px 14px;background:var(--dk);overflow:hidden;}
.slide.active{display:flex;}
.slide::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--p),var(--c),var(--gold),var(--g),var(--pk),var(--p));background-size:400%;animation:gb 6s linear infinite;z-index:10;}
@keyframes gb{0%{background-position:0%}100%{background-position:400%}}
.slide::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(108,99,255,.03) 1px,transparent 0);background-size:32px 32px;pointer-events:none;z-index:0;}
.slide>*{position:relative;z-index:1;}
.pbar{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--p),var(--c),var(--gold));transition:width .5s cubic-bezier(.4,0,.2,1);z-index:1000;}
.nav{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;z-index:999;background:rgba(10,14,26,.96);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border:1px solid rgba(108,99,255,.3);border-radius:50px;padding:5px 16px;box-shadow:0 4px 30px rgba(108,99,255,.25);}
.nav button{background:none;border:none;color:var(--p);font-size:16px;cursor:pointer;padding:4px 8px;border-radius:20px;transition:all .2s;}
.nav button:hover{background:rgba(108,99,255,.2);transform:scale(1.1);}
.nav button:disabled{color:var(--mt);cursor:default;transform:none;}
#sc{color:var(--mt2);font-size:11px;min-width:52px;text-align:center;font-weight:600;}
.dots{position:fixed;right:14px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:6px;z-index:999;}
.dot{width:6px;height:6px;border-radius:50%;background:var(--mt);cursor:pointer;transition:all .25s;}
.dot.active{background:var(--p);transform:scale(1.8);box-shadow:0 0 8px var(--p);}
.dot:hover{background:var(--mt2);}
.tag{font-size:9px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:var(--p);margin-bottom:4px;display:flex;align-items:center;gap:6px;}
.tag::before{content:'';width:18px;height:2px;background:linear-gradient(90deg,var(--p),var(--c));border-radius:2px;}
h1{font-size:clamp(22px,3vw,46px);font-weight:900;line-height:1.05;letter-spacing:-1px;}
h2{font-size:clamp(14px,1.9vw,26px);font-weight:800;line-height:1.15;letter-spacing:-.5px;}
h3{font-size:clamp(10px,1vw,13px);font-weight:700;}
.sub{font-size:clamp(9px,.9vw,12px);color:var(--mt2);margin-top:4px;line-height:1.6;}
.hl{background:linear-gradient(135deg,var(--p),var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hlg{background:linear-gradient(135deg,var(--gold),var(--or));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hlgr{background:linear-gradient(135deg,var(--g),var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.tc{color:var(--c);}.tp{color:var(--p);}.tg{color:var(--gold);}.tgr{color:var(--g);}.tm{color:var(--mt2);}
.card{background:rgba(17,24,39,.85);border:1px solid rgba(108,99,255,.12);border-radius:14px;padding:11px 15px;}
.card-c{border-color:rgba(0,212,255,.18);}.card-g{border-color:rgba(245,158,11,.18);}.card-gr{border-color:rgba(16,185,129,.18);}.card-r{border-color:rgba(239,68,68,.15);}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.kpi{text-align:center;padding:8px;}
.kv{font-size:clamp(13px,1.9vw,27px);font-weight:900;color:var(--p);}
.kl{font-size:9px;color:var(--mt);text-transform:uppercase;letter-spacing:1.5px;margin-top:2px;}
.ks{font-size:10px;color:var(--tx);margin-top:1px;}
.gnum{font-size:clamp(22px,2.8vw,42px);font-weight:900;background:linear-gradient(135deg,var(--p),var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;}
table{width:100%;border-collapse:collapse;font-size:10px;}
th{background:rgba(108,99,255,.12);color:var(--p);padding:5px 9px;text-align:left;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid rgba(108,99,255,.2);}
td{padding:5px 9px;border-bottom:1px solid rgba(255,255,255,.04);}
tr:hover td{background:rgba(108,99,255,.05);}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;}
.bp{background:rgba(108,99,255,.2);color:var(--p);border:1px solid rgba(108,99,255,.3);}
.bc{background:rgba(0,212,255,.12);color:var(--c);border:1px solid rgba(0,212,255,.25);}
.bg{background:rgba(245,158,11,.12);color:var(--gold);border:1px solid rgba(245,158,11,.25);}
.bgr{background:rgba(16,185,129,.12);color:var(--g);border:1px solid rgba(16,185,129,.25);}
.br{background:rgba(239,68,68,.12);color:var(--rd);border:1px solid rgba(239,68,68,.25);}
.bo{background:rgba(249,115,22,.12);color:var(--or);border:1px solid rgba(249,115,22,.25);}
.bpk{background:rgba(236,72,153,.12);color:var(--pk);border:1px solid rgba(236,72,153,.25);}
.pb{height:5px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden;margin-top:3px;}
.pb-p{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--p),var(--c));}
.pb-g{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--g),var(--c));}
.pb-gold{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--gold),var(--or));}
.il{list-style:none;}
.il li{display:flex;align-items:flex-start;gap:6px;padding:2px 0;font-size:10px;line-height:1.5;}
.il li::before{content:'\\25B8';flex-shrink:0;color:var(--p);margin-top:1px;}
.il.ck li::before{content:'\\2713';color:var(--g);font-weight:800;}
.il.st li::before{content:'\\2605';color:var(--gold);}
.mrow{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);}
.mrow:last-child{border-bottom:none;}
.mrow-l{font-size:10px;color:var(--mt2);}
.mrow-v{font-size:11px;font-weight:700;}
.cover-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse at 10% 50%,rgba(108,99,255,.18) 0%,transparent 50%),radial-gradient(ellipse at 90% 15%,rgba(0,212,255,.12) 0%,transparent 45%),radial-gradient(ellipse at 60% 90%,rgba(245,158,11,.08) 0%,transparent 45%),var(--dk);}
.cover-c{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:center;height:100%;}
.logo-m{width:54px;height:54px;border-radius:14px;background:linear-gradient(135deg,var(--p),var(--c));display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;margin-bottom:14px;box-shadow:0 0 50px rgba(108,99,255,.6);animation:pulse 3s ease infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 30px rgba(108,99,255,.4);}50%{box-shadow:0 0 60px rgba(108,99,255,.7),0 0 100px rgba(0,212,255,.3);}}
.sfooter{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:5px;border-top:1px solid rgba(255,255,255,.06);font-size:9px;color:var(--mt);}
.gbox{background:linear-gradient(135deg,rgba(108,99,255,.08),rgba(0,212,255,.04));border:1px solid rgba(108,99,255,.2);border-radius:12px;padding:9px 13px;}
.gbox-gold{background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(249,115,22,.04));border:1px solid rgba(245,158,11,.2);border-radius:12px;padding:9px 13px;}
.gbox-gr{background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(0,212,255,.04));border:1px solid rgba(16,185,129,.2);border-radius:12px;padding:9px 13px;}
.gbox-rd{background:linear-gradient(135deg,rgba(239,68,68,.08),rgba(249,115,22,.04));border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:9px 13px;}
.step{display:flex;align-items:flex-start;gap:11px;padding:8px 12px;background:rgba(17,24,39,.85);border-radius:12px;border:1px solid rgba(108,99,255,.12);}
.snum{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--c));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 0 12px rgba(108,99,255,.4);}
.stitle{font-size:11px;font-weight:700;}
.sdesc{font-size:10px;color:var(--mt2);margin-top:2px;line-height:1.4;}
.vcard{background:rgba(17,24,39,.85);border:1px solid rgba(108,99,255,.1);border-radius:12px;padding:9px 11px;transition:all .25s;}
.vcard:hover{border-color:rgba(108,99,255,.4);transform:translateY(-3px);box-shadow:0 8px 24px rgba(108,99,255,.15);}
.vi{font-size:17px;margin-bottom:3px;}
.vt{font-size:10px;font-weight:700;color:var(--p);margin-bottom:2px;}
.vd{font-size:9px;color:var(--mt2);line-height:1.35;}
.tl-item{display:flex;gap:13px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);}
.tl-item:last-child{border-bottom:none;}
.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.tl-date{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;}
.tl-title{font-size:11px;font-weight:700;margin-top:2px;}
.tl-desc{font-size:10px;color:var(--mt2);margin-top:1px;line-height:1.4;}
.hbox{background:linear-gradient(135deg,rgba(108,99,255,.12),rgba(0,212,255,.06));border:1px solid rgba(108,99,255,.3);border-radius:12px;padding:10px 14px;position:relative;overflow:hidden;}
.hbox::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--p),var(--c));}
.slide.active .card,.slide.active .kpi,.slide.active h1,.slide.active h2,.slide.active .step,.slide.active .vcard,.slide.active .gbox,.slide.active .gbox-gold,.slide.active .gbox-gr,.slide.active .tl-item{animation:fu .4s ease both;}
.slide.active .card:nth-child(2),.slide.active .step:nth-child(2),.slide.active .vcard:nth-child(2),.slide.active .tl-item:nth-child(2){animation-delay:.06s;}
.slide.active .card:nth-child(3),.slide.active .step:nth-child(3),.slide.active .vcard:nth-child(3),.slide.active .tl-item:nth-child(3){animation-delay:.12s;}
.slide.active .card:nth-child(4),.slide.active .step:nth-child(4),.slide.active .vcard:nth-child(4),.slide.active .tl-item:nth-child(4){animation-delay:.18s;}
.slide.active .tl-item:nth-child(5){animation-delay:.24s;}
.slide.active .tl-item:nth-child(6){animation-delay:.30s;}
@keyframes fu{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
`;

const nav = `
<div class="pbar" id="pbar"></div>
<div class="nav">
  <button id="btnPrev" onclick="go(-1)" disabled>&#8592;</button>
  <span id="sc">1 / 12</span>
  <button id="btnNext" onclick="go(1)">&#8594;</button>
  <span style="color:var(--mt);font-size:10px;margin-left:4px;">&#8592; &#8594;</span>
</div>
<div class="dots" id="dots"></div>
`;

const js = `
<script>
const slides = document.querySelectorAll('.slide');
const total = slides.length;
let cur = 0;
const dotsEl = document.getElementById('dots');
const sc = document.getElementById('sc');
const pbar = document.getElementById('pbar');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

slides.forEach((_,i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i===0?' active':'');
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
});

function goTo(n) {
  slides[cur].classList.remove('active');
  dotsEl.children[cur].classList.remove('active');
  cur = Math.max(0, Math.min(total-1, n));
  slides[cur].classList.add('active');
  dotsEl.children[cur].classList.add('active');
  sc.textContent = (cur+1) + ' / ' + total;
  pbar.style.width = ((cur+1)/total*100) + '%';
  btnPrev.disabled = cur === 0;
  btnNext.disabled = cur === total-1;
  if (cur === 10) initChart();
}

function go(d) { goTo(cur + d); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
});

pbar.style.width = (1/total*100) + '%';

let chartDone = false;
function initChart() {
  if (chartDone) return;
  chartDone = true;
  const ctx = document.getElementById('chartKPI');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Startups Aceleradas','Empregos Gerados','Receita Média (R$K)','Taxa de Sobrevivência (%)','Captação Média (R$K)'],
      datasets: [{
        label: 'Resultados Esperados',
        data: [15, 120, 380, 87, 250],
        backgroundColor: ['rgba(108,99,255,.7)','rgba(0,212,255,.7)','rgba(245,158,11,.7)','rgba(16,185,129,.7)','rgba(236,72,153,.7)'],
        borderColor: ['#6C63FF','#00D4FF','#F59E0B','#10B981','#EC4899'],
        borderWidth: 1, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94A3B8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,.04)' } },
        y: { ticks: { color: '#94A3B8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,.06)' } }
      }
    }
  });
}
<\/script>
`;

// ─── SLIDES ────────────────────────────────────────────────────────────────

const s1 = `
<div class="slide active" id="s1">
<div class="cover-bg"></div>
<div class="cover-c">
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
    <div class="logo-m">&#x1F680;</div>
    <div>
      <div style="font-size:9px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:var(--p);">LINTZ ESCRITÓRIO DE PROJETOS</div>
      <div style="font-size:11px;color:var(--mt2);margin-top:2px;">Campinas/SP &middot; Bairro Cambuí &middot; 2025</div>
    </div>
  </div>
  <h1 style="max-width:720px;margin-bottom:8px;">
    Hackathon <span class="hl">Infratech</span><br>
    Startups <span class="hlg">2025</span>
  </h1>
  <p style="max-width:600px;font-size:14px;color:var(--mt2);line-height:1.8;margin-bottom:20px;">
    O programa de aceleração que transforma ideias em soluções reais para infraestrutura, mobilidade e cidades inteligentes.<br>
    <strong style="color:var(--tx);font-size:15px;">15 vagas. 9 meses. Impacto real. Sua startup no próximo nível.</strong>
  </p>
  <div style="display:flex;gap:0;align-items:stretch;background:rgba(17,24,39,.7);border:1px solid rgba(108,99,255,.2);border-radius:14px;overflow:hidden;max-width:680px;margin-bottom:16px;">
    <div style="padding:11px 16px;border-right:1px solid rgba(255,255,255,.06);">
      <div style="font-size:17px;margin-bottom:2px;">&#x1F3D9;</div>
      <div style="font-size:12px;font-weight:700;color:var(--tx);">Campinas/SP</div>
      <div style="font-size:10px;color:var(--mt2);">Espaço Infratech</div>
    </div>
    <div style="padding:11px 16px;border-right:1px solid rgba(255,255,255,.06);">
      <div style="font-size:17px;margin-bottom:2px;">&#x23F1;</div>
      <div style="font-size:12px;font-weight:700;color:var(--tx);">9 Meses</div>
      <div style="font-size:10px;color:var(--mt2);">+ 6 prorrogáveis</div>
    </div>
    <div style="padding:11px 16px;border-right:1px solid rgba(255,255,255,.06);">
      <div style="font-size:17px;margin-bottom:2px;">&#x1F3AF;</div>
      <div style="font-size:12px;font-weight:700;color:var(--c);">15 Vagas</div>
      <div style="font-size:10px;color:var(--mt2);">Seleção em 3 etapas</div>
    </div>
    <div style="padding:11px 16px;border-right:1px solid rgba(255,255,255,.06);">
      <div style="font-size:17px;margin-bottom:2px;">&#x1F310;</div>
      <div style="font-size:12px;
