/**
 * ============================================================
 *  GERADOR DE PLANILHA DE CONTROLE DE PROJETOS
 *  Autor: Saulo Zabot | Versão: 1.0
 *
 *  COMO USAR:
 *  1. Abra sheets.google.com e crie uma planilha nova
 *  2. Vá em Extensões > Apps Script
 *  3. Apague o código padrão e cole TODO este arquivo
 *  4. Clique em "Executar" > selecione "criarPlanilhaProjetos"
 *  5. Autorize as permissões e aguarde ~30 segundos
 * ============================================================
 */

// ── CONFIGURAÇÕES ────────────────────────────────────────────
var CFG = {
  valorHora: 80,
  projetos: [
    {nome:"Lux Driver",emoji:"🚗",cor:"#1a73e8",status:"Em Desenvolvimento"},
    {nome:"Projeto 2", emoji:"📦",cor:"#34a853",status:"Planejamento"},
    {nome:"Projeto 3", emoji:"🔧",cor:"#fbbc04",status:"Planejamento"},
    {nome:"Projeto 4", emoji:"🚀",cor:"#ea4335",status:"Planejamento"}
  ],
  AE:"#0d1b2a", AM:"#1a3a5c", AC:"#1a73e8", AP:"#d2e3fc",
  VE:"#137333", VP:"#ceead6",
  RE:"#c5221f", RP:"#fce8e6",
  OE:"#e37400", OP:"#fef9e7",
  LE:"#b06000", LP:"#fef3e2",
  XE:"#6200ea", XP:"#ede7f6",
  CC:"#f8f9fa", CM:"#e8eaed", CZ:"#5f6368",
  BR:"#ffffff", PT:"#202124"
};

// ── FUNÇÃO PRINCIPAL ─────────────────────────────────────────
function criarPlanilhaProjetos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename("Controle de Projetos — Saulo Zabot");
  var antigas = ss.getSheets();
  criarCapa(ss);
  for (var i=0;i<CFG.projetos.length;i++) criarProjeto(ss,CFG.projetos[i],i===0);
  antigas.forEach(function(a){
    var n=a.getName();
    if(["Plan1","Sheet1","Página1","Planilha1"].indexOf(n)>=0){try{ss.deleteSheet(a);}catch(e){}}
  });
  ss.setActiveSheet(ss.getSheetByName("🏠 CAPA"));
  ss.toast("Planilha criada com sucesso! 🎉\nDuplique qualquer aba 'Projeto X' para novos projetos.","✅ Concluído",12);
}

