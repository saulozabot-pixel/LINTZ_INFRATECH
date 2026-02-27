const fs = require('fs');
const html = fs.readFileSync('docs/pitch-hackathon-infratech.html', 'utf8');

let pass = 0, fail = 0;
function check(label, condition) {
  if (condition) { console.log('OK  ' + label); pass++; }
  else { console.log('FAIL ' + label); fail++; }
}

// Slides
const slideCount = (html.match(/<div class="slide/g) || []).length;
check('Total slides = 12', slideCount === 12);
for (let i = 1; i <= 12; i++) check('Slide s' + i + ' existe', html.includes('id="s' + i + '"'));

// Slide titles
check('S1 Capa - LINTZ', html.includes('Hackathon') && html.includes('Infratech'));
check('S2 O Problema', html.includes('O Problema'));
check('S3 Quem Somos', html.includes('Quem Somos'));
check('S4 Verticais', html.includes('Verticais do Programa'));
check('S5 Selecao', html.includes('Processo de Sele'));
check('S6 Programa', html.includes('9 Meses de'));
check('S7 Beneficios', html.includes('Melhor Escolha'));
check('S8 Mentores', html.includes('Mentores'));
check('S9 Modelo', html.includes('Modelo de Neg'));
check('S10 Cronograma', html.includes('Cronograma 2025'));
check('S11 KPIs', html.includes('Resultados'));
check('S12 CTA', html.includes('Call to Action'));

// JS Navigation
check('JS goTo()', html.includes('function goTo'));
check('JS go()', html.includes('function go'));
check('JS keyboard ArrowRight', html.includes('ArrowRight'));
check('JS keyboard ArrowLeft', html.includes('ArrowLeft'));
check('JS progress bar', html.includes('pbar.style.width'));
check('JS dots navigation', html.includes('dotsEl'));
check('JS Chart.js init', html.includes('function initChart'));
check('JS Chart canvas', html.includes('chartKPI'));

// CSS Classes
const cssClasses = ['.slide', '.nav', '.dots', '.gbox', '.card', '.badge', '.tl-item', '.step', '.vcard', '.sfooter', '.cover-bg', '.logo-m'];
cssClasses.forEach(c => check('CSS ' + c, html.includes(c)));

// Design elements
check('Gradient border animation', html.includes('@keyframes gb'));
check('Pulse animation logo', html.includes('@keyframes pulse'));
check('Fade-up animation', html.includes('@keyframes fu'));
check('Chart.js CDN', html.includes('chart.js'));
check('CSS variables', html.includes('--p:#6C63FF'));

// HTML structure
check('HTML abre corretamente', html.startsWith('<!DOCTYPE html>'));
check('HTML fecha corretamente', html.trim().endsWith('</html>'));
check('Meta charset UTF-8', html.includes('charset="UTF-8"'));
check('Meta viewport', html.includes('viewport'));
check('Title LINTZ', html.includes('LINTZ'));

const size = (html.length / 1024).toFixed(1);
console.log('\nTamanho: ' + size + ' KB');
console.log('RESULTADO: ' + pass + ' OK / ' + fail + ' FALHAS');
if (fail === 0) console.log('PITCH DECK 100% VALIDADO!');
else console.log('Corrija os itens com FAIL acima.');
