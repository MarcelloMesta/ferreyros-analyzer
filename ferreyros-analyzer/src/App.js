import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

const CLIENT_ID = "759880250891-13imean729fdjapr2tmbst0acjuivk8l.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";
const FOLDER_ID = "1UPrIWI239diTZpWdhdvVAChU2EyFL4TD";
const C = {yellow:"#F5A800",yellowDark:"#D4900A",yellowDim:"#F5A80015",dark:"#1A1A1A",darkMid:"#2D2D2D",darkSoft:"#3D3D3D",bg:"#F6F3EE",surface:"#FFFFFF",surfaceAlt:"#F1EDE6",border:"#E0D9CF",text:"#1A1A1A",textMuted:"#7A7060",textDim:"#4A4338",danger:"#C0392B",dangerDim:"#C0392B12",success:"#1A6B3C",successDim:"#1A6B3C12"};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#F6F3EE;color:#1A1A1A;font-family:'Barlow',sans-serif;min-height:100vh;}
.header{background:#1A1A1A;display:flex;align-items:stretch;justify-content:space-between;position:sticky;top:0;z-index:200;box-shadow:0 2px 16px #00000030;}
.header-brand{display:flex;align-items:stretch;}
.hlb{background:#F5A800;padding:0 22px;display:flex;align-items:center;position:relative;}
.hlb::after{content:'';position:absolute;right:-14px;top:0;bottom:0;width:28px;background:#F5A800;clip-path:polygon(0 0,0 100%,100% 100%);z-index:1;}
.hlt{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;color:#1A1A1A;position:relative;z-index:2;}
.htb{display:flex;flex-direction:column;justify-content:center;padding:12px 12px 12px 28px;}
.ht{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.06em;line-height:1;}
.hs{font-size:9px;color:#F5A800;font-family:'DM Mono',monospace;letter-spacing:0.12em;text-transform:uppercase;margin-top:3px;}
.hr{display:flex;align-items:center;padding:0 24px;gap:16px;}
.hp{font-size:11px;color:#aaa;font-family:'DM Mono',monospace;}
.hp span{color:#F5A800;font-weight:500;}
.uc{display:flex;align-items:center;gap:8px;background:#2D2D2D;border:1px solid #3D3D3D;border-radius:8px;padding:5px 12px;font-size:12px;color:#ccc;}
.ua{width:24px;height:24px;border-radius:50%;background:#F5A800;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#1A1A1A;overflow:hidden;}
.bso{background:none;border:none;cursor:pointer;color:#666;font-size:10px;font-family:'DM Mono',monospace;padding:0;margin-left:4px;}
.bso:hover{color:#C0392B;}
.nav{background:#1A1A1A;border-top:1px solid #333;display:flex;padding:0 32px;}
.nb{background:none;border:none;border-bottom:2px solid transparent;padding:12px 20px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#888;cursor:pointer;transition:all 0.2s;}
.nb:hover{color:#ccc;}
.nb.on{color:#F5A800;border-bottom-color:#F5A800;}
.main{max-width:1280px;margin:0 auto;padding:28px 32px;}
.ls{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;}
.lc{background:#fff;border:1px solid #E0D9CF;border-radius:20px;padding:52px 60px;max-width:420px;width:100%;box-shadow:0 8px 40px #00000010;text-align:center;}
.llt{font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:700;color:#1A1A1A;display:inline-block;background:#F5A800;padding:6px 18px;border-radius:8px;margin-bottom:24px;}
.ld{width:40px;height:3px;background:#F5A800;margin:0 auto 20px;border-radius:2px;}
.lt{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;}
.lsub{font-size:13px;color:#7A7060;line-height:1.7;margin-bottom:28px;}
.bg{display:flex;align-items:center;gap:12px;background:#1A1A1A;color:white;border:none;border-radius:10px;padding:14px 24px;font-size:14px;font-weight:600;font-family:'Barlow',sans-serif;cursor:pointer;transition:all 0.2s;width:100%;justify-content:center;}
.bg:hover:not(:disabled){background:#2D2D2D;transform:translateY(-1px);}
.bg:disabled{opacity:0.5;cursor:not-allowed;}
.gl{width:18px;height:18px;flex-shrink:0;}
.lf{margin-top:16px;font-size:11px;color:#7A7060;font-family:'DM Mono',monospace;}
.loading-s{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px;}
.bspin{width:40px;height:40px;border:3px solid #E0D9CF;border-top-color:#F5A800;border-radius:50%;animation:spin 0.8s linear infinite;}
.ltxt{font-size:14px;color:#7A7060;font-family:'DM Mono',monospace;}
@keyframes spin{to{transform:rotate(360deg);}}
.kgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:14px;margin-bottom:24px;}
.kc{background:#fff;border:1px solid #E0D9CF;border-radius:12px;padding:16px;border-top:3px solid #F5A800;box-shadow:0 2px 8px #00000006;transition:box-shadow 0.2s;}
.kc:hover{box-shadow:0 4px 16px #00000012;}
.kl{font-size:10px;color:#7A7060;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;}
.kv{font-size:22px;font-weight:700;font-family:'Barlow Condensed',sans-serif;color:#1A1A1A;}
.kd{font-size:11px;margin-top:5px;font-family:'DM Mono',monospace;}
.up{color:#1A6B3C;} .dn{color:#C0392B;} .nn{color:#7A7060;}
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;}
.cc{background:#fff;border:1px solid #E0D9CF;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px #00000006;}
.ch{padding:14px 20px;border-bottom:1px solid #E0D9CF;background:#F1EDE6;}
.cht{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4A4338;font-family:'Barlow Condensed',sans-serif;}
.cb{padding:16px;}
.chlayout{display:grid;grid-template-columns:260px 1fr;gap:20px;height:calc(100vh - 180px);}
.chsb{display:flex;flex-direction:column;gap:12px;}
.card{background:#fff;border:1px solid #E0D9CF;border-radius:14px;overflow:hidden;}
.chdr{padding:14px 20px;border-bottom:1px solid #E0D9CF;background:#1A1A1A;}
.chdrl{padding:14px 20px;border-bottom:1px solid #E0D9CF;background:#F1EDE6;}
.ct{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;font-family:'Barlow Condensed',sans-serif;}
.ctw{color:#fff;} .ctd{color:#4A4338;}
.cbody{padding:16px;}
.chm{display:flex;flex-direction:column;background:#fff;border:1px solid #E0D9CF;border-radius:14px;overflow:hidden;}
.msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;}
.bub{max-width:85%;padding:12px 16px;border-radius:12px;font-size:13px;line-height:1.7;}
.bub.user{background:#1A1A1A;color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
.bub.assistant{background:#F1EDE6;border:1px solid #E0D9CF;align-self:flex-start;border-bottom-left-radius:4px;color:#4A4338;white-space:pre-wrap;}
.cirow{padding:14px;border-top:1px solid #E0D9CF;display:flex;gap:10px;background:#F1EDE6;}
.ci{flex:1;background:#fff;border:1px solid #E0D9CF;border-radius:10px;padding:10px 14px;font-family:'Barlow',sans-serif;font-size:13px;color:#1A1A1A;outline:none;resize:none;transition:border-color 0.2s;}
.ci:focus{border-color:#F5A800;}
.ci::placeholder{color:#7A7060;}
.bsnd{background:#F5A800;border:none;border-radius:10px;padding:10px 16px;cursor:pointer;font-size:16px;transition:all 0.2s;flex-shrink:0;}
.bsnd:hover:not(:disabled){background:#D4900A;}
.bsnd:disabled{opacity:0.4;cursor:not-allowed;}
.sq{background:#F1EDE6;border:1px solid #E0D9CF;border-radius:8px;padding:8px 12px;font-size:11px;color:#4A4338;cursor:pointer;transition:all 0.15s;text-align:left;font-family:'Barlow',sans-serif;width:100%;margin-bottom:6px;}
.sq:hover{border-color:#F5A800;}
.playout{display:grid;grid-template-columns:280px 1fr;gap:20px;}
.pcfg{display:flex;flex-direction:column;gap:14px;}
.pprev{background:#fff;border:1px solid #E0D9CF;border-radius:14px;padding:24px;min-height:400px;}
.bprim{width:100%;padding:14px;background:#1A1A1A;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;font-family:'Barlow Condensed',sans-serif;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;border-left:4px solid #F5A800;}
.bprim:hover:not(:disabled){background:#2D2D2D;transform:translateY(-1px);}
.bprim:disabled{opacity:0.35;cursor:not-allowed;transform:none;}
.chi{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F1EDE6;border:1px solid #E0D9CF;border-radius:8px;cursor:pointer;transition:border-color 0.15s;margin-bottom:8px;}
.chi:hover{border-color:#F5A800;}
.chi.on{border-color:#F5A800;background:#F5A80015;}
.chbox{width:16px;height:16px;border-radius:4px;border:1.5px solid #E0D9CF;background:white;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;}
.chbox.on{background:#F5A800;border-color:#F5A800;color:#1A1A1A;font-weight:700;}
.scard{border:1px solid #E0D9CF;border-radius:10px;overflow:hidden;margin-bottom:14px;}
.shdr{background:#1A1A1A;padding:10px 16px;display:flex;align-items:center;gap:10px;}
.snum{font-size:10px;font-family:'DM Mono',monospace;color:#F5A800;}
.sname{font-size:12px;font-family:'Barlow Condensed',sans-serif;color:#fff;text-transform:uppercase;letter-spacing:0.06em;}
.sbody{padding:14px 16px;}
.smspin{width:14px;height:14px;border:2px solid #ffffff44;border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px;}
.ebox{padding:12px 16px;background:#C0392B12;border:1px solid #C0392B33;border-left:3px solid #C0392B;border-radius:8px;font-size:13px;color:#C0392B;margin-bottom:16px;}
.nodata{text-align:center;padding:60px 20px;color:#7A7060;font-size:14px;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#E0D9CF;border-radius:4px;}
.tt{background:#1A1A1A;border:1px solid #3D3D3D;border-radius:8px;padding:10px 14px;font-size:12px;color:#fff;font-family:'DM Mono',monospace;}
.ttl{color:#F5A800;margin-bottom:4px;font-size:10px;}
`;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function fmt(n) {
  if (!n && n !== 0) return "—";
  const a = Math.abs(n);
  if (a >= 1e6) return (n/1e6).toFixed(1)+"B";
  if (a >= 1e3) return (n/1e3).toFixed(1)+"M";
  return n.toFixed(0)+"K";
}

function pctDelta(curr, prev) {
  if (!prev || prev === 0) return null;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tt">
      <div className="ttl">{label}</div>
      {payload.map((p,i) => <div key={i} style={{color:p.color}}>{p.name}: {p.value?.toLocaleString()}</div>)}
    </div>
  );
};

const SUGGESTED = [
  "¿Cómo evolucionó el margen bruto en los últimos 6 meses?",
  "¿Cuál fue la variación de ventas vs mismo período del año anterior?",
  "¿Cuál es la tendencia del EBITDA?",
  "¿Cómo está la liquidez corriente?",
  "Explica las variaciones más importantes del período",
  "¿Cuál es la posición de deuda financiera?",
  "¿Cómo está la cobertura de intereses?",
];

const PPT_SECTIONS = [
  ["esf","Estado de Situación Financiera"],
  ["er","Estado de Resultados"],
  ["variaciones","Variaciones significativas"],
  ["indicadores","Indicadores financieros"],
  ["cambio","Diferencia en cambio"],
];

export default function App() {
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady]   = useState(false);
  const [token, setToken]         = useState(null);
  const [user, setUser]           = useState(null);
  const [tab, setTab]             = useState("dashboard");
  const [loadingData, setLoadingData] = useState(false);
  const [parsedData, setParsedData]   = useState(null);
  const [excelCtx, setExcelCtx]       = useState("");
  const [latestP, setLatestP]         = useState(null);
  const [prevP, setPrevP]             = useState(null);
  const [error, setError]             = useState("");
  const tokenClientRef = useRef(null);
  const [msgs, setMsgs]   = useState([{role:"assistant",content:"Hola, soy tu agente financiero de Ferreyros. Tengo acceso a los estados financieros. ¿En qué te puedo ayudar?"}]);
  const [chatIn, setChatIn]     = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef(null);
  const [pptSec, setPptSec]   = useState({esf:true,er:true,variaciones:true,indicadores:true,cambio:false});
  const [pptLoading, setPptLoading] = useState(false);
  const [pptResult, setPptResult]   = useState(null);

  useEffect(() => {
    Promise.all([loadScript("https://apis.google.com/js/api.js"), loadScript("https://accounts.google.com/gsi/client")])
      .then(() => {
        window.gapi.load("client", () => { window.gapi.client.init({}).then(() => setGapiReady(true)); });
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID, scope: SCOPES,
          callback: async (resp) => {
            if (resp.error) { setError("Error de autenticación"); return; }
            setToken(resp.access_token);
            await fetchUser(resp.access_token);
            await loadExcel(resp.access_token);
          },
        });
        setGisReady(true);
      });
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const fetchUser = async (t) => {
    try {
      const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {headers:{Authorization:`Bearer ${t}`}});
      const d = await r.json();
      setUser({name:d.name, email:d.email, picture:d.picture});
    } catch {}
  };

  const loadExcel = async (t) => {
    setLoadingData(true); setError("");
    try {
      const r = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+name+contains+'Ferreyros_SA_al'+and+mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'&orderBy=name+desc&pageSize=3&fields=files(id,name)`,
        {headers:{Authorization:`Bearer ${t}`}}
      );
      const d = await r.json();
      if (!d.files?.length) { setError("No se encontró Excel con nombre Ferreyros_SA_al_*.xlsx en la carpeta de Drive"); setLoadingData(false); return; }
      const file = d.files[0];
      const fr = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {headers:{Authorization:`Bearer ${t}`}});
      const blob = await fr.blob();
      
      // Parse Excel with SheetJS
      const arrayBuffer = await blob.arrayBuffer();
      const XLSX = window.XLSX;
      const workbook = XLSX.read(arrayBuffer, {type:"array"});
      let excelText = "";
      workbook.SheetNames.forEach(name => {
        const sheet = workbook.Sheets[name];
        excelText += `\n=== Hoja: ${name} ===\n`;
        excelText += XLSX.utils.sheet_to_csv(sheet);
      });
      // Limit to 30000 chars
      excelText = excelText.substring(0, 30000);

      const apiR = await fetch("https://ferreyros-api-proxy.marcello0209.workers.dev", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-haiku-4-5-20251001", max_tokens:8000,
          messages:[{role:"user", content:`Extrae los datos financieros de este Excel de Ferreyros S.A. Devuelve SOLO un objeto JSON valido sin texto ni backticks con esta estructura exacta:
{"periods":["Mar 2026","Feb 2026",...],"data":{"Mar 2026":{"ventas":num,"costoVentas":num,"utilidadBruta":num,"gastosVenta":num,"gastosAdmin":num,"utilidadOperativa":num,"ebitda":num,"utilidadNeta":num,"gastosFinancieros":num,"activoCorriente":num,"totalActivo":num,"pasivoCorriente":num,"totalPasivo":num,"patrimonio":num,"inventarios":num,"cxcComercial":num,"efectivo":num,"obligacionesFinancieras":num}}}
Valores en miles de soles (S/000). Periodos ordenados cronologicamente ascendente (mas antiguo primero). Nombres legibles: "Mar 2026","Feb 2026","Ene 2026","Dic 2025" etc. Incluye TODOS los periodos disponibles.

DATOS DEL EXCEL:
${excelText}`}]
        })
      });
      const apiD = await apiR.json();
      const txt = apiD.content?.map(b=>b.text||"").join("")||"";
      const clean = txt.replace(/```json|```/g,"").trim();
      const s = clean.indexOf("{"); const e2 = clean.lastIndexOf("}");
      const parsed = JSON.parse(clean.slice(s, e2+1));
      setParsedData(parsed);
      setExcelCtx(JSON.stringify(parsed).substring(0,8000));
      const ps = parsed.periods||[];
      if (ps.length) { setLatestP(ps[ps.length-1]); setPrevP(ps[ps.length-2]||null); }
    } catch(e) { setError("Error cargando datos: "+e.message); }
    finally { setLoadingData(false); }
  };

  const signIn  = () => { if (gapiReady && gisReady) tokenClientRef.current.requestAccessToken({prompt:"consent"}); };
  const signOut = () => { if (token) window.google.accounts.oauth2.revoke(token); setToken(null); setUser(null); setParsedData(null); setLatestP(null); };

  const sendChat = async (q) => {
    const question = q || chatIn.trim();
    if (!question || chatLoading) return;
    setChatIn("");
    setMsgs(prev => [...prev, {role:"user",content:question}]);
    setChatLoading(true);
    try {
      const r = await fetch("https://ferreyros-api-proxy.marcello0209.workers.dev", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-haiku-4-5-20251001", max_tokens:1000,
          system:`Eres analista financiero senior de Ferreyros S.A. (distribuidora Caterpillar, Peru). Responde en espanol, conciso y profesional. Valores en miles de soles (S/000). Periodo mas reciente: ${latestP}.
DATOS: ${excelCtx}`,
          messages:[...msgs.slice(1).map(m=>({role:m.role,content:m.content})),{role:"user",content:question}]
        })
      });
      const d = await r.json();
      const rep = d.content?.map(b=>b.text||"").join("")||"No pude procesar.";
      setMsgs(prev => [...prev, {role:"assistant",content:rep}]);
    } catch(e) { setMsgs(prev => [...prev, {role:"assistant",content:"Error: "+e.message}]); }
    setChatLoading(false);
  };

  const generatePPT = async () => {
    if (!parsedData || !latestP) return;
    setPptLoading(true); setPptResult(null);
    try {
      const sections = PPT_SECTIONS.filter(([k])=>pptSec[k]).map(([,v])=>v).join(", ");
      const r = await fetch("https://ferreyros-api-proxy.marcello0209.workers.dev", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4000,
          messages:[{role:"user", content:`Eres analista financiero de Ferreyros S.A. Genera contenido de presentacion Comite Finanzas para ${latestP}.
DATOS: ${excelCtx}
PERIODO ACTUAL: ${latestP}
PERIODO ANTERIOR: ${prevP||"N/A"}
SECCIONES: ${sections}
Devuelve SOLO JSON valido:
{"title":"Comite Finanzas - ${latestP}","slides":[{"numero":1,"titulo":"Estado de Situacion Financiera - Activo","subtitulo":"A ${latestP} (en miles de soles)","tabla":[{"rubro":"nombre","saldo":"S/ XXM","variacion":"+-S/ XXM","tipo":"positiva|negativa|neutral"}],"comentarios":["comentario narrativo detallado con numeros"]}]}
Se especifico con numeros. Comentarios deben explicar causas como en comite ejecutivo real.`}]
        })
      });
      const d = await r.json();
      const txt = d.content?.map(b=>b.text||"").join("")||"";
      const clean = txt.replace(/```json|```/g,"").trim();
      const s = clean.indexOf("{"); const e2 = clean.lastIndexOf("}");
      setPptResult(JSON.parse(clean.slice(s,e2+1)));
    } catch(e) { setError("Error generando PPT: "+e.message); }
    setPptLoading(false);
  };

  const pd = parsedData?.data;
  const lp = latestP;
  const pp = prevP;

  const kpis = (lp && pd) ? [
    {label:"Ventas Netas",       val:`S/ ${fmt(pd[lp]?.ventas)}`,           d:pctDelta(pd[lp]?.ventas,pd[pp]?.ventas)},
    {label:"Utilidad Bruta",     val:`S/ ${fmt(pd[lp]?.utilidadBruta)}`,    d:pctDelta(pd[lp]?.utilidadBruta,pd[pp]?.utilidadBruta)},
    {label:"Margen Bruto",       val:pd[lp]?.ventas?((pd[lp].utilidadBruta/pd[lp].ventas)*100).toFixed(1)+"%":"—", d:null},
    {label:"EBITDA",             val:`S/ ${fmt(pd[lp]?.ebitda)}`,            d:pctDelta(pd[lp]?.ebitda,pd[pp]?.ebitda)},
    {label:"Utilidad Operativa", val:`S/ ${fmt(pd[lp]?.utilidadOperativa)}`, d:pctDelta(pd[lp]?.utilidadOperativa,pd[pp]?.utilidadOperativa)},
    {label:"Utilidad Neta",      val:`S/ ${fmt(pd[lp]?.utilidadNeta)}`,      d:pctDelta(pd[lp]?.utilidadNeta,pd[pp]?.utilidadNeta)},
    {label:"Total Activo",       val:`S/ ${fmt(pd[lp]?.totalActivo)}`,       d:pctDelta(pd[lp]?.totalActivo,pd[pp]?.totalActivo)},
    {label:"Patrimonio",         val:`S/ ${fmt(pd[lp]?.patrimonio)}`,        d:pctDelta(pd[lp]?.patrimonio,pd[pp]?.patrimonio)},
    {label:"Liquidez Corriente", val:pd[lp]?.pasivoCorriente?(pd[lp].activoCorriente/pd[lp].pasivoCorriente).toFixed(2)+"x":"—", d:null},
    {label:"Deuda/Patrimonio",   val:pd[lp]?.patrimonio?(pd[lp].totalPasivo/pd[lp].patrimonio).toFixed(2)+"x":"—", d:null},
    {label:"Inventarios",        val:`S/ ${fmt(pd[lp]?.inventarios)}`,       d:pctDelta(pd[lp]?.inventarios,pd[pp]?.inventarios)},
    {label:"CxC Comercial",      val:`S/ ${fmt(pd[lp]?.cxcComercial)}`,      d:pctDelta(pd[lp]?.cxcComercial,pd[pp]?.cxcComercial)},
  ] : [];

  const ps12 = parsedData?.periods?.slice(-12)||[];
  const vD = ps12.map(p=>({p:p.substring(0,7),v:Math.round((pd?.[p]?.ventas||0)/1000)}));
  const eD = ps12.map(p=>({p:p.substring(0,7),e:Math.round((pd?.[p]?.ebitda||0)/1000),u:Math.round((pd?.[p]?.utilidadNeta||0)/1000)}));
  const mD = ps12.map(p=>({p:p.substring(0,7),mb:pd?.[p]?.ventas?+((pd[p].utilidadBruta/pd[p].ventas)*100).toFixed(1):0,mo:pd?.[p]?.ventas?+((pd[p].utilidadOperativa/pd[p].ventas)*100).toFixed(1):0}));
  const bD = ps12.map(p=>({p:p.substring(0,7),ac:Math.round((pd?.[p]?.activoCorriente||0)/1000),pc:Math.round((pd?.[p]?.pasivoCorriente||0)/1000)}));

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-brand">
            <div className="hlb"><span className="hlt">+Ferreyros</span></div>
            <div className="htb"><div className="ht">Agente Financiero</div><div className="hs">Comite de Finanzas</div></div>
          </div>
          {user && (
            <div className="hr">
              {lp && <div className="hp">Periodo: <span>{lp}</span></div>}
              <div className="uc">
                <div className="ua">{user.picture?<img src={user.picture} style={{width:24,height:24}} alt=""/>:user.name?.[0]}</div>
                <span>{user.email}</span>
                <button className="bso" onClick={signOut}>salir</button>
              </div>
            </div>
          )}
        </div>

        {token && (
          <div className="nav">
            {[["dashboard","Dashb."],["chat","Consultas"],["ppt","Generar PPT"]].map(([id,lbl])=>(
              <button key={id} className={`nb ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>
        )}

        <div className="main">
          {!token ? (
            <div className="ls">
              <div className="lc">
                <div className="llt">+Ferreyros</div>
                <div className="ld"/>
                <div className="lt">Agente Financiero</div>
                <div className="lsub">Accede con tu cuenta corporativa para analizar los estados financieros del Comite de Finanzas.</div>
                <button className="bg" onClick={signIn} disabled={!gapiReady||!gisReady}>
                  <svg className="gl" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Ingresar con Google
                </button>
                <div className="lf">Acceso restringido - solo usuarios autorizados</div>
              </div>
            </div>
          ) : loadingData ? (
            <div className="loading-s"><div className="bspin"/><div className="ltxt">Cargando estados financieros desde Drive...</div></div>
          ) : (
            <>
              {error && <div className="ebox">Error: {error}</div>}

              {tab === "dashboard" && (
                !parsedData ? <div className="nodata"><div style={{fontSize:40,marginBottom:12}}>No se encontraron datos</div></div> : (
                  <>
                    <div className="kgrid">
                      {kpis.map((k,i)=>{
                        const up = k.d!==null && k.d>0;
                        const dn = k.d!==null && k.d<0;
                        const cls = k.d===null?"nn":up?"up":"dn";
                        return (
                          <div key={i} className="kc">
                            <div className="kl">{k.label}</div>
                            <div className="kv">{k.val}</div>
                            {k.d!==null && <div className={`kd ${cls}`}>{up?"▲":"▼"} {Math.abs(k.d).toFixed(1)}% vs {pp}</div>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="cgrid">
                      <div className="cc"><div className="ch"><div className="cht">Ventas Netas - 12 meses (S/M)</div></div><div className="cb"><ResponsiveContainer width="100%" height={190}><AreaChart data={vD}><CartesianGrid strokeDasharray="3 3" stroke="#E0D9CF"/><XAxis dataKey="p" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip content={<TT/>}/><Area type="monotone" dataKey="v" name="Ventas" stroke="#F5A800" fill="#F5A80015" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></div>
                      <div className="cc"><div className="ch"><div className="cht">Margenes - 12 meses (%)</div></div><div className="cb"><ResponsiveContainer width="100%" height={190}><LineChart data={mD}><CartesianGrid strokeDasharray="3 3" stroke="#E0D9CF"/><XAxis dataKey="p" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} unit="%"/><Tooltip/><Legend/><Line type="monotone" dataKey="mb" name="M. Bruto" stroke="#F5A800" strokeWidth={2} dot={false}/><Line type="monotone" dataKey="mo" name="M. Operativo" stroke="#1A1A1A" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div></div>
                      <div className="cc"><div className="ch"><div className="cht">EBITDA vs Utilidad Neta (S/M)</div></div><div className="cb"><ResponsiveContainer width="100%" height={190}><BarChart data={eD}><CartesianGrid strokeDasharray="3 3" stroke="#E0D9CF"/><XAxis dataKey="p" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip content={<TT/>}/><Legend/><Bar dataKey="e" name="EBITDA" fill="#F5A800" radius={[3,3,0,0]}/><Bar dataKey="u" name="Ut. Neta" fill="#1A1A1A" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div></div>
                      <div className="cc"><div className="ch"><div className="cht">Activo vs Pasivo Corriente (S/M)</div></div><div className="cb"><ResponsiveContainer width="100%" height={190}><AreaChart data={bD}><CartesianGrid strokeDasharray="3 3" stroke="#E0D9CF"/><XAxis dataKey="p" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}}/><Tooltip content={<TT/>}/><Legend/><Area type="monotone" dataKey="ac" name="Activo Cte." stroke="#1A6B3C" fill="#1A6B3C12" strokeWidth={2}/><Area type="monotone" dataKey="pc" name="Pasivo Cte." stroke="#C0392B" fill="#C0392B12" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></div>
                    </div>
                  </>
                )
              )}

              {tab === "chat" && (
                <div className="chlayout">
                  <div className="chsb">
                    <div className="card">
                      <div className="chdr"><span className="ct ctw">Preguntas sugeridas</span></div>
                      <div style={{padding:12}}>{SUGGESTED.map((q,i)=><button key={i} className="sq" onClick={()=>sendChat(q)}>{q}</button>)}</div>
                    </div>
                    {lp && <div className="card"><div className="chdrl"><span className="ct ctd">Contexto</span></div><div className="cbody" style={{fontSize:12,color:"#7A7060",lineHeight:1.8}}><div>Periodo: <strong style={{color:"#1A1A1A"}}>{lp}</strong></div>{pp&&<div>Anterior: <strong style={{color:"#1A1A1A"}}>{pp}</strong></div>}<div style={{marginTop:8,fontSize:10,fontFamily:"'DM Mono'"}}>modelo: claude-haiku</div></div></div>}
                  </div>
                  <div className="chm">
                    <div className="msgs">
                      {msgs.map((m,i)=><div key={i} className={`bub ${m.role}`}>{m.content}</div>)}
                      {chatLoading && <div className="bub assistant">Analizando...</div>}
                      <div ref={endRef}/>
                    </div>
                    <div className="cirow">
                      <textarea className="ci" placeholder="Pregunta sobre los estados financieros..." value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} rows={2}/>
                      <button className="bsnd" onClick={()=>sendChat()} disabled={!chatIn.trim()||chatLoading}>Send</button>
                    </div>
                  </div>
                </div>
              )}

              {tab === "ppt" && (
                <div className="playout">
                  <div className="pcfg">
                    <div className="card">
                      <div className="chdr"><span className="ct ctw">Secciones</span></div>
                      <div className="cbody">
                        {PPT_SECTIONS.map(([key,lbl])=>(
                          <div key={key} className={`chi ${pptSec[key]?"on":""}`} onClick={()=>setPptSec(p=>({...p,[key]:!p[key]}))}>
                            <div className={`chbox ${pptSec[key]?"on":""}`}>{pptSec[key]&&"v"}</div>
                            <span style={{fontSize:13,color:"#4A4338"}}>{lbl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="bprim" disabled={pptLoading||!parsedData} onClick={generatePPT}>
                      {pptLoading?<><span className="smspin"/>Generando...</>:"Generar Presentacion"}
                    </button>
                    {pptLoading && <div style={{fontSize:11,color:"#7A7060",fontFamily:"'DM Mono'",textAlign:"center"}}>claude-sonnet - aprox 30 segundos</div>}
                  </div>
                  <div className="pprev">
                    {!pptResult&&!pptLoading&&<div className="nodata"><div style={{fontSize:40,marginBottom:12}}>Selecciona secciones y genera la presentacion para {lp}</div></div>}
                    {pptResult && (
                      <>
                        <div style={{marginBottom:20,fontFamily:"'Barlow Condensed'",fontSize:20,fontWeight:700}}>{pptResult.title}</div>
                        {pptResult.slides?.map((slide,i)=>(
                          <div key={i} className="scard">
                            <div className="shdr"><span className="snum">LAMINA {slide.numero}</span><span className="sname">{slide.titulo}</span></div>
                            <div className="sbody">
                              {slide.subtitulo && <div style={{fontSize:11,color:"#7A7060",marginBottom:10}}>{slide.subtitulo}</div>}
                              {slide.tabla?.length>0 && (
                                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:12}}>
                                  <thead><tr style={{background:"#F1EDE6"}}><th style={{padding:"6px 10px",textAlign:"left",borderBottom:"2px solid #F5A800",fontSize:10,color:"#7A7060",fontWeight:500}}>Rubro</th><th style={{padding:"6px 10px",textAlign:"right",borderBottom:"2px solid #F5A800",fontSize:10,color:"#7A7060",fontWeight:500}}>Saldo / Variacion</th></tr></thead>
                                  <tbody>{slide.tabla.map((row,j)=><tr key={j} style={{borderBottom:"1px solid #E0D9CF"}}><td style={{padding:"7px 10px",fontWeight:500}}>{row.rubro}</td><td style={{padding:"7px 10px",textAlign:"right",fontFamily:"'DM Mono'",fontSize:11,color:row.tipo==="positiva"?"#1A6B3C":row.tipo==="negativa"?"#C0392B":"#4A4338"}}>{row.variacion||row.saldo}</td></tr>)}</tbody>
                                </table>
                              )}
                              {slide.comentarios?.length>0 && (
                                <div style={{background:"#F1EDE6",border:"1px solid #E0D9CF",borderLeft:"3px solid #F5A800",borderRadius:6,padding:"10px 12px"}}>
                                  <div style={{fontSize:10,color:"#7A7060",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Comentarios</div>
                                  {slide.comentarios.map((c,j)=><div key={j} style={{fontSize:12,color:"#4A4338",lineHeight:1.6,marginBottom:j<slide.comentarios.length-1?6:0}}>• {c}</div>)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