// ── HELPERS ──────────────────────────────────────────────────
function cel(aba,r,c,v,o){
  var x=aba.getRange(r,c);
  if(v!==null&&v!==undefined) x.setValue(v);
  _o(x,o); return x;
}
function mes(aba,rng,v,o){
  var x=aba.getRange(rng);
  try{x.merge();}catch(e){}
  if(v!==null&&v!==undefined) x.setValue(v);
  _o(x,o); return x;
}
function _o(x,o){
  if(!o)return;
  if(o.bg)x.setBackground(o.bg);
  if(o.fg)x.setFontColor(o.fg);
  if(o.b)x.setFontWeight("bold");
  if(o.sz)x.setFontSize(o.sz);
  if(o.al)x.setHorizontalAlignment(o.al);
  if(o.va)x.setVerticalAlignment(o.va);
  if(o.wr)x.setWrap(true);
  if(o.fm)x.setNumberFormat(o.fm);
  if(o.bd)x.setBorder(true,true,true,true,false,false,"#cccccc",SpreadsheetApp.BorderStyle.SOLID);
  if(o.bm)x.setBorder(true,true,true,true,false,false,"#888888",SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}
function hSec(a,r,t,bg,fg){
  a.setRowHeight(r,32);
  mes(a,"B"+r+":H"+r,t,{bg:bg,fg:fg||CFG.BR,b:true,sz:12,al:"left",va:"middle"});
}
function hTab(a,r,hs,bg,fg){
  a.setRowHeight(r,26);
  var cs=[2,3,4,5,6,7,8];
  for(var i=0;i<hs.length&&i<7;i++)
    cel(a,r,cs[i],hs[i],{bg:bg,fg:fg||CFG.BR,b:true,sz:9,al:"center",va:"middle",bd:true});
}
function sp(a,r,h){a.setRowHeight(r,h||16);a.getRange(r,1,1,9).setBackground(CFG.BR);}
function fmtMoeda(x){return '"R$" #,##0.00';}

// ── ABA CAPA ─────────────────────────────────────────────────
function criarCapa(ss){
  var a=ss.getSheetByName("🏠 CAPA");
  if(!a)a=ss.insertSheet("🏠 CAPA",0);
  a.clear(); a.setTabColor(CFG.AC); a.setHiddenGridlines(true);
  a.setColumnWidth(1,30);a.setColumnWidth(2,210);a.setColumnWidth(3,160);
  [4,5,6,7,8].forEach(function(c){a.setColumnWidth(c,135);});
  a.setColumnWidth(9,30);
  var r=1;

  a.setRowHeight(r,65);
  mes(a,"B"+r+":H"+r,"🗂️  CONTROLE DE PROJETOS",{bg:CFG.AE,fg:CFG.BR,b:true,sz:24,al:"center",va:"middle"});r++;
  a.setRowHeight(r,28);
  mes(a,"B"+r+":H"+r,"Saulo Zabot  •  Gestão & Desenvolvimento de Software",{bg:CFG.AM,fg:CFG.AP,sz:12,al:"center",va:"middle"});r++;
  a.setRowHeight(r,22);
  mes(a,"B"+r+":H"+r,"📅  Criado em: "+Utilities.formatDate(new Date(),"America/Sao_Paulo","dd/MM/yyyy"),{bg:CFG.AM,fg:"#8ab4f8",sz:10,al:"center",va:"middle"});r++;
  sp(a,r,20);r++;

  // Tabela de projetos
  a.setRowHeight(r,34);
  mes(a,"B"+r+":H"+r,"📊  RESUMO DE PROJETOS",{bg:CFG.CM,fg:CFG.AM,b:true,sz:13,al:"left",va:"middle"});r++;
  hTab(a,r,["PROJETO","STATUS","TOTAL APORTES","TOTAL GASTOS","SALDO","HORAS INVEST.","FASE ATUAL"],CFG.AM,CFG.BR);r++;

  var fases=["Desenvolvimento","Planejamento","Planejamento","Planejamento"];
  for(var i=0;i<CFG.projetos.length;i++){
    var p=CFG.projetos[i],bg=i%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(r,32);
    cel(a,r,2,p.emoji+"  "+p.nome,{bg:bg,fg:CFG.PT,b:i===0,sz:11,al:"left",va:"middle",bd:true});
    var sc=p.status==="Em Desenvolvimento"?CFG.AC:p.status==="Concluído"?CFG.VE:CFG.CZ;
    cel(a,r,3,p.status,{bg:bg,fg:sc,b:true,sz:10,al:"center",va:"middle",bd:true});
    if(i===0){
      var rf="'🚗 Lux Driver'";
      var fs=["=IFERROR("+rf+"!C5,0)","=IFERROR("+rf+"!C6,0)","=IFERROR("+rf+"!C7,0)","=IFERROR("+rf+"!C8,0)"];
      var fms=[fmtMoeda(),fmtMoeda(),fmtMoeda(),'0.0"h"'];
      for(var fi=0;fi<4;fi++){
        var cc=a.getRange(r,4+fi);
        cc.setFormula(fs[fi]);
        _o(cc,{bg:bg,fg:CFG.PT,sz:11,al:"right",va:"middle",fm:fms[fi],bd:true});
      }
    } else {
      for(var ci=4;ci<=6;ci++) cel(a,r,ci,0,{bg:bg,fg:CFG.CZ,sz:11,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
      cel(a,r,7,"0h",{bg:bg,fg:CFG.CZ,sz:11,al:"center",va:"middle",bd:true});
    }
    cel(a,r,8,fases[i],{bg:bg,fg:CFG.CZ,sz:10,al:"center",va:"middle",bd:true});
    r++;
  }
  sp(a,r,20);r++;

  // Indicadores Lux Driver
  a.setRowHeight(r,34);
  mes(a,"B"+r+":H"+r,"🚗  INDICADORES — LUX DRIVER",{bg:CFG.AM,fg:CFG.BR,b:true,sz:13,al:"left",va:"middle"});r++;
  var inds=[
    ["💰 Total Investido (Aportes)","=IFERROR('🚗 Lux Driver'!C5,0)",CFG.VP,CFG.VE],
    ["💸 Total Gasto",              "=IFERROR('🚗 Lux Driver'!C6,0)",CFG.RP,CFG.RE],
    ["📊 Saldo (Aporte − Gasto)",   "=IFERROR('🚗 Lux Driver'!C7,0)",CFG.AP,CFG.AC],
    ["⏱️ Custo Total em Horas",     "=IFERROR('🚗 Lux Driver'!C8,0)",CFG.LP,CFG.LE],
    ["⚠️ Total Imprevistos",        "=IFERROR('🚗 Lux Driver'!C9,0)",CFG.OP,CFG.OE],
    ["🕐 Valor/Hora Configurado",   "=IFERROR('🚗 Lux Driver'!C10,0)",CFG.XP,CFG.XE]
  ];
  for(var ii=0;ii<inds.length;ii++){
    var ind=inds[ii];
    a.setRowHeight(r,30);
    cel(a,r,2,ind[0],{bg:ind[2],fg:ind[3],b:true,sz:11,al:"left",va:"middle",bd:true});
    var ic=a.getRange(r,3);
    ic.setFormula(ind[1]);
    _o(ic,{bg:ind[2],fg:ind[3],b:true,sz:14,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
    mes(a,"D"+r+":H"+r,"",{bg:ind[2],bd:true});
    r++;
  }
  sp(a,r,20);r++;

  // Legenda
  a.setRowHeight(r,32);
  mes(a,"B"+r+":H"+r,"🏷️  LEGENDA DE STATUS",{bg:CFG.CM,fg:CFG.AM,b:true,sz:12,al:"left",va:"middle"});r++;
  var legs=[
    ["🔵 Planejamento","Projeto em fase de planejamento e definição de escopo"],
    ["🟡 Em Desenvolvimento","Desenvolvimento ativo em andamento"],
    ["🟠 Em Implantação","Produto sendo implantado / publicado nas lojas"],
    ["🟢 Em Manutenção","Produto em produção, recebendo atualizações e suporte"],
    ["✅ Concluído","Projeto finalizado e entregue"],
    ["⏸️ Pausado","Projeto temporariamente pausado"]
  ];
  for(var li=0;li<legs.length;li++){
    var bg2=li%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(r,26);
    cel(a,r,2,legs[li][0],{bg:bg2,fg:CFG.PT,b:true,sz:10,al:"left",va:"middle",bd:true});
    mes(a,"C"+r+":H"+r,legs[li][1],{bg:bg2,fg:CFG.CZ,sz:10,al:"left",va:"middle",bd:true});
    r++;
  }
  sp(a,r,20);r++;

  // Instruções
  a.setRowHeight(r,32);
  mes(a,"B"+r+":H"+r,"📌  COMO USAR ESTA PLANILHA",{bg:CFG.CM,fg:CFG.AM,b:true,sz:12,al:"left",va:"middle"});r++;
  var ins=[
    "1️⃣  Cada projeto tem sua própria aba — clique nas abas na parte inferior da tela",
    "2️⃣  Registre APORTES (investimentos recebidos ou realizados) na seção correspondente",
    "3️⃣  Registre todos os GASTOS nas categorias: Créditos (APIs/Cloud), Diversos e Imprevistos",
    "4️⃣  Registre as HORAS TRABALHADAS para calcular o custo real de desenvolvimento",
    "5️⃣  As PREVISÕES de 6 meses e 1 ano são editáveis — ajuste conforme seu planejamento",
    "6️⃣  O RESUMO FINANCEIRO é calculado automaticamente com base nos seus registros",
    "7️⃣  Para adicionar novo projeto: clique com botão direito em uma aba > Duplicar > Renomeie"
  ];
  for(var ni=0;ni<ins.length;ni++){
    var bgi=ni%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(r,28);
    mes(a,"B"+r+":H"+r,ins[ni],{bg:bgi,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
    r++;
  }
  sp(a,r,20);r++;
  a.setRowHeight(r,26);
  mes(a,"B"+r+":H"+r,"© "+new Date().getFullYear()+"  Saulo Zabot  •  Controle de Projetos v1.0",{bg:CFG.AE,fg:CFG.CZ,sz:9,al:"center",va:"middle"});
  return a;
}

// ── ABA DE PROJETO ───────────────────────────────────────────
// Layout fixo de linhas (para fórmulas do RESUMO funcionarem):
// L1-3:Cabeçalho | L4-11:Resumo | L12-23:Info | L24-47:Aportes
// L48-71:Créditos | L72-95:Diversos | L96-119:Horas | L120-138:Imprevistos
// L139-149:Prev.6m | L150-166:Prev.1ano | L167:Rodapé
function criarProjeto(ss,proj,isLux){
  var nome=proj.emoji+" "+proj.nome;
  var a=ss.getSheetByName(nome);
  if(!a)a=ss.insertSheet(nome);
  a.clear(); a.setTabColor(proj.cor); a.setHiddenGridlines(true);

  a.setColumnWidth(1,30);a.setColumnWidth(2,115);a.setColumnWidth(3,270);
  a.setColumnWidth(4,140);a.setColumnWidth(5,120);a.setColumnWidth(6,120);
  a.setColumnWidth(7,120);a.setColumnWidth(8,200);a.setColumnWidth(9,30);

  // ── L1: Cabeçalho ─────────────────────────────────────────
  a.setRowHeight(1,60);
  mes(a,"B1:H1",proj.emoji+"  "+proj.nome.toUpperCase(),{bg:CFG.AE,fg:CFG.BR,b:true,sz:22,al:"center",va:"middle"});
  a.setRowHeight(2,26);
  mes(a,"B2:H2","Controle de Desenvolvimento, Implantação e Manutenção",{bg:CFG.AM,fg:CFG.AP,sz:11,al:"center",va:"middle"});
  sp(a,3,16);

  // ── L4-11: RESUMO FINANCEIRO ──────────────────────────────
  a.setRowHeight(4,32);
  mes(a,"B4:H4","💰  RESUMO FINANCEIRO",{bg:CFG.AM,fg:CFG.BR,b:true,sz:13,al:"left",va:"middle"});

  var resumo=[
    [5,"Total de Aportes",       "=SUM(F26:F45)",          CFG.VP,CFG.VE],
    [6,"Total de Gastos",        "=SUM(F50:F69)+SUM(F74:F93)+SUM(E122:E136)", CFG.RP,CFG.RE],
    [7,"Saldo (Aportes − Gastos)","=C5-C6",                CFG.AP,CFG.AC],
    [8,"Custo Total em Horas",   "=SUM(G98:G117)",         CFG.LP,CFG.LE],
    [9,"Total de Imprevistos",   "=SUM(E122:E136)",        CFG.OP,CFG.OE],
    [10,"Valor/Hora (editável)", CFG.valorHora,             CFG.XP,CFG.XE]
  ];
  for(var ri=0;ri<resumo.length;ri++){
    var rv=resumo[ri];
    a.setRowHeight(rv[0],30);
    cel(a,rv[0],2,rv[1],{bg:rv[3],fg:rv[4],b:true,sz:11,al:"left",va:"middle",bd:true});
    var rc=a.getRange(rv[0],3);
    if(typeof rv[2]==="string"&&rv[2].charAt(0)==="=") rc.setFormula(rv[2]);
    else rc.setValue(rv[2]);
    _o(rc,{bg:rv[3],fg:rv[4],b:true,sz:14,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
    mes(a,"D"+rv[0]+":H"+rv[0],"",{bg:rv[3],bd:true});
  }
  sp(a,11,16);

  // ── L12-23: INFORMAÇÕES DO PROJETO ───────────────────────
  a.setRowHeight(12,32);
  mes(a,"B12:H12","📋  INFORMAÇÕES DO PROJETO",{bg:CFG.AM,fg:CFG.BR,b:true,sz:12,al:"left",va:"middle"});

  var infos=[
    ["Nome do Projeto",         isLux?"Lux Driver":proj.nome],
    ["Status",                  isLux?"Em Desenvolvimento":"Planejamento"],
    ["Data de Início",          isLux?"01/01/2025":""],
    ["Previsão de Conclusão",   isLux?"31/12/2025":""],
    ["Responsável",             isLux?"Saulo Zabot":""],
    ["Plataforma / Tecnologia", isLux?"Android / React Native / Capacitor / TypeScript":""],
    ["Descrição",               isLux?"App de gestão para motoristas: cálculo de ganhos, OCR de comprovantes, dashboard financeiro":""],
    ["Repositório / Link",      isLux?"github.com/saulo/lux-driver":""],
    ["Versão Atual",            isLux?"1.0.0":""],
    ["Próxima Versão",          isLux?"1.1.0":""]
  ];
  for(var ii=0;ii<infos.length;ii++){
    var row=13+ii;
    a.setRowHeight(row,26);
    var bg=ii%2===0?CFG.BR:CFG.CC;
    cel(a,row,2,infos[ii][0],{bg:CFG.AP,fg:CFG.AM,b:true,sz:10,al:"left",va:"middle",bd:true});
    mes(a,"C"+row+":H"+row,infos[ii][1],{bg:bg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true,wr:true});
  }
  sp(a,23,16);

  // ── L24-47: APORTES ───────────────────────────────────────
  // Colunas: B=Data C=Descrição D=Fonte E=Tipo F=Valor G=Comprovante H=Obs
  a.setRowHeight(24,32);
  mes(a,"B24:H24","💵  APORTES  —  Investimentos & Receitas do Projeto",{bg:CFG.VE,fg:CFG.BR,b:true,sz:12,al:"left",va:"middle"});
  hTab(a,25,["DATA","DESCRIÇÃO / ORIGEM","FONTE","TIPO","VALOR (R$)","COMPROVANTE","OBSERVAÇÕES"],CFG.VP,CFG.VE);
  for(var di=0;di<20;di++){
    var dr=26+di,par=di%2===0;
    a.setRowHeight(dr,24);
    var dbg=par?CFG.BR:CFG.CC;
    if(isLux&&di===0){
      cel(a,dr,2,"01/01/2025",{bg:dbg,fg:CFG.PT,sz:10,al:"center",va:"middle",bd:true});
      cel(a,dr,3,"Aporte inicial — capital próprio",{bg:dbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,dr,4,"Próprio",{bg:dbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,dr,5,"Capital Próprio",{bg:dbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,dr,6,500,{bg:dbg,fg:CFG.VE,b:true,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
      cel(a,dr,7,"—",{bg:dbg,fg:CFG.CZ,sz:10,al:"center",va:"middle",bd:true});
      cel(a,dr,8,"Valor inicial para cobrir custos de desenvolvimento",{bg:dbg,fg:CFG.CZ,sz:10,al:"left",va:"middle",bd:true});
    } else {
      for(var dc=2;dc<=8;dc++) cel(a,dr,dc,"",{bg:dbg,fg:CFG.PT,sz:10,al:dc===6?"right":"left",va:"middle",bd:true});
      if(di>0) a.getRange(dr,6).setNumberFormat(fmtMoeda());
    }
  }
  a.setRowHeight(46,28);
  mes(a,"B46:E46","TOTAL DE APORTES",{bg:CFG.VE,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  var ta=a.getRange(46,6);
  ta.setFormula("=SUM(F26:F45)");
  _o(ta,{bg:CFG.VE,fg:CFG.BR,b:true,sz:12,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  mes(a,"G46:H46","",{bg:CFG.VE,bd:true});
  sp(a,47,16);

  // ── L48-71: GASTOS COM CRÉDITOS ───────────────────────────
  // Colunas: B=Data C=Serviço D=Tipo E=Plano F=Valor G=Recorrência H=Obs
  a.setRowHeight(48,32);
  mes(a,"B48:H48","💳  GASTOS COM CRÉDITOS  —  APIs, Cloud, Assinaturas & Ferramentas",{bg:CFG.RE,fg:CFG.BR,b:true,sz:12,al:"left",va:"middle"});
  hTab(a,49,["DATA","SERVIÇO / PLATAFORMA","TIPO","PLANO / TIER","VALOR (R$)","RECORRÊNCIA","OBSERVAÇÕES"],CFG.RP,CFG.RE);

  var credEx=isLux?[
    ["01/01/2025","Google Play Console","Loja","Taxa única",125,"Única","Taxa de desenvolvedor — vitalícia"],
    ["01/01/2025","Firebase","Cloud/BaaS","Pay-as-you-go",0,"Mensal","Auth, Firestore, Storage"],
    ["01/01/2025","Vercel","Hosting","Hobby Free",0,"Mensal","Deploy do backend/API"],
    ["01/01/2025","OpenAI API","IA/OCR","Pay-per-use",0,"Variável","OCR de comprovantes"],
    ["01/01/2025","GitHub","Repositório","Free",0,"Mensal","Controle de versão"]
  ]:[];
  for(var ci2=0;ci2<20;ci2++){
    var cr=50+ci2,cbg=ci2%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(cr,24);
    if(isLux&&ci2<credEx.length){
      var ce=credEx[ci2];
      cel(a,cr,2,ce[0],{bg:cbg,fg:CFG.PT,sz:10,al:"center",va:"middle",bd:true});
      cel(a,cr,3,ce[1],{bg:cbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,cr,4,ce[2],{bg:cbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,cr,5,ce[3],{bg:cbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,cr,6,ce[4],{bg:cbg,fg:CFG.RE,b:true,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
      cel(a,cr,7,ce[5],{bg:cbg,fg:CFG.PT,sz:10,al:"center",va:"middle",bd:true});
      cel(a,cr,8,ce[6],{bg:cbg,fg:CFG.CZ,sz:10,al:"left",va:"middle",bd:true});
    } else {
      for(var cdc=2;cdc<=8;cdc++) cel(a,cr,cdc,"",{bg:cbg,fg:CFG.PT,sz:10,al:cdc===6?"right":"left",va:"middle",bd:true});
      a.getRange(cr,6).setNumberFormat(fmtMoeda());
    }
  }
  a.setRowHeight(70,28);
  mes(a,"B70:E70","TOTAL DE CRÉDITOS",{bg:CFG.RE,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  var tc=a.getRange(70,6);tc.setFormula("=SUM(F50:F69)");
  _o(tc,{bg:CFG.RE,fg:CFG.BR,b:true,sz:12,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  mes(a,"G70:H70","",{bg:CFG.RE,bd:true});
  sp(a,71,16);

  // ── L72-95: GASTOS DIVERSOS ───────────────────────────────
  // B=Data C=Descrição D=Categoria E=Fase F=Valor G=NF/Recibo H=Obs
  a.setRowHeight(72,32);
  mes(a,"B72:H72","🛒  GASTOS DIVERSOS  —  Ferramentas, Equipamentos & Outros",{bg:CFG.OE,fg:CFG.BR,b:true,sz:12,al:"left",va:"middle"});
  hTab(a,73,["DATA","DESCRIÇÃO","CATEGORIA","FASE","VALOR (R$)","NF / RECIBO","OBSERVAÇÕES"],CFG.OP,CFG.OE);
  var divEx=isLux?[
    ["01/01/2025","Domínio luxdriver.app","Domínio","Desenvolvimento",45,"—","Registro anual"],
    ["01/01/2025","Cabo USB para testes","Equipamento","Desenvolvimento",35,"—","Debug no dispositivo físico"]
  ]:[];
  for(var dvi=0;dvi<20;dvi++){
    var dvr=74+dvi,dvbg=dvi%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(dvr,24);
    if(isLux&&dvi<divEx.length){
      var dve=divEx[dvi];
      cel(a,dvr,2,dve[0],{bg:dvbg,fg:CFG.PT,sz:10,al:"center",va:"middle",bd:true});
      cel(a,dvr,3,dve[1],{bg:dvbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,dvr,4,dve[2],{bg:dvbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,dvr,5,dve[3],{bg:dvbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,dvr,6,dve[4],{bg:dvbg,fg:CFG.OE,b:true,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
      cel(a,dvr,7,dve[5],{bg:dvbg,fg:CFG.CZ,sz:10,al:"center",va:"middle",bd:true});
      cel(a,dvr,8,dve[6],{bg:dvbg,fg:CFG.CZ,sz:10,al:"left",va:"middle",bd:true});
    } else {
      for(var dvdc=2;dvdc<=8;dvdc++) cel(a,dvr,dvdc,"",{bg:dvbg,fg:CFG.PT,sz:10,al:dvdc===6?"right":"left",va:"middle",bd:true});
      a.getRange(dvr,6).setNumberFormat(fmtMoeda());
    }
  }
  a.setRowHeight(94,28);
  mes(a,"B94:E94","TOTAL DE GASTOS DIVERSOS",{bg:CFG.OE,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  var td=a.getRange(94,6);td.setFormula("=SUM(F74:F93)");
  _o(td,{bg:CFG.OE,fg:CFG.BR,b:true,sz:12,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  mes(a,"G94:H94","",{bg:CFG.OE,bd:true});
  sp(a,95,16);

  // ── L96-119: HORAS TRABALHADAS ────────────────────────────
  // B=Data C=Atividade D=Fase E=Horas F=Valor/Hora G=Custo Total H=Obs
  a.setRowHeight(96,32);
  mes(a,"B96:H96","⏱️  HORAS TRABALHADAS  —  Desenvolvimento, Implantação & Manutenção",{bg:CFG.LE,fg:CFG.BR,b:true,sz:12,al:"left",va:"middle"});
  hTab(a,97,["DATA","ATIVIDADE / TAREFA","FASE","HORAS","VALOR/HORA (R$)","CUSTO TOTAL","OBSERVAÇÕES"],CFG.LP,CFG.LE);
  var hEx=isLux?[
    ["01/01/2025","Setup do projeto — Capacitor + React Native","Desenvolvimento",8,CFG.valorHora],
    ["02/01/2025","Implementação do OCR de comprovantes","Desenvolvimento",12,CFG.valorHora],
    ["03/01/2025","Dashboard financeiro — componentes","Desenvolvimento",10,CFG.valorHora],
    ["04/01/2025","Integração com APIs de pagamento","Desenvolvimento",8,CFG.valorHora],
    ["05/01/2025","Testes e correção de bugs","Desenvolvimento",6,CFG.valorHora]
  ]:[];
  for(var hi=0;hi<20;hi++){
    var hr=98+hi,hbg=hi%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(hr,24);
    if(isLux&&hi<hEx.length){
      var he=hEx[hi];
      cel(a,hr,2,he[0],{bg:hbg,fg:CFG.PT,sz:10,al:"center",va:"middle",bd:true});
      cel(a,hr,3,he[1],{bg:hbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,hr,4,he[2],{bg:hbg,fg:CFG.PT,sz:10,al:"left",va:"middle",bd:true});
      cel(a,hr,5,he[3],{bg:hbg,fg:CFG.LE,b:true,sz:10,al:"right",va:"middle",bd:true});
      cel(a,hr,6,he[4],{bg:hbg,fg:CFG.PT,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
      var hc=a.getRange(hr,7);hc.setFormula("=E"+hr+"*F"+hr);
      _o(hc,{bg:hbg,fg:CFG.LE,b:true,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
      cel(a,hr,8,"",{bg:hbg,fg:CFG.CZ,sz:10,al:"left",va:"middle",bd:true});
    } else {
      for(var hdc=2;hdc<=8;hdc++) cel(a,hr,hdc,"",{bg:hbg,fg:CFG.PT,sz:10,al:hdc>=5?"right":"left",va:"middle",bd:true});
      a.getRange(hr,6).setNumberFormat(fmtMoeda());
      var hcf=a.getRange(hr,7);
      hcf.setFormula("=IF(E"+hr+"=\"\",\"\",E"+hr+"*F"+hr+")");
      _o(hcf,{bg:hbg,fm:fmtMoeda()});
    }
  }
  a.setRowHeight(118,28);
  mes(a,"B118:D118","TOTAL DE HORAS / CUSTO",{bg:CFG.LE,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  var thH=a.getRange(118,5);thH.setFormula("=SUM(E98:E117)");
  _o(thH,{bg:CFG.LE,fg:CFG.BR,b:true,sz:12,al:"right",va:"middle",bd:true});
  thH.setNumberFormat('0.0"h"');
  var thV=a.getRange(118,6);thV.setValue("Valor/h");
  _o(thV,{bg:CFG.LE,fg:CFG.BR,b:true,sz:9,al:"center",va:"middle",bd:true});
  var thC=a.getRange(118,7);thC.setFormula("=SUM(G98:G117)");
  _o(thC,{bg:CFG.LE,fg:CFG.BR,b:true,sz:12,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  mes(a,"H118","",{bg:CFG.LE,bd:true});
  sp(a,119,16);

  // ── L120-138: IMPREVISTOS ─────────────────────────────────
  // B=Data C=Descrição D=Impacto E=Custo F=Status G=Resolução H=Obs
  var imBg="#7b3f00",imBgL="#d4a017";
  a.setRowHeight(120,32);
  mes(a,"B120:H120","⚠️  IMPREVISTOS  —  Custos & Eventos Não Planejados",{bg:imBg,fg:CFG.BR,b:true,sz:12,al:"left",va:"middle"});
  hTab(a,121,["DATA","DESCRIÇÃO DO IMPREVISTO","IMPACTO","CUSTO (R$)","STATUS","RESOLUÇÃO","OBSERVAÇÕES"],imBgL,imBg);
  for(var imi=0;imi<15;imi++){
    var imr=122+imi,imbg=imi%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(imr,24);
    for(var imdc=2;imdc<=8;imdc++) cel(a,imr,imdc,"",{bg:imbg,fg:CFG.PT,sz:10,al:imdc===5?"right":"left",va:"middle",bd:true});
    a.getRange(imr,5).setNumberFormat(fmtMoeda());
  }
  a.setRowHeight(137,28);
  mes(a,"B137:D137","TOTAL DE IMPREVISTOS",{bg:imBg,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  var tim=a.getRange(137,5);tim.setFormula("=SUM(E122:E136)");
  _o(tim,{bg:imBg,fg:CFG.BR,b:true,sz:12,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  mes(a,"F137:H137","",{bg:imBg,bd:true});
  sp(a,138,16);

  // ── L139-149: PREVISÃO 6 MESES ────────────────────────────
  // B=Mês C=Aportes D=Créditos E=Diversos F=Horas(custo) G=Imprevistos H=Total Gastos
  a.setRowHeight(139,32);
  mes(a,"B139:H139","📅  PREVISÃO DE GASTOS — 6 MESES",{bg:CFG.AM,fg:CFG.BR,b:true,sz:13,al:"left",va:"middle"});
  a.setRowHeight(140,24);
  mes(a,"B140:H140","Preencha os valores previstos para cada mês. Os totais são calculados automaticamente.",{bg:CFG.AP,fg:CFG.AM,sz:10,al:"left",va:"middle"});
  hTab(a,141,["MÊS / PERÍODO","APORTES PREV.","CRÉDITOS PREV.","DIVERSOS PREV.","HORAS (CUSTO)","IMPREVISTOS","TOTAL GASTOS"],CFG.AM,CFG.BR);
  var m6n=isLux?["Jan/2025","Fev/2025","Mar/2025","Abr/2025","Mai/2025","Jun/2025"]:["Mês 1","Mês 2","Mês 3","Mês 4","Mês 5","Mês 6"];
  var m6v=isLux?[[0,50,80,160,0],[0,50,80,160,0],[500,50,80,160,50],[0,50,80,160,0],[0,50,80,160,0],[0,50,80,160,50]]:[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
  for(var m6i=0;m6i<6;m6i++){
    var m6r=142+m6i,m6bg=m6i%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(m6r,26);
    cel(a,m6r,2,m6n[m6i],{bg:m6bg,fg:CFG.PT,b:true,sz:10,al:"center",va:"middle",bd:true});
    for(var m6c=0;m6c<5;m6c++) cel(a,m6r,3+m6c,m6v[m6i][m6c],{bg:m6bg,fg:CFG.PT,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
    var m6t=a.getRange(m6r,8);
    m6t.setFormula("=D"+m6r+"+E"+m6r+"+F"+m6r+"+G"+m6r);
    _o(m6t,{bg:m6bg,fg:CFG.AM,b:true,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  }
  a.setRowHeight(148,28);
  mes(a,"B148:C148","TOTAL PREVISTO (6 MESES)",{bg:CFG.AM,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  for(var t6c=3;t6c<=8;t6c++){
    var t6=a.getRange(148,t6c),t6col=String.fromCharCode(64+t6c);
    t6.setFormula("=SUM("+t6col+"142:"+t6col+"147)");
    _o(t6,{bg:CFG.AM,fg:CFG.BR,b:true,sz:11,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  }
  sp(a,149,16);

  // ── L150-166: PREVISÃO 1 ANO ──────────────────────────────
  a.setRowHeight(150,32);
  mes(a,"B150:H150","📆  PREVISÃO DE GASTOS — 1 ANO (12 MESES)",{bg:CFG.AE,fg:CFG.BR,b:true,sz:13,al:"left",va:"middle"});
  a.setRowHeight(151,24);
  mes(a,"B151:H151","Planejamento anual completo. Ajuste os valores conforme o crescimento do projeto.",{bg:CFG.AP,fg:CFG.AM,sz:10,al:"left",va:"middle"});
  hTab(a,152,["MÊS / PERÍODO","APORTES PREV.","CRÉDITOS PREV.","DIVERSOS PREV.","HORAS (CUSTO)","IMPREVISTOS","TOTAL GASTOS"],CFG.AE,CFG.BR);
  var m12n=isLux?["Jan/2025","Fev/2025","Mar/2025","Abr/2025","Mai/2025","Jun/2025","Jul/2025","Ago/2025","Set/2025","Out/2025","Nov/2025","Dez/2025"]:["Mês 1","Mês 2","Mês 3","Mês 4","Mês 5","Mês 6","Mês 7","Mês 8","Mês 9","Mês 10","Mês 11","Mês 12"];
  var m12v=isLux?[
    [0,50,80,160,0],[0,50,80,160,0],[500,50,80,160,50],[0,50,80,160,0],[0,50,80,160,0],[0,50,80,160,50],
    [0,80,100,120,0],[0,80,100,120,0],[0,80,100,120,50],[0,80,100,80,0],[0,80,100,80,0],[0,80,100,80,100]
  ]:Array(12).fill([0,0,0,0,0]);
  for(var m12i=0;m12i<12;m12i++){
    var m12r=153+m12i,m12bg=m12i%2===0?CFG.BR:CFG.CC;
    a.setRowHeight(m12r,26);
    cel(a,m12r,2,m12n[m12i],{bg:m12bg,fg:CFG.PT,b:true,sz:10,al:"center",va:"middle",bd:true});
    for(var m12c=0;m12c<5;m12c++) cel(a,m12r,3+m12c,m12v[m12i][m12c],{bg:m12bg,fg:CFG.PT,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
    var m12t=a.getRange(m12r,8);
    m12t.setFormula("=D"+m12r+"+E"+m12r+"+F"+m12r+"+G"+m12r);
    _o(m12t,{bg:m12bg,fg:CFG.AE,b:true,sz:10,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  }
  a.setRowHeight(165,28);
  mes(a,"B165:C165","TOTAL PREVISTO (1 ANO)",{bg:CFG.AE,fg:CFG.BR,b:true,sz:10,al:"right",va:"middle",bd:true});
  for(var t12c=3;t12c<=8;t12c++){
    var t12=a.getRange(165,t12c),t12col=String.fromCharCode(64+t12c);
    t12.setFormula("=SUM("+t12col+"153:"+t12col+"164)");
    _o(t12,{bg:CFG.AE,fg:CFG.BR,b:true,sz:11,al:"right",va:"middle",fm:fmtMoeda(),bd:true});
  }
  sp(a,166,20);

  // ── L167: Rodapé ──────────────────────────────────────────
  a.setRowHeight(167,26);
  mes(a,"B167:H167","© "+new Date().getFullYear()+"  Saulo Zabot  •  "+proj.nome+"  •  Controle de Projetos v1.0",{bg:CFG.AE,fg:CFG.CZ,sz:9,al:"center",va:"middle"});

  return a;
}
