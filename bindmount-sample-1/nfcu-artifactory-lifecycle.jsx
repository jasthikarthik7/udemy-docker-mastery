import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Request & Approval",
    icon: "📋",
    color: "#4A9EFF",
    status: "controlled",
    details: [
      "Application teams submit via ServiceNow catalog intake workflow",
      "Approval from application team manager (security approval case-by-case)",
    ],
    control: "Unauthorized/personal artifacts are NOT allowed into Artifactory",
  },
  {
    id: 2,
    title: "Source of Dependencies",
    icon: "🌐",
    color: "#4A9EFF",
    status: "controlled",
    details: [
      "Predefined trusted remote repositories",
      "Open-source ecosystems (Maven, NPM, PyPI, etc.)",
      "Vendor-provided artifacts (configured upstream or manual upload)",
    ],
    control: "All sources proxied into Artifactory via remote repositories",
  },
  {
    id: 3,
    title: "Pre-Entry Vetting (Curation)",
    icon: "🔍",
    color: "#F5A623",
    status: "partial",
    details: [
      "JFrog Curation service evaluates before entering NFCU environment",
      "Uses metadata + external intelligence (not NFCU-controlled logic)",
      "Blocks artifacts based on configured security policies",
    ],
    control: "Known vulnerable artifacts may be blocked before entry",
  },
  {
    id: 4,
    title: "Ingestion via DMZ → Internal",
    icon: "🔄",
    color: "#4A9EFF",
    status: "controlled",
    details: [
      "Dependencies staged externally in DMZ first",
      "Promoted into internal Artifactory repositories",
    ],
    control: "Creates a logical trust boundary between external and internal",
  },
  {
    id: 5,
    title: "Security Scanning (JFrog Xray)",
    icon: "🛡️",
    color: "#F5A623",
    status: "partial",
    details: [
      "Scans using NVD and VulnDB vulnerability databases",
      "Scans at ingestion AND continuously (re-evaluation over time)",
    ],
    control: "⚠️ Only CRITICAL (CVSS-based) vulnerabilities are blocked",
  },
  {
    id: 6,
    title: "Artifact Availability to Developers",
    icon: "📦",
    color: "#F5A623",
    status: "gap",
    details: [
      "Approved artifacts available via local/virtual repositories",
      "Served via internal Artifactory endpoints",
    ],
    control: "⚠️ GAP: Some teams bypass Artifactory (direct internet pulls)",
  },
  {
    id: 7,
    title: "Post-Ingestion Risk Handling",
    icon: "⚡",
    color: "#E05C5C",
    status: "gap",
    details: [
      "If detected by Xray: artifact may be auto-blocked (policy-dependent)",
      "If NOT detected: requires manual intervention",
      "Already-downloaded artifacts may still be used via caching",
    ],
    control: "⚠️ Cached artifacts remain accessible even after blocking",
  },
  {
    id: 8,
    title: "Incident Response / Blocking",
    icon: "🚨",
    color: "#E05C5C",
    status: "partial",
    details: [
      "Security/platform team can add to exclusion list, block access, remove visibility",
      "Triggers: Security teams (SIR/CSOC), Artifactory team, External findings",
    ],
    control: "⚠️ Blocking + communication is largely manual",
  },
  {
    id: 9,
    title: "SBOM Handling",
    icon: "📄",
    color: "#E05C5C",
    status: "gap",
    details: [
      "❌ No native SBOM generation for third-party deps in JFrog",
      "✅ SBOMs generated for internal apps via Black Duck pipelines",
      "✅ Stored in Artifactory (local repos) for supported pipelines",
    ],
    control: "⚠️ GAP: No SBOMs for third-party artifacts at ingestion level",
  },
  {
    id: 10,
    title: "Signature & License Validation",
    icon: "✍️",
    color: "#E05C5C",
    status: "gap",
    details: [
      "Capability exists: signature validation + license checks",
      "❗ Currently NOT enforced for blocking",
      "Reason: Prior enforcement caused usability issues",
    ],
    control: "⚠️ Not enforced — license violations and signature failures pass through",
  },
];

