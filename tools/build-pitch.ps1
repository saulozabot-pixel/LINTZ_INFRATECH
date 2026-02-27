# Build Hackathon Infratech Pitch Deck
$out = "docs/pitch-hackathon-infratech.html"

$head = @'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hackathon Infratech Startups 2025 — LINTZ</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
:root{--p:#6C63FF;--c:#00D4FF;--gold:#F59E0B;--g:#10B981;--dk:#0D1117;--dk2:#161B27;--dk3:#1C2333;--tx:#E2E8F0;--mt:#64748B;--mt2:#94A3B8;--rd:#EF4444;--or:#F97316;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;background:var(--dk);color:var(--tx);font-family:'Segoe UI',system-ui,sans-serif;overflow:hidden;}
.deck{width:100vw;height:100vh;position:relative;}
.slide{position:absolute;inset:0;display:none;flex-direction:column;padding:28px 44px 18px;background:var(--dk);overflow:hidden;}
.slide.active{display:flex;}
.slide::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--p),var(--c),var(--gold),var(--g),var(--p));background-size:300%;animation:gb 5s linear infinite;}
@keyframes gb{0%{background-position:0%}100%{background-position:300%}}
.slide::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(108,99,255,.04) 1px,transparent 0);background-size:30px 30px;pointer-events:none;z-index:0;}
.slide>*{position:relative;z-index:1;}
.nav{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;z-index:999;background:rgba(13,17,23,.97);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(108,99,255,.25);border-radius:50px;padding:5px 14px;box-shadow:0 4px 20px rgba(108,99,255,.2);}
.nav button{background:none;border:none;color:var(--p);font-size:15px;cursor:pointer;padding:3px 7px;border-radius:20px;transition:background .2s;}
.nav button:hover{background:rgba(108,99,255,.15);}
.nav button:disabled{color:var(--mt);cursor:default;}
#sc{color:var(--mt2);font-size:11px;min-width:48px;text-align:center;}
.pbar{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--p),var(--c),var(--gold));transition:width .4s;z-index:1000;}
.dots{position:fixed;right:11px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px;z-index:999;}
.dot{width:6px;height:6px;border-radius:50%;background:var(--mt);cursor:pointer;transition:all .2s;}
.dot.active{background:var(--p);transform:scale(1.6);box-shadow:0 0 7px var(--p);}
.tag{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--p);margin-bottom:4px;}
h1{font-size:clamp(20px,2.8vw,42px);font-weight:800;line-height:1.1;}
h2{font-size:clamp(14px,1.8vw,25px);font-weight:700;line-height:1.2;}
h3{font-size:clamp(10px,1vw,13px);font-weight:600;}
.sub{font-size:clamp(9px,.9vw,12px);color:var(--mt2);margin-top:4px;line-height:1.5;}
.hl{color:var(--p);}.hlc{color:var(--c);}.hlg{color:var(--gold);}.hlgr{color:var(--g);}
.card{background:var(--dk2);border:1px solid rgba(108,99,255,.12);border-radius:12px;padding:11px 15px;}
.card-c{border-color:rgba(0,212,255,.15);}.card-g{border-color:rgba(245,158,11,.15);}.card-gr{border-color:rgba(16,185,129,.15);}.card-r{border-color:rgba(239,68,68,.12);}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.kpi{text-align:center;}
.kv{font-size:clamp(13px,1.8vw,26px);font-weight:800;color:var(--p);}
.kl{font-size:9px;color:var(--mt);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
.ks{font-size:10px;color:var(--tx);margin-top:1px;}
table{width:100%;border-collapse:collapse;font-size:10px;}
th{background:rgba(108,99,255,.1);color:var(--p);padding:5px 8px;text-align:left;font-size:9px;letter-spacing:1px;text-transform:uppercase;}
td{padding:5px 8px;border-bottom:1px solid rgba(255,255,255,.04);}
tr:hover td{background:rgba(108,99,255,.04);}
.tp{color:var(--p);font-weight:700;}.tc{color:var(--c);font-weight:700;}.tg{color:var(--gold);font-weight:700;}.tgr{color:var(--g);font-weight:700;}.tm{color:var(--mt2);}
.badge{display:inline-block;padding:2px 7px;border-radius:20px;font-size:9px;font-weight:700;}
.bp{background:rgba(108,99,255,.2);color:var(--p);}.bc{background:rgba(0,212,255,.15);color:var(--c);}
.bg{background:rgba(245,158,11,.15);color:var(--gold);}.bgr{background:rgba(16,185,129,.15);color:var(--g);}
.br{background:rgba(239,68,68,.15);color:var(--rd);}.bo{background:rgba(249,115,22,.15);color:var(--or);}
.pb{height:5px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden;margin-top:3px;}
.pb-p{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--p),var(--c));}
.pb-g{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--g),var(--c));}
.pb-gold{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--gold),var(--or));}
.il{list-style:none;}
.il li{display:flex;align-items:flex-start;gap:6px;padding:2px 0;font-size:10px;line-height:1.4;}
.il li::before{content:'&#9658;';flex-shrink:0;color:var(--p);}
.il.ck li::before{content:'&#10003;';color:var(--g);font-weight:700;}
.il.st li::before{content:'&#9733;';color:var(--gold);}
.mrow{display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04);}
.mrow:last-child{border-bottom:none;}
.mrow-l{font-size:10px;color:var(--mt2);}
.mrow-v{font-size:11px;font-weight:700;}
.cover-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse at 15% 50%,rgba(108,99,255,.12) 0%,transparent 55%),radial-gradient(ellipse at 85% 20%,rgba(0,212,255,.08) 0%,transparent 50%),radial-gradient(ellipse at 50% 90%,rgba(245,158,11,.06) 0%,transparent 50%),var(--dk);}
.cover-c{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:center;height:100%;}
.logo-m{width:52px;height:52px;border-radius:13px;background:linear-gradient(135deg,var(--p),var(--c));display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;margin-bottom:14px;box-shadow:0 0 40px rgba(108,99,255,.5);}
.sfooter{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:5px;border-top:1px solid rgba(255,255,255,.05);font-size:9px;color:var(--mt);}
.gbox{background:linear-gradient(135deg,rgba(108,99,255,.08),rgba(0,212,255,.05));border:1px solid rgba(108,99,255,.2);border-radius:10px;padding:9px 13px;}
.gbox-gold{background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(249,115,22,.05));border-color:rgba(245,158,11,.2);}
.gbox-gr{background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(0,212,255,.05));border-color:rgba(16,185,129,.2);}
.gnum{font-size:clamp(22px,2.8vw,42px);font-weight:900;background:linear-gradient(135deg,var(--p),var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;}
.step{display:flex;align-items:flex-start;gap:10px;padding:8px 12px;background:var(--dk2);border-radius:10px;border:1px solid rgba(108,99,255,.1);}
.snum{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--c));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;}
.stitle{font-size:11px;font-weight:700;}
.sdesc{font-size:10px;color:var(--mt2);margin-top:2px;line-height:1.4;}
.vcard{background:var(--dk2);border:1px solid rgba(108,99,255,.1);border-radius:10px;padding:9px 11px;transition:all .2s;}
.vcard:hover{border-color:rgba(108,99,255,.3);transform:translateY(-2px);}
.vi{font-size:16px;margin-bottom:3px;}
.vt{font-size:10px;font-weight:700;color:var(--p);margin-bottom:2px;}
.vd{font-size:9px;color:var(--mt2);line-height:1.3;}
.tl-item{display:flex;gap:12px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);}
.tl-item:last-child{border-bottom:none;}
.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:3px;}
.tl-date{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;}
.tl-title{font-size:11px;font-weight:600;margin-top:1px;}
.tl-desc{font-size:10px;color:var(--mt2);margin-top:1px;}
.slide.active .card,.slide.active .kpi,.slide.active h1,.slide.active h2,.slide.active .step,.slide.active .vcard{animation:fu .35s ease both;}
@keyframes fu{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
</style>
</head>
<body>
<div class="pbar" id="pbar"></div>
<div class="deck" id="deck">
'@

$s1 = @'
<div class="slide active" id="s1">
<div class="cover-bg"></div>
<div class="cover-c">
  <div class="logo-m">&#128640;</div>
  <div class="tag">LINTZ Escritório de Projetos &middot; Campinas/SP &middot; 2025</div>
  <h1 style="max-width:680px;">Hackathon <span class="hl">Infratech</span><br>Startups <span class="hlc">2025</span></h1>
  <p style="max-width:580px;margin-top:12px;font-size:14px;color:var(--mt2);line-height:1.7;">O programa de aceleração que transforma ideias em soluções reais para infraestrutura, mobilidade e cidades inteligentes. <strong style="color:var(--tx);">15 vagas. 9 meses. Impacto real.</strong></p>
  <div style="display:flex;gap:16px;margin-top:20px;flex-wrap:wrap;align-items:center;">
    <div style="font-size:10px;color:var(--mt2);"><strong style="color:var(--tx);display:block;font-size:13px;">&#127961; Campinas/SP</strong>Espaço Infratech &middot; Cambuí</div>
    <div style="width:1px;height:30px;background:rgba(255,255,255,.1);"></div>
    <div style="font-size:10px;color:var(--mt2);"><strong style="color:var(--tx);display:block;font-size:13px;">&#9201; 9 Meses</strong>+ 6 meses prorrogáveis</div>
    <div style="width:1px;height:30px;background:rgba(255,255,255,.1);"></div>
    <div style="font-size:10px;color:var(--mt2);"><strong style="color:var(--tx);display:block;font-size:13px;">&#127919; 15 Vagas</strong>Startups selecionadas</div>
    <div style="width:1px;height:30px;background:rgba(255,255,255,.1);"></div>
    <div style="font-size:10px;color:var(--mt2);"><strong style="color:var(--tx);display:block;font-size:13px;">&#127760; Híbrido</strong>Online + Presencial</div>
    <div style="width:1px;height:30px;background:rgba(255,255,255,.1);"></div>
    <div style="font-size:10px;color:var(--mt2);"><strong style="color:var(--tx);display:block;font-size:13px;">&#128197; Início</strong>14 de Janeiro 2025</div>
  </div>
  <div style="display:flex;gap:7px;margin-top:18px;flex-wrap:wrap;">
    <span class="badge bp">&#127959; Infratech</span><span class="badge bc">&#128663; Mobility</span>
    <span class="badge bg">&#127961; Smart Cities</span><span class="badge bgr">&#127807; ESG</span>
    <span class="badge bo">&#128230; LogTech</span><span class="badge br">&#127891; EdTech</span>
    <span class="badge bp">&#127822; FoodTech</span><span class="badge bc">&#127973; HealthTech</span>
    <span class="badge bg">&#127918; Games</span>
  </div>
</div>
<div class="sfooter"><span>LINTZ Escritório de Projetos &middot; Hackathon Infratech Startups 2025</span><span>CONFIDENCIAL &mdash; Não distribuir sem autorização</span></div>
</div>
'@

$s2 = @'
<div class="slide" id="s2">
<div class="tag">O Problema</div>
<h2>A Infraestrutura Brasileira <span class="hl">Precisa de Inovação</span></h2>
<p class="sub">O Brasil investe menos de 2% do PIB em infraestrutura &mdash; metade do recomendado. A tecnologia é a alavanca que faltava.</p>
<div style="margin-top:10px;" class="g2">
  <div style="display:flex;flex-direction:column;gap:9px;">
    <div class="card card-r">
      <h3 style="margin-bottom:6px;color:var(--rd);">&#9888; O Gap de Inovação</h3>
      <ul class="il">
        <li>Setor de infraestrutura opera com tecnologia de 20+ anos atrás</li>
        <li>Processos manuais, ineficientes e sem rastreabilidade digital</li>
        <li>Falta de integração entre energia, transporte e saneamento</li>
        <li>Startups inovadoras sem acesso ao mercado de infraestrutura</li>
        <li>Empreendedores sem mentoria especializada em Infratech</li>
      </ul>
    </div>
    <div class="card card-c">
      <h3 style="margin-bottom:6px;color:var(--c);">&#127760; A Transformação Digital Chegou</h3>
      <ul class="il ck">
        <li>5G + IoT gerando dados massivos de ativos de infraestrutura</li>
        <li>IA e Big Data permitindo manutenção preditiva e eficiência</li>
        <li>Mobilidade elétrica e autônoma redefinindo transportes urbanos</li>
        <li>Smart Cities demandando soluções integradas e escaláveis</li>
        <li>G20 definiu Infratech como prioridade global de investimento</li>
      </ul>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:9px;">
    <div class="g2" style="gap:9px;">
      <div class="card kpi"><div class="gnum">R$1,7T</div><div class="kl">Déficit de Infraestrutura</div><div class="ks">Brasil precisa investir até 2035</div></div>
      <div class="card kpi"><div class="gnum" style="background:linear-gradient(135deg,var(--c),var(--g));-webkit-background-clip:text;background-clip:text;">1,8%</div><div class="kl">Investimento Atual do PIB</div><div class="ks">Meta recomendada: 4%</div></div>
    </div>
    <div class="g2" style="gap:9px;">
      <div class="card kpi"><div class="gnum" style="background:linear-gradient(135deg,var(--gold),var(--or));-webkit-background-clip:text;background-clip:text;">+340%</div><div class="kl">Crescimento Infratech</div><div class="ks">Investimentos globais 2020&ndash;2024</div></div>
      <div class="card kpi"><div class="gnum" style="background:linear-gradient(135deg,var(--g),var(--c));-webkit-background-clip:text;background-clip:text;">$2,5T</div><div class="kl">Mercado Global Infratech</div><div class="ks">Projeção 2030 (McKinsey)</div></div>
    </div>
    <div class="gbox">
      <h3 style="color:var(--p);margin-bottom:4px;">&#128161; A Janela de Oportunidade</h3>
      <p style="font-size:10px;color:var(--mt2);line-height:1.5;">Regulação favorável, capital disponível e demanda reprimida criam a maior janela de oportunidade para startups de Infratech da última década. <strong style="color:var(--tx);">Quem entrar agora, lidera o mercado.</strong></p>
    </div>
  </div>
</div>
<div class="sfooter"><span>LINTZ &middot; Hackathon Infratech 2025</span><span>2 / 12</span></div>
</div>
'@

$s3 = @'
<div class="slide" id="s3">
<div class="tag">Quem Somos</div>
<h2>LINTZ: <span class="hl">Onde Projetos Viram</span> <span class="hlc">Realidade</span></h2>
<p class="sub">Mais do que uma aceleradora &mdash; somos o ecossistema completo que conecta empreendedores, mentores, investidores e mercado.</p>
<div style="margin-top:10px;" class="g2">
  <div style="display:flex;flex-direction:column;gap:9px;">
    <div class="card">
      <h3 style="margin-bottom:7px;color:var(--p);">&#127963; Nossa Identidade</h3>
      <ul class="il ck">
        <li><strong>LINTZ Escritório de Projetos</strong> &mdash; aceleradora especializada em Infratech</li>
        <li>Fundada pelo Dr. Luís Gustavo Pilenso Lintz em Campinas/SP</li>
        <li>Parceria com MEH &mdash; Movimento Educacional Híbrido</li>
        <li>Plataforma DoctorCoach + QEMP (Quociente Empreendedor)</li>
        <li>Rede de mentores, avaliadores e investidores especializados</li>
        <li>Espaço físico no coração de Campinas &mdash; Bairro Cambuí</li>
      </ul>
    </div>
    <div class="card card-c">
      <h3 style="margin-bottom:7px;color:var(--c);">&#127919; Nossa Especialidade</h3>
      <div class="mrow"><span class="mrow-l">Infratech &amp; Mobilidade Urbana</span><span class="mrow-v tp">Core</span></div>
      <div class="mrow"><span class="mrow-l">Smart Cities &amp; Sustentabilidade</span><span class="mrow-v tc">Foco</span></div>
      <div class="mrow"><span class="mrow-l">LogTech &amp; Supply Chain</span><span class="mrow-v tg">Vertical</span></div>
      <div class="mrow"><span class="mrow-l">EdTech &amp; Comportamento</span><span class="mrow-v tgr">Vertical</span></div>
      <div class="mrow"><span class="mrow-l">FoodTech &amp; HealthTech</span><span class="mrow-v tm">Vertical</span></div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:9px;">
    <div class="g2" style="gap:9px;">
      <div class="card kpi"><div class="kv">9 meses</div><div class="kl">Programa de Aceleração</div><div class="ks">+ 6 meses prorrogáveis</div></div>
      <div class="card kpi"><div class="kv" style="color:var(--c);">15</div><div class="kl">Vagas por Edição</div><div class="ks">Seleção em 3 etapas</div></div>
    </div>
    <div class="g2" style="gap:9px;">
      <div class="card kpi"><div class="kv" style="color:var(--gold);">3</div><div class="kl">Programas Simultâneos</div><div class="ks">Hackathon + AVOC + JEDH335</div></div>
      <div class="card kpi"><div class="kv" style="color:var(--g);">100%</div><div class="kl">Propriedade Intelectual</div><div class="ks">Permanece com o fundador</div></div>
    </div>
    <div class="gbox-gold">
      <h3 style="color:var(--gold);margin-bottom:4px;">&#127942; Nossa Filosofia</h3>
      <p style="font-size:10px;color:var(--mt2);line-height:1.5;font-style:italic;">"Produto você leva na mala, na caixa e transporta. Serviço leva na mente e no coração." &mdash; <strong style="color:var(--tx);">Gustavo Lintz</strong></p>
    </div>
  </div>
</div>
<div class="sfooter"><span>LINTZ &middot; Hackathon Infratech 2025</span><span>3 / 12</span></div>
</div>
'@

$s4 = @'
<div class="slide" id="s4">
<div class="tag">Verticais do Programa</div>
<h2>9 Verticais de <span class="hl">Inovação</span> &mdash; Onde Sua Startup <span class="hlc">Se Encaixa?</span></h2>
<p class="sub">Buscamos soluções que transformem infraestrutura, mobilidade
