import { useState, useEffect, useRef, useCallback } from "react";

const CLIENT_ID = "759880250891-13imean729fdjapr2tmbst0acjuivk8l.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

const C = {
  yellow: "#F5A800",
  yellowDark: "#D4900A",
  yellowLight: "#FFF3CC",
  yellowDim: "#F5A80018",
  dark: "#1C1C1C",
  darkMid: "#2D2D2D",
  darkSoft: "#3A3A3A",
  bg: "#F7F4EF",
  surface: "#FFFFFF",
  surfaceAlt: "#F2EFE9",
  border: "#E2DDD4",
  text: "#1C1C1C",
  textMuted: "#7A7267",
  textDim: "#4A453E",
  danger: "#C0392B",
  dangerDim: "#C0392B12",
  success: "#1E7B4B",
  successDim: "#1E7B4B12",
  warning: "#B45309",
  warningDim: "#B4530912",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Barlow', sans-serif;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: ${C.bg};
    background-image:
      radial-gradient(ellipse at 100% 0%, ${C.yellowDim} 0%, transparent 55%);
  }

  /* HEADER */
  .header {
    background: ${C.dark};
    padding: 0 40px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 12px #00000030;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0;
    text-decoration: none;
  }

  .header-logo-wrap {
    background: ${C.yellow};
    padding: 10px 20px;
    display: flex;
    align-items: center;
    margin-right: 20px;
    position: relative;
  }

  .header-logo-wrap::after {
    content: '';
    position: absolute;
    right: -14px;
    top: 0;
    bottom: 0;
    width: 28px;
    background: ${C.yellow};
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    z-index: 1;
  }

  .header-logo { height: 36px; display: block; position: relative; z-index: 2; }

  .header-title-wrap { display: flex; flex-direction: column; justify-content: center; padding-left: 8px; }
  .header-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.04em; text-transform: uppercase; line-height: 1.1; }
  .header-subtitle { font-size: 10px; color: ${C.yellow}; font-family: 'DM Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }

  .header-right { display: flex; align-items: center; gap: 16px; }

  .user-chip {
    display: flex; align-items: center; gap: 10px;
    background: ${C.darkMid};
    border: 1px solid ${C.darkSoft};
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 12px;
    color: #ccc;
  }

  .user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    overflow: hidden;
    background: ${C.yellow};
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: ${C.dark};
  }

  .btn-signout {
    background: none; border: none; cursor: pointer;
    color: #888; font-size: 11px; font-family: 'DM Mono', monospace;
    padding: 0; margin-left: 4px; transition: color 0.15s;
  }
  .btn-signout:hover { color: ${C.danger}; }

  /* MAIN */
  .main { max-width: 1180px; margin: 0 auto; padding: 36px 40px; }

  /* LOGIN */
  .login-screen {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 75vh; text-align: center;
  }

  .login-card {
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 20px;
    padding: 52px 60px;
    max-width: 440px;
    width: 100%;
    box-shadow: 0 8px 40px #00000012;
  }

  .login-logo { height: 56px; margin: 0 auto 28px; display: block; }

  .login-divider {
    width: 48px; height: 3px;
    background: ${C.yellow};
    margin: 0 auto 24px;
    border-radius: 2px;
  }

  .login-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 26px; font-weight: 700;
    color: ${C.dark};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 10px;
  }

  .login-sub {
    font-size: 14px; color: ${C.textMuted};
    line-height: 1.7; margin-bottom: 32px;
  }

  .btn-google {
    display: flex; align-items: center; gap: 12px;
    background: ${C.dark}; color: white;
    border: none; border-radius: 10px;
    padding: 14px 24px; font-size: 14px; font-weight: 600;
    font-family: 'Barlow', sans-serif;
    cursor: pointer; transition: all 0.2s;
    width: 100%; justify-content: center;
    letter-spacing: 0.02em;
  }

  .btn-google:hover:not(:disabled) {
    background: ${C.darkMid};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px #00000025;
  }

  .btn-google:disabled { opacity: 0.5; cursor: not-allowed; }

  .google-logo { width: 18px; height: 18px; flex-shrink: 0; }

  .login-footer {
    margin-top: 20px;
    font-size: 11px;
    color: ${C.textMuted};
    font-family: 'DM Mono', monospace;
  }

  /* PANEL */
  .panel-grid {
    display: grid;
    grid-template-columns: 290px 1fr;
    gap: 24px;
    align-items: start;
  }

  .panel-left { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }

  /* CARDS */
  .card {
    background: ${C.surface};
    border: 1px solid ${C.border};
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px #00000008;
  }

  .card-header {
    padding: 14px 18px;
    border-bottom: 1px solid ${C.border};
    display: flex; align-items: center; gap: 10px;
    background: ${C.surfaceAlt};
  }

  .card-header-accent {
    background: ${C.dark};
  }

  .card-icon { font-size: 15px; }
  .card-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: ${C.textDim}; font-family: 'Barlow Condensed', sans-serif; }
  .card-title-light { color: #fff; }
  .card-body { padding: 18px; }

  .section-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: ${C.textMuted}; margin-bottom: 8px;
    font-family: 'DM Mono', monospace;
  }

  /* DRIVE BUTTONS */
  .btn-drive {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
    background: ${C.yellow};
    border: none;
    border-radius: 8px;
    padding: 12px 14px;
    color: ${C.dark};
    font-size: 13px; font-weight: 600;
    font-family: 'Barlow', sans-serif;
    cursor: pointer; transition: all 0.2s;
    text-align: left;
  }

  .btn-drive:hover { background: ${C.yellowDark}; transform: translateY(-1px); box-shadow: 0 4px 14px ${C.yellow}50; }

  .selected-folder {
    background: ${C.yellowDim};
    border: 1px solid ${C.yellow}60;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 11px;
    color: ${C.warning};
    font-family: 'DM Mono', monospace;
    word-break: break-all;
    margin-top: 8px;
  }

  .files-list { display: flex; flex-direction: column; gap: 6px; max-height: 240px; overflow-y: auto; }

  .file-chip {
    display: flex; align-items: center; gap: 8px;
    background: ${C.surfaceAlt};
    border: 1px solid ${C.border};
    border-radius: 8px;
    padding: 8px 10px;
    transition: border-color 0.15s;
    cursor: pointer;
  }

  .file-chip:hover { border-color: ${C.yellow}; }
  .file-chip.selected { border-color: ${C.yellow}; background: ${C.yellowDim}; }

  .file-chip-icon { font-size: 14px; flex-shrink: 0; }
  .file-chip-name { flex: 1; font-size: 11px; color: ${C.textDim}; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .file-chip-check {
    width: 16px; height: 16px; border-radius: 4px;
    border: 1.5px solid ${C.border};
    background: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; transition: all 0.15s; flex-shrink: 0;
  }

  .file-chip-check.checked { background: ${C.yellow}; border-color: ${C.yellow}; color: ${C.dark}; font-weight: 700; }

  .context-input {
    width: 100%; background: ${C.surfaceAlt};
    border: 1px solid ${C.border}; border-radius: 8px;
    padding: 10px 12px; color: ${C.text};
    font-family: 'Barlow', sans-serif; font-size: 13px;
    resize: vertical; min-height: 72px; outline: none;
    transition: border-color 0.2s;
  }

  .context-input:focus { border-color: ${C.yellow}; box-shadow: 0 0 0 3px ${C.yellowDim}; }
  .context-input::placeholder { color: ${C.textMuted}; }

  .btn-analyze {
    width: 100%; padding: 14px;
    background: ${C.dark}; color: white;
    border: none; border-radius: 10px;
    font-size: 14px; font-weight: 700;
    font-family: 'Barlow Condensed', sans-serif;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    border-left: 4px solid ${C.yellow};
  }

  .btn-analyze:hover:not(:disabled) {
    background: ${C.darkMid};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px #00000020;
  }

  .btn-analyze:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* RESULTS */
  .results { display: flex; flex-direction: column; gap: 18px; }

  .period-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .period-chip {
    background: ${C.dark}; color: ${C.yellow};
    border-radius: 6px; padding: 4px 12px;
    font-size: 11px; font-family: 'DM Mono', monospace;
    font-weight: 500; letter-spacing: 0.06em;
  }

  .narrative { font-size: 14px; line-height: 1.8; color: ${C.textDim}; white-space: pre-wrap; }

  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }

  .kpi-card {
    background: ${C.surfaceAlt};
    border: 1px solid ${C.border};
    border-radius: 10px; padding: 14px;
    border-top: 3px solid ${C.yellow};
    transition: box-shadow 0.2s;
  }

  .kpi-card:hover { box-shadow: 0 4px 14px #00000012; }

  .kpi-label { font-size: 10px; color: ${C.textMuted}; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .kpi-value { font-size: 20px; font-weight: 700; font-family: 'Barlow Condensed', sans-serif; color: ${C.dark}; }
  .kpi-delta { font-size: 11px; margin-top: 5px; font-family: 'DM Mono', monospace; }
  .delta-up { color: ${C.success}; }
  .delta-down { color: ${C.danger}; }
  .delta-neutral { color: ${C.textMuted}; }

  .alerts { display: flex; flex-direction: column; gap: 10px; }

  .alert {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px; border-radius: 10px;
    font-size: 13px; line-height: 1.6;
  }

  .alert-critical { background: ${C.dangerDim}; border: 1px solid ${C.danger}33; border-left: 3px solid ${C.danger}; }
  .alert-warning { background: ${C.warningDim}; border: 1px solid ${C.warning}33; border-left: 3px solid ${C.warning}; }
  .alert-positive { background: ${C.successDim}; border: 1px solid ${C.success}33; border-left: 3px solid ${C.success}; }

  .alert-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
  .alert-title { font-weight: 700; margin-bottom: 3px; font-family: 'Barlow Condensed', sans-serif; font-size: 15px; letter-spacing: 0.02em; }

  .comparison-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .comparison-table th {
    text-align: left; padding: 10px 14px;
    font-family: 'DM Mono', monospace; font-size: 10px;
    font-weight: 500; color: ${C.textMuted};
    text-transform: uppercase; letter-spacing: 0.08em;
    border-bottom: 2px solid ${C.yellow};
    background: ${C.surfaceAlt};
  }
  .comparison-table td { padding: 10px 14px; border-bottom: 1px solid ${C.border}; color: ${C.textDim}; }
  .comparison-table tr:last-child td { border-bottom: none; }
  .comparison-table tr:hover td { background: ${C.surfaceAlt}; }
  .td-label { color: ${C.text}; font-weight: 600; }
  .td-number { font-family: 'DM Mono', monospace; }
  .td-up { color: ${C.success}; font-family: 'DM Mono', monospace; font-weight: 600; }
  .td-down { color: ${C.danger}; font-family: 'DM Mono', monospace; font-weight: 600; }

  .loading {
    display: flex; align-items: center; gap: 14px;
    padding: 20px 24px; background: ${C.surface};
    border: 1px solid ${C.border}; border-radius: 12px;
    border-left: 4px solid ${C.yellow};
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid ${C.border};
    border-top-color: ${C.yellow};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text { font-size: 13px; color: ${C.textDim}; font-weight: 500; }
  .loading-step { font-size: 11px; color: ${C.textMuted}; font-family: 'DM Mono', monospace; margin-top: 3px; }

  .error-box {
    padding: 14px 18px; background: ${C.dangerDim};
    border: 1px solid ${C.danger}33; border-left: 3px solid ${C.danger};
    border-radius: 10px; font-size: 13px; color: ${C.danger};
  }

  .empty-state {
    text-align: center; padding: 60px 20px;
    color: ${C.textMuted}; font-size: 14px;
  }

  .empty-icon { font-size: 40px; margin-bottom: 14px; opacity: 0.5; }
  .empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; color: ${C.textDim}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }

  .btn-reset {
    padding: 9px 18px; background: transparent;
    border: 1px solid ${C.border}; border-radius: 8px;
    color: ${C.textMuted}; font-size: 12px;
    font-family: 'Barlow', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }

  .btn-reset:hover { border-color: ${C.yellow}; color: ${C.dark}; background: ${C.yellowDim}; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
`;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function parseAnalysis(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(clean.slice(start, end + 1));
  } catch { return null; }
}

function KPIGrid({ kpis }) {
  if (!kpis?.length) return null;
  return (
    <div className="kpi-grid">
      {kpis.map((k, i) => (
        <div key={i} className="kpi-card">
          <div className="kpi-label">{k.label}</div>
          <div className="kpi-value">{k.value}</div>
          {k.delta && (
            <div className={`kpi-delta ${k.trend === "up" ? "delta-up" : k.trend === "down" ? "delta-down" : "delta-neutral"}`}>
              {k.trend === "up" ? "▲" : k.trend === "down" ? "▼" : "─"} {k.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AlertsList({ alerts }) {
  if (!alerts?.length) return <p style={{ color: C.textMuted, fontSize: 13 }}>Sin alertas detectadas.</p>;
  return (
    <div className="alerts">
      {alerts.map((a, i) => (
        <div key={i} className={`alert alert-${a.type}`}>
          <div className="alert-icon">{a.type === "critical" ? "🔴" : a.type === "warning" ? "🟡" : "🟢"}</div>
          <div>
            <div className="alert-title">{a.title}</div>
            <div>{a.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({ rows }) {
  if (!rows?.length) return null;
  const hasDelta = rows.some(r => r.delta);
  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Métrica</th>
          <th>Período Actual</th>
          <th>Período Anterior</th>
          {hasDelta && <th>Variación</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const cls = r.delta?.startsWith("-") ? "td-down" : r.delta ? "td-up" : "";
          return (
            <tr key={i}>
              <td className="td-label">{r.metric}</td>
              <td className="td-number">{r.current}</td>
              <td className="td-number">{r.previous ?? "—"}</td>
              {hasDelta && <td className={cls}>{r.delta ?? "—"}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function App() {
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [driveFiles, setDriveFiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [folderName, setFolderName] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const tokenClientRef = useRef(null);

  useEffect(() => {
    Promise.all([
      loadScript("https://apis.google.com/js/api.js"),
      loadScript("https://accounts.google.com/gsi/client"),
    ]).then(() => {
      window.gapi.load("client:picker", () => {
        window.gapi.client.init({}).then(() => setGapiReady(true));
      });
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
          if (resp.error) { setError("Error de autenticación: " + resp.error); return; }
          setToken(resp.access_token);
          fetchUserInfo(resp.access_token);
        },
      });
      setGisReady(true);
    });
  }, []);

  const fetchUserInfo = async (accessToken) => {
    try {
      const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const d = await r.json();
      setUser({ name: d.name, email: d.email, picture: d.picture });
    } catch {}
  };

  const signIn = () => {
    if (!gapiReady || !gisReady) return;
    tokenClientRef.current.requestAccessToken({ prompt: "consent" });
  };

  const signOut = () => {
    if (token) window.google.accounts.oauth2.revoke(token);
    setToken(null); setUser(null); setDriveFiles([]);
    setSelectedIds(new Set()); setResult(null); setFolderName("");
  };

  const openPicker = useCallback(() => {
    if (!token) return;
    const picker = new window.google.picker.PickerBuilder()
      .addView(
        new window.google.picker.DocsView()
          .setIncludeFolders(true)
          .setSelectFolderEnabled(true)
          .setMimeTypes("application/vnd.google-apps.folder,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel")
      )
      .setOAuthToken(token)
      .setCallback(async (data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          if (doc.mimeType === "application/vnd.google-apps.folder") {
            setFolderName(doc.name);
            await loadFolderFiles(doc.id);
          } else {
            setFolderName("Archivos seleccionados");
            setDriveFiles([{ id: doc.id, name: doc.name, mimeType: doc.mimeType }]);
            setSelectedIds(new Set([doc.id]));
          }
        }
      })
      .build();
    picker.setVisible(true);
  }, [token]);

  const loadFolderFiles = async (folderId) => {
    try {
      const r = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType='application/pdf'+or+mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'+or+mimeType='application/vnd.ms-excel')&fields=files(id,name,mimeType,size)&pageSize=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const d = await r.json();
      const files = d.files || [];
      setDriveFiles(files);
      setSelectedIds(new Set(files.map(f => f.id)));
    } catch (e) {
      setError("Error al leer la carpeta: " + e.message);
    }
  };

  const toggleFile = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchFileAsBase64 = async (fileId) => {
    const r = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await r.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const analyze = async () => {
    const toProcess = driveFiles.filter(f => selectedIds.has(f.id));
    if (!toProcess.length) return;
    setLoading(true); setError(""); setResult(null);

    try {
      const contentParts = [];

      for (const file of toProcess) {
        setLoadingStep(`Descargando ${file.name}...`);
        const isPdf = file.mimeType === "application/pdf";
        if (isPdf) {
          const b64 = await fetchFileAsBase64(file.id);
          contentParts.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } });
        } else {
          contentParts.push({ type: "text", text: `[Archivo Excel: ${file.name} — extrae e interpreta toda la información financiera disponible]` });
        }
      }

      const userCtx = context.trim() ? `\n\nContexto adicional: ${context}` : "";
      const fileNames = toProcess.map(f => f.name).join(", ");

      contentParts.push({
        type: "text",
        text: `Analiza los reportes financieros de Ferreyros (${fileNames}).${userCtx}

Devuelve SOLO un objeto JSON válido sin texto adicional, markdown ni backticks:

{
  "summary": "resumen ejecutivo narrativo en 3-5 párrafos detallados y profesionales",
  "kpis": [
    { "label": "nombre métrica", "value": "valor formateado", "delta": "variación vs anterior", "trend": "up|down|neutral" }
  ],
  "comparison": [
    { "metric": "nombre", "current": "valor actual", "previous": "valor anterior", "delta": "+X% o -X%" }
  ],
  "alerts": [
    { "type": "critical|warning|positive", "title": "título corto", "description": "descripción detallada y accionable" }
  ],
  "periods": ["Período 1", "Período 2"]
}

Extrae TODOS los KPIs relevantes: ingresos, utilidad neta, EBITDA, márgenes, liquidez, deuda, ROE, ROA, flujo de caja, gastos operativos. Compara todos los períodos. Las alertas deben ser concretas y accionables. Usa formato monetario del documento (S/. o $).`
      });

      setLoadingStep("Analizando documentos...");
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: contentParts }],
        }),
      });

      setLoadingStep("Procesando resultados...");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Error en API");

      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = parseAnalysis(text);
      setResult(parsed || { summary: text, kpis: [], alerts: [], comparison: [] });
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false); setLoadingStep("");
    }
  };

  const getFileIcon = (mimeType) => mimeType === "application/pdf" ? "📄" : "📊";
  const selectedCount = driveFiles.filter(f => selectedIds.has(f.id)).length;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-brand">
            <div className="header-logo-wrap">
              <img src="/logo.png" alt="Ferreyros" className="header-logo" />
            </div>
            <div className="header-title-wrap">
              <div className="header-title">Análisis de Resultados</div>
              <div className="header-subtitle">Inteligencia Financiera</div>
            </div>
          </div>
          {user && (
            <div className="header-right">
              <div className="user-chip">
                <div className="user-avatar">
                  {user.picture
                    ? <img src={user.picture} style={{ width: 26, height: 26 }} alt="" />
                    : user.name?.[0]}
                </div>
                <span>{user.email}</span>
                <button className="btn-signout" onClick={signOut}>salir</button>
              </div>
            </div>
          )}
        </div>

        <div className="main">
          {!token ? (
            <div className="login-screen">
              <div className="login-card">
                <img src="/logo.png" alt="Ferreyros" className="login-logo" />
                <div className="login-divider" />
                <div className="login-title">Análisis de Resultados</div>
                <div className="login-sub">
                  Accede con tu cuenta corporativa para analizar los reportes financieros desde Google Drive.
                </div>
                <button className="btn-google" onClick={signIn} disabled={!gapiReady || !gisReady}>
                  <svg className="google-logo" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Ingresar con Google
                </button>
                <div className="login-footer">Acceso restringido — solo usuarios autorizados</div>
              </div>
            </div>
          ) : (
            <div className="panel-grid">
              <div className="panel-left">
                <div className="card">
                  <div className="card-header card-header-accent">
                    <span className="card-icon">📁</span>
                    <span className="card-title card-title-light">Google Drive</span>
                  </div>
                  <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="btn-drive" onClick={openPicker}>
                      <span>🔍</span>
                      <span>Seleccionar carpeta o archivos</span>
                    </button>
                    {folderName && <div className="selected-folder">📂 {folderName}</div>}
                  </div>
                </div>

                {driveFiles.length > 0 && (
                  <div className="card">
                    <div className="card-header">
                      <span className="card-icon">📋</span>
                      <span className="card-title">Archivos ({selectedCount}/{driveFiles.length})</span>
                    </div>
                    <div className="card-body">
                      <div className="files-list">
                        {driveFiles.map(f => (
                          <div
                            key={f.id}
                            className={`file-chip ${selectedIds.has(f.id) ? "selected" : ""}`}
                            onClick={() => toggleFile(f.id)}
                          >
                            <span className="file-chip-icon">{getFileIcon(f.mimeType)}</span>
                            <span className="file-chip-name" title={f.name}>{f.name}</span>
                            <div className={`file-chip-check ${selectedIds.has(f.id) ? "checked" : ""}`}>
                              {selectedIds.has(f.id) && "✓"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="card">
                  <div className="card-header">
                    <span className="card-icon">💬</span>
                    <span className="card-title">Contexto adicional</span>
                  </div>
                  <div className="card-body">
                    <textarea
                      className="context-input"
                      placeholder="Ej: comparar Q1 2024 vs Q1 2025, enfocarse en márgenes operativos..."
                      value={context}
                      onChange={e => setContext(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="btn-analyze"
                  disabled={selectedCount === 0 || loading}
                  onClick={analyze}
                >
                  {loading ? "Analizando..." : selectedCount > 0
                    ? `Analizar ${selectedCount} archivo${selectedCount > 1 ? "s" : ""}`
                    : "Selecciona archivos"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {loading && (
                  <div className="loading">
                    <div className="spinner" />
                    <div>
                      <div className="loading-text">Procesando reportes...</div>
                      <div className="loading-step">{loadingStep}</div>
                    </div>
                  </div>
                )}

                {error && <div className="error-box">⚠️ {error}</div>}

                {!result && !loading && !error && (
                  <div className="card">
                    <div className="card-body">
                      <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <div className="empty-title">Sin análisis activo</div>
                        <div>Selecciona una carpeta de Drive y presiona Analizar</div>
                      </div>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="results">
                    {result.periods?.length > 0 && (
                      <div className="period-chips">
                        {result.periods.map((p, i) => <span key={i} className="period-chip">{p}</span>)}
                      </div>
                    )}

                    {result.summary && (
                      <div className="card">
                        <div className="card-header"><span className="card-icon">📋</span><span className="card-title">Resumen Ejecutivo</span></div>
                        <div className="card-body"><div className="narrative">{result.summary}</div></div>
                      </div>
                    )}

                    {result.kpis?.length > 0 && (
                      <div className="card">
                        <div className="card-header"><span className="card-icon">📊</span><span className="card-title">KPIs Principales</span></div>
                        <div className="card-body"><KPIGrid kpis={result.kpis} /></div>
                      </div>
                    )}

                    {result.comparison?.length > 0 && (
                      <div className="card">
                        <div className="card-header"><span className="card-icon">🔄</span><span className="card-title">Comparación de Períodos</span></div>
                        <div className="card-body"><ComparisonTable rows={result.comparison} /></div>
                      </div>
                    )}

                    {result.alerts && (
                      <div className="card">
                        <div className="card-header"><span className="card-icon">🚨</span><span className="card-title">Alertas & Hallazgos</span></div>
                        <div className="card-body"><AlertsList alerts={result.alerts} /></div>
                      </div>
                    )}

                    <button className="btn-reset" onClick={() => setResult(null)}>← Nuevo análisis</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