const gaps = [
  {
    id: 1,
    title: "Enforcement Gap",
    desc: "Some teams bypass Artifactory entirely via direct internet access",
    icon: "🔓",
  },
  {
    id: 2,
    title: "Weak Policy Enforcement",
    desc: "Only Critical vulns blocked. High/Medium vulns, license violations, and signature failures are not enforced",
    icon: "⚠️",
  },
  {
    id: 3,
    title: "Manual IR Processes",
    desc: "Blocking and communication after an incident is largely manual with no automation",
    icon: "🔧",
  },
  {
    id: 4,
    title: "No Enterprise Visibility",
    desc: "No mapping from artifact → application. No complete inventory or coverage metrics",
    icon: "👁️",
  },
  {
    id: 5,
    title: "SBOM Gaps",
    desc: "No SBOMs generated for third-party artifacts at the ingestion level",
    icon: "📋",
  },
];

const statusColors = {
  controlled: { bg: "#0D2F1A", border: "#1E6B3A", badge: "#2A9D5C", label: "Controlled" },
  partial: { bg: "#2B1E00", border: "#7A5200", badge: "#F5A623", label: "Partial" },
  gap: { bg: "#2B0A0A", border: "#7A1E1E", badge: "#E05C5C", label: "Gap" },
};

export default function App() {
  const [activeStep, setActiveStep] = useState(null);
  const [view, setView] = useState("diagram");

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      background: "#080C12",
      minHeight: "100vh",
      color: "#C8D8E8",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D1520; }
        ::-webkit-scrollbar-thumb { background: #1E3A5A; border-radius: 3px; }
        .step-card { transition: all 0.2s ease; cursor: pointer; }
        .step-card:hover { transform: translateY(-2px); }
        .tab-btn { transition: all 0.2s ease; cursor: pointer; border: none; }
        .tab-btn:hover { opacity: 0.85; }
        .gap-card { transition: all 0.2s ease; }
        .gap-card:hover { transform: translateX(4px); }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .animate-in { animation: slideIn 0.3s ease forwards; }
        .flow-arrow { color: #1E4A7A; font-size: 20px; text-align: center; margin: 2px 0; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0D1A2E 0%, #0A2040 100%)",
        borderBottom: "1px solid #1E3A5A",
        padding: "28px 32px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#4A9EFF", marginBottom: "6px", fontFamily: "'IBM Plex Mono'" }}>
              SUPPLY CHAIN SECURITY // CURRENT STATE
            </div>
            <h1 style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 700,
              color: "#E8F4FF",
              margin: 0,
              letterSpacing: "-0.3px",
            }}>
              NFCU Artifactory — Third-Party Dependency Lifecycle
            </h1>
            <div style={{ marginTop: "8px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { color: "#2A9D5C", label: "Controlled" },
                { color: "#F5A623", label: "Partial Coverage" },
                { color: "#E05C5C", label: "Gap / Risk" },
              ].map(s => (
                <span key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#8AAAC0" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["diagram", "gaps", "summary"].map(v => (
              <button
                key={v}
                className="tab-btn"
                onClick={() => setView(v)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "'IBM Plex Mono'",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  background: view === v ? "#1A3D6B" : "transparent",
                  color: view === v ? "#4A9EFF" : "#5A7A9A",
                  border: `1px solid ${view === v ? "#2A5DA0" : "#1E3A5A"}`,
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* DIAGRAM VIEW */}
        {view === "diagram" && (
          <div className="animate-in" style={{ display: "grid", gridTemplateColumns: activeStep ? "1fr 340px" : "1fr", gap: "20px" }}>
            {/* Flow */}
            <div>
              <div style={{ fontSize: "11px", color: "#4A7A9A", letterSpacing: "2px", marginBottom: "16px" }}>
                END-TO-END LIFECYCLE FLOW
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {steps.map((step, idx) => {
                  const sc = statusColors[step.status];
                  const isActive = activeStep?.id === step.id;
                  return (
                    <div key={step.id}>
                      <div
                        className="step-card"
                        onClick={() => setActiveStep(isActive ? null : step)}
                        style={{
                          background: isActive ? sc.bg : "#0D1520",
                          border: `1px solid ${isActive ? sc.border : "#1A2E44"}`,
                          borderLeft: `3px solid ${sc.badge}`,
                          borderRadius: "8px",
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "6px",
                          background: "#0A1828", border: `1px solid ${sc.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "13px", flexShrink: 0,
                        }}>{step.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "10px", color: "#3A6A8A", fontFamily: "'IBM Plex Mono'" }}>
                              {String(step.id).padStart(2, "0")}
                            </span>
                            <span style={{
                              fontSize: "13px", fontWeight: 600,
                              color: isActive ? "#E8F4FF" : "#A0BDD4",
                              fontFamily: "'IBM Plex Sans', sans-serif",
                            }}>{step.title}</span>
                            <span style={{
                              marginLeft: "auto", fontSize: "9px", letterSpacing: "1px",
                              padding: "2px 7px", borderRadius: "3px",
                              background: sc.bg, border: `1px solid ${sc.border}`,
                              color: sc.badge, flexShrink: 0,
                            }}>{sc.label.toUpperCase()}</span>
                          </div>
                          {!isActive && (
                            <div style={{ fontSize: "11px", color: "#4A6A80", marginTop: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {step.details[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="flow-arrow">↓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Panel */}
            {activeStep && (
              <div className="animate-in" style={{
                background: "#0D1520",
                border: `1px solid ${statusColors[activeStep.status].border}`,
                borderRadius: "10px",
                padding: "20px",
                alignSelf: "start",
                position: "sticky",
                top: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "24px" }}>{activeStep.icon}</span>
                  <div>
                    <div style={{ fontSize: "9px", color: "#4A7A9A", letterSpacing: "2px" }}>STEP {String(activeStep.id).padStart(2, "0")}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#E8F4FF", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {activeStep.title}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStep(null)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "#4A6A80", cursor: "pointer", fontSize: "18px" }}
                  >×</button>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "9px", color: "#4A9EFF", letterSpacing: "2px", marginBottom: "8px" }}>DETAILS</div>
                  {activeStep.details.map((d, i) => (
                    <div key={i} style={{
                      fontSize: "11px", color: "#8AAAC0", marginBottom: "6px",
                      paddingLeft: "10px", borderLeft: "2px solid #1A3A5A",
                      lineHeight: "1.5",
                    }}>{d}</div>
                  ))}
                </div>

                <div style={{
                  background: statusColors[activeStep.status].bg,
                  border: `1px solid ${statusColors[activeStep.status].border}`,
                  borderRadius: "6px",
                  padding: "10px 12px",
                }}>
                  <div style={{ fontSize: "9px", color: statusColors[activeStep.status].badge, letterSpacing: "2px", marginBottom: "4px" }}>
                    KEY CONTROL / NOTE
                  </div>
                  <div style={{ fontSize: "11px", color: "#C0D4E8", lineHeight: "1.5" }}>{activeStep.control}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GAPS VIEW */}
        {view === "gaps" && (
          <div className="animate-in">
            <div style={{ fontSize: "11px", color: "#E05C5C", letterSpacing: "2px", marginBottom: "20px" }}>
              ⚠ KEY GAPS & RISKS — LEADERSHIP CRITICAL POINTS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
              {gaps.map(gap => (
                <div
                  key={gap.id}
                  className="gap-card"
                  style={{
                    background: "#0D1520",
                    border: "1px solid #3A1A1A",
                    borderLeft: "3px solid #E05C5C",
                    borderRadius: "8px",
                    padding: "16px 18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "18px" }}>{gap.icon}</span>
                    <span style={{
                      fontSize: "13px", fontWeight: 700, color: "#E8C0C0",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }}>
                      {gap.id}. {gap.title}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#8A7070", margin: 0, lineHeight: "1.6" }}>{gap.desc}</p>
                </div>
              ))}
            </div>

            {/* Risk Matrix */}
            <div style={{ marginTop: "28px" }}>
              <div style={{ fontSize: "11px", color: "#4A9EFF", letterSpacing: "2px", marginBottom: "14px" }}>
                ENFORCEMENT COVERAGE MATRIX
              </div>
              <div style={{
                background: "#0D1520", border: "1px solid #1A2E44", borderRadius: "8px", overflow: "hidden",
              }}>
                {[
                  { control: "Critical Vulnerability Blocking", status: "✅ Enforced", color: "#2A9D5C" },
                  { control: "High/Medium Vulnerability Blocking", status: "❌ Not Enforced", color: "#E05C5C" },
                  { control: "License Violation Blocking", status: "❌ Not Enforced", color: "#E05C5C" },
                  { control: "Signature Validation Blocking", status: "❌ Not Enforced", color: "#E05C5C" },
                  { control: "SBOM at Third-Party Ingestion", status: "❌ No Coverage", color: "#E05C5C" },
                  { control: "Artifactory Routing (All Teams)", status: "⚠️ Partial", color: "#F5A623" },
                  { control: "Automated IR / Blocking", status: "⚠️ Partial", color: "#F5A623" },
                  { control: "Enterprise Artifact Visibility", status: "❌ No Coverage", color: "#E05C5C" },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 16px",
                    background: i % 2 === 0 ? "transparent" : "#080C12",
                    borderBottom: i < 7 ? "1px solid #0F1E2E" : "none",
                  }}>
                    <span style={{ fontSize: "12px", color: "#8AAAC0" }}>{row.control}</span>
                    <span style={{ fontSize: "11px", color: row.color, fontWeight: 600, whiteSpace: "nowrap", marginLeft: "16px" }}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY VIEW */}
        {view === "summary" && (
          <div className="animate-in">
            <div style={{ fontSize: "11px", color: "#4A9EFF", letterSpacing: "2px", marginBottom: "20px" }}>
              LEADERSHIP SUMMARY — THREE CONTROL LAYERS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                {
                  num: "01", title: "Pre-Ingestion Control", subtitle: "Curation Layer",
                  color: "#4A9EFF", bg: "#0D1A2E", border: "#1A3A6A",
                  points: ["ServiceNow request + manager approval", "JFrog Curation vets before entry", "Trusted/preconfigured repos only"],
                  status: "Partial",
                },
                {
                  num: "02", title: "Security Scanning", subtitle: "JFrog Xray",
                  color: "#F5A623", bg: "#1E1400", border: "#5A3A00",
                  points: ["Scans at ingestion + continuously", "NVD + VulnDB sources", "Only Critical CVEs enforced for blocking"],
                  status: "Partial — Critical Only",
                },
                {
                  num: "03", title: "Operational Controls", subtitle: "IR & Exclusion",
                  color: "#E05C5C", bg: "#1E0A0A", border: "#5A1A1A",
                  points: ["Manual blocking via exclusion lists", "Triggered by SIR/CSOC or Artifactory team", "Cached artifacts remain risk post-block"],
                  status: "Manual / Gaps Exist",
                },
              ].map(layer => (
                <div key={layer.num} style={{
                  background: layer.bg, border: `1px solid ${layer.border}`,
                  borderTop: `3px solid ${layer.color}`,
                  borderRadius: "8px", padding: "18px",
                }}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: layer.color, opacity: 0.3, fontFamily: "'IBM Plex Mono'", lineHeight: 1 }}>
                    {layer.num}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#E8F4FF", fontFamily: "'IBM Plex Sans', sans-serif", marginTop: "4px" }}>
                    {layer.title}
                  </div>
                  <div style={{ fontSize: "10px", color: layer.color, letterSpacing: "1px", marginBottom: "12px" }}>{layer.subtitle.toUpperCase()}</div>
                  {layer.points.map((p, i) => (
                    <div key={i} style={{ fontSize: "11px", color: "#8AAAC0", marginBottom: "5px", display: "flex", gap: "6px" }}>
                      <span style={{ color: layer.color, flexShrink: 0 }}>—</span>{p}
                    </div>
                  ))}
                  <div style={{
                    marginTop: "12px", padding: "6px 10px", borderRadius: "4px",
                    background: "#080C12", fontSize: "10px", color: layer.color, letterSpacing: "1px",
                  }}>
                    STATUS: {layer.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Characteristics */}
            <div style={{
              background: "#0D1A2E", border: "1px solid #1A3A6A", borderRadius: "8px", padding: "20px",
            }}>
              <div style={{ fontSize: "11px", color: "#4A9EFF", letterSpacing: "2px", marginBottom: "14px" }}>
                KEY CHARACTERISTICS
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
                {[
                  { icon: "✅", text: "Controlled intake via ServiceNow + manager approval", good: true },
                  { icon: "✅", text: "Trusted/preconfigured repository sources", good: true },
                  { icon: "✅", text: "Critical vulnerability enforcement via Xray", good: true },
                  { icon: "⚠️", text: "Direct internet pulls bypassing Artifactory", good: false },
                  { icon: "⚠️", text: "Limited automation in IR processes", good: false },
                  { icon: "⚠️", text: "SBOM gaps for third-party dependencies", good: false },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: "10px 12px", borderRadius: "6px",
                    background: item.good ? "#0D2F1A" : "#2B0A0A",
                    border: `1px solid ${item.good ? "#1E6B3A" : "#5A1A1A"}`,
                    fontSize: "11px", color: "#A0BDD4", display: "flex", gap: "8px", alignItems: "flex-start",
                  }}>
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ lineHeight: "1.5" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "20px", fontSize: "10px", color: "#2A4A6A", letterSpacing: "1px" }}>
        NFCU // CICD Tools Team — JFrog Artifactory Lifecycle KT // Supply Chain Hardening
      </div>
    </div>
  );
}
