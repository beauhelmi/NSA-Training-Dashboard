import { useState } from "react";
import {
  LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

// ── DATA ────────────────────────────────────────────────────────────────────

const easyData = [
  {date:"2025-07-28",avgHR:126,pace:7.105,distance:7.01},
  {date:"2025-07-29",avgHR:124,pace:7.012,distance:7.0},
  {date:"2025-08-15",avgHR:122,pace:6.348,distance:7.01},
  {date:"2025-08-18",avgHR:119,pace:7.337,distance:7.0},
  {date:"2025-08-22",avgHR:125,pace:6.894,distance:7.0},
  {date:"2025-08-24",avgHR:129,pace:7.005,distance:10.0},
  {date:"2025-08-25",avgHR:129,pace:6.705,distance:7.01},
  {date:"2025-08-27",avgHR:122,pace:7.662,distance:5.85},
  {date:"2025-08-29",avgHR:129,pace:6.651,distance:7.0},
  {date:"2025-08-31",avgHR:129,pace:7.057,distance:11.01},
  {date:"2025-09-07",avgHR:130,pace:6.890,distance:13.06},
  {date:"2025-09-08",avgHR:130,pace:6.854,distance:7.29},
  {date:"2025-09-12",avgHR:129,pace:6.491,distance:7.7},
  {date:"2025-09-14",avgHR:141,pace:6.373,distance:12.92},
  {date:"2025-09-22",avgHR:125,pace:7.048,distance:7.09},
  {date:"2025-09-23",avgHR:125,pace:6.542,distance:7.64},
  {date:"2025-09-25",avgHR:131,pace:6.559,distance:7.62},
  {date:"2025-09-27",avgHR:125,pace:6.986,distance:12.0},
  {date:"2025-09-29",avgHR:126,pace:6.742,distance:7.41},
  {date:"2025-10-02",avgHR:124,pace:6.378,distance:4.75},
  {date:"2025-10-04",avgHR:135,pace:6.795,distance:4.02},
  {date:"2025-10-05",avgHR:119,pace:7.159,distance:5.73},
  {date:"2025-10-07",avgHR:127,pace:6.706,distance:7.0},
  {date:"2025-10-08",avgHR:122,pace:7.625,distance:10.0},
  {date:"2025-10-09",avgHR:122,pace:6.718,distance:7.0},
  {date:"2025-10-11",avgHR:124,pace:6.669,distance:9.01},
  {date:"2025-10-13",avgHR:130,pace:6.602,distance:7.01},
  {date:"2025-10-14",avgHR:126,pace:6.888,distance:7.0},
  {date:"2025-10-15",avgHR:130,pace:6.535,distance:7.0},
  {date:"2025-10-16",avgHR:126,pace:6.834,distance:7.0},
  {date:"2025-10-18",avgHR:130,pace:6.477,distance:7.71},
  {date:"2025-10-19",avgHR:126,pace:7.014,distance:7.25},
  {date:"2025-10-20",avgHR:128,pace:6.678,distance:7.01},
  {date:"2025-10-22",avgHR:130,pace:6.530,distance:7.0},
  {date:"2025-10-23",avgHR:128,pace:6.764,distance:7.01},
  {date:"2025-10-25",avgHR:130,pace:6.489,distance:7.62},
  {date:"2025-10-27",avgHR:128,pace:6.752,distance:7.3},
  {date:"2025-10-29",avgHR:130,pace:6.599,distance:7.01},
  {date:"2025-10-30",avgHR:125,pace:6.854,distance:7.0},
  {date:"2025-11-01",avgHR:128,pace:6.673,distance:7.01},
  {date:"2025-11-03",avgHR:128,pace:6.572,distance:7.31},
  {date:"2025-11-05",avgHR:128,pace:6.651,distance:7.0},
  {date:"2025-11-06",avgHR:130,pace:6.488,distance:7.01},
  {date:"2025-11-08",avgHR:128,pace:6.558,distance:7.0},
  {date:"2025-11-10",avgHR:128,pace:6.556,distance:7.0},
  {date:"2025-11-12",avgHR:128,pace:6.533,distance:7.01},
  {date:"2025-11-13",avgHR:126,pace:6.652,distance:7.01},
  {date:"2025-11-15",avgHR:126,pace:6.602,distance:7.0},
  {date:"2025-11-17",avgHR:130,pace:6.554,distance:7.0},
  {date:"2025-11-19",avgHR:128,pace:6.469,distance:8.61},
  {date:"2025-11-20",avgHR:126,pace:6.631,distance:7.0},
  {date:"2025-11-22",avgHR:128,pace:6.531,distance:7.01},
  {date:"2025-11-24",avgHR:130,pace:6.586,distance:7.01},
  {date:"2025-11-26",avgHR:130,pace:6.476,distance:7.01},
  {date:"2025-11-28",avgHR:128,pace:6.484,distance:7.0},
  {date:"2025-12-01",avgHR:126,pace:6.685,distance:7.0},
  {date:"2025-12-03",avgHR:126,pace:6.561,distance:7.22},
  {date:"2025-12-05",avgHR:126,pace:6.657,distance:7.01},
  {date:"2025-12-06",avgHR:126,pace:6.498,distance:7.01},
  {date:"2025-12-08",avgHR:126,pace:6.568,distance:7.01},
  {date:"2025-12-10",avgHR:126,pace:6.619,distance:7.01},
  {date:"2025-12-12",avgHR:125,pace:6.573,distance:7.0},
  {date:"2025-12-14",avgHR:124,pace:6.575,distance:7.01},
  {date:"2025-12-15",avgHR:124,pace:6.574,distance:7.0},
  {date:"2025-12-17",avgHR:124,pace:6.566,distance:7.0},
  {date:"2025-12-19",avgHR:124,pace:6.507,distance:7.01},
  {date:"2025-12-21",avgHR:124,pace:6.610,distance:7.0},
  {date:"2025-12-22",avgHR:124,pace:6.508,distance:7.01},
  {date:"2025-12-24",avgHR:122,pace:6.595,distance:7.0},
  {date:"2025-12-26",avgHR:122,pace:6.473,distance:7.02},
  {date:"2025-12-28",avgHR:122,pace:6.541,distance:7.01},
  {date:"2025-12-29",avgHR:122,pace:6.454,distance:7.01},
  {date:"2025-12-31",avgHR:122,pace:6.416,distance:7.01},
  {date:"2026-01-02",avgHR:120,pace:6.520,distance:7.0},
  {date:"2026-01-04",avgHR:120,pace:6.421,distance:7.01},
];

const subData = [
  {date:"2026-02-13",duration:3, reps:9, avgHR:144,intervalPace:4.911,intensity:78.2},
  {date:"2026-02-16",duration:10,reps:3, avgHR:143,intervalPace:5.178,intensity:80.5},
  {date:"2026-02-18",duration:6, reps:5, avgHR:146,intervalPace:5.080,intensity:78.6},
  {date:"2026-02-20",duration:3, reps:9, avgHR:144,intervalPace:4.744,intensity:80.5},
  {date:"2026-02-23",duration:10,reps:3, avgHR:140,intervalPace:5.156,intensity:79.0},
  {date:"2026-03-03",duration:3, reps:8, avgHR:138,intervalPace:4.985,intensity:77.5},
  {date:"2026-03-05",duration:6, reps:4, avgHR:140,intervalPace:5.000,intensity:76.7},
  {date:"2026-03-10",duration:6, reps:4, avgHR:142,intervalPace:5.008,intensity:77.9},
  {date:"2026-03-12",duration:12,reps:2, avgHR:144,intervalPace:5.008,intensity:80.4},
  {date:"2026-03-17",duration:6, reps:4, avgHR:143,intervalPace:4.963,intensity:76.7},
  {date:"2026-03-19",duration:12,reps:2, avgHR:144,intervalPace:5.017,intensity:77.9},
  {date:"2026-03-21",duration:3, reps:8, avgHR:153,intervalPace:4.647,intensity:91.0},
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

const fmtPace = (dec) => {
  if (!dec && dec !== 0) return "—";
  const m = Math.floor(dec);
  const s = Math.round((dec - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const shortDate = (d) => d.slice(5); // "MM-DD"

const DUR_COLORS = { 3: "#378ADD", 6: "#639922", 10: "#BA7517", 12: "#D85A30" };
const DUR_LABELS = { 3: "3 min", 6: "6 min", 10: "10 min", 12: "12 min" };

// ── SUB-THRESHOLD SCATTER DATA ───────────────────────────────────────────────
// Recharts ScatterChart needs one dataset per series (per duration)
const scatterBySeries = [3, 6, 10, 12].map((dur) => ({
  dur,
  color: DUR_COLORS[dur],
  label: DUR_LABELS[dur],
  points: subData
    .filter((d) => d.duration === dur)
    .map((d) => ({ x: d.intervalPace, y: d.avgHR, date: d.date, reps: d.reps })),
}));

// ── METRIC CARD ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub }) {
  return (
    <div style={{
      background: "#f5f5f3", borderRadius: 8, padding: "12px 16px", flex: "1 1 0"
    }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── CUSTOM TOOLTIPS ───────────────────────────────────────────────────────────
function EasyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:8, padding:"10px 14px", fontSize:13 }}>
      <div style={{ fontWeight:500, marginBottom:4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name === "pace"
            ? `Pace: ${fmtPace(p.value)}/km`
            : `HR: ${p.value} bpm`}
        </div>
      ))}
    </div>
  );
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:8, padding:"10px 14px", fontSize:13 }}>
      <div style={{ fontWeight:500, marginBottom:4 }}>{d.date}</div>
      <div>Pace: {fmtPace(d.x)}/km</div>
      <div>HR: {d.y} bpm</div>
      <div>Reps: {d.reps}</div>
    </div>
  );
}

// ── TAB BUTTON ────────────────────────────────────────────────────────────────
function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 20px", borderRadius: 8, border: "1px solid",
      borderColor: active ? "#333" : "#ddd",
      background: active ? "#f0f0ee" : "transparent",
      fontWeight: active ? 500 : 400, cursor: "pointer", fontSize: 14,
      color: active ? "#111" : "#666"
    }}>
      {label}
    </button>
  );
}

// ── INSIGHT BOX ───────────────────────────────────────────────────────────────
function Insight({ children }) {
  return (
    <div style={{
      borderLeft: "3px solid #5DCAA5", borderRadius: "0 8px 8px 0",
      background: "#f5f5f3", padding: "10px 16px", marginTop: 20,
      fontSize: 13, color: "#555", lineHeight: 1.6
    }}>
      {children}
    </div>
  );
}

// ── PANEL 1 — MORNING EASY RUNS ───────────────────────────────────────────────
function EasyPanel() {
  const [showHR, setShowHR]     = useState(true);
  const [showPace, setShowPace] = useState(true);

  const totalSessions = easyData.length;
  const avgPace = easyData.reduce((s, d) => s + d.pace, 0) / easyData.length;
  const avgHR   = easyData.reduce((s, d) => s + d.avgHR, 0) / easyData.length;
  const half    = Math.floor(easyData.length / 2);
  const p1 = easyData.slice(0, half).reduce((s,d)=>s+d.pace,0)/half;
  const p2 = easyData.slice(half).reduce((s,d)=>s+d.pace,0)/(easyData.length-half);
  const paceGain = p1 - p2;

  const chartData = easyData.map((d) => ({
    date: shortDate(d.date),
    pace: d.pace,
    hr:   d.avgHR,
  }));

  return (
    <div>
      {/* Metrics row */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="Total sessions"   value={totalSessions}       sub="morning easy runs" />
        <MetricCard label="Avg pace"         value={fmtPace(avgPace)}    sub="min/km overall" />
        <MetricCard label="Avg heart rate"   value={Math.round(avgHR)}   sub="bpm overall" />
        <MetricCard label="Pace gain"        value={`−${fmtPace(Math.abs(paceGain))}`} sub="faster in 2nd half" />
      </div>

      {/* Toggle buttons */}
      <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#888" }}>Show:</span>
        <button onClick={()=>setShowPace(v=>!v)} style={{
          padding:"4px 12px", borderRadius:6, border:"1px solid #378ADD",
          background: showPace ? "#378ADD" : "transparent",
          color: showPace ? "#fff" : "#378ADD", cursor:"pointer", fontSize:13
        }}>Pace</button>
        <button onClick={()=>setShowHR(v=>!v)} style={{
          padding:"4px 12px", borderRadius:6, border:"1px solid #D4537E",
          background: showHR ? "#D4537E" : "transparent",
          color: showHR ? "#fff" : "#D4537E", cursor:"pointer", fontSize:13
        }}>Heart Rate</button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top:5, right:20, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize:11, fill:"#aaa" }} tickCount={10} interval={6} />
          {showPace && (
            <YAxis
              yAxisId="pace" orientation="left"
              domain={[5.5, 8.5]} reversed
              tickFormatter={fmtPace}
              tick={{ fontSize:11, fill:"#378ADD" }}
              label={{ value:"pace (min/km)", angle:-90, position:"insideLeft", fill:"#378ADD", fontSize:11, dy:50 }}
            />
          )}
          {showHR && (
            <YAxis
              yAxisId="hr" orientation="right"
              domain={[110, 150]}
              tick={{ fontSize:11, fill:"#D4537E" }}
              label={{ value:"HR (bpm)", angle:90, position:"insideRight", fill:"#D4537E", fontSize:11, dy:-30 }}
            />
          )}
          <Tooltip content={<EasyTooltip />} />
          {showPace && (
            <Line yAxisId="pace" type="monotone" dataKey="pace" name="pace"
              stroke="#378ADD" dot={{ r:2 }} activeDot={{ r:5 }}
              strokeWidth={1.5} connectNulls />
          )}
          {showHR && (
            <Line yAxisId="hr" type="monotone" dataKey="hr" name="hr"
              stroke="#D4537E" dot={{ r:2 }} activeDot={{ r:5 }}
              strokeWidth={1.5} connectNulls />
          )}
        </LineChart>
      </ResponsiveContainer>

      <Insight>
        <strong>Aerobic base trend:</strong> Over ~8 months your pace improved by{" "}
        ~{fmtPace(Math.abs(paceGain))}/km in the second half of your log while HR
        stayed stable — a clear sign of growing aerobic efficiency. Toggle Pace / HR
        to isolate each metric.
      </Insight>
    </div>
  );
}

// ── PANEL 2 — SUB-THRESHOLD ───────────────────────────────────────────────────
function SubPanel() {
  const allPaces = subData.map(d => d.intervalPace);
  const allHRs   = subData.map(d => d.avgHR);
  const avgHRAll = allHRs.reduce((a,b)=>a+b,0)/allHRs.length;

  // Per-duration averages for summary bars
  const durSummary = [3, 6, 10, 12].map(dur => {
    const g = subData.filter(d => d.duration === dur);
    if (!g.length) return null;
    return {
      dur,
      avgPace: g.reduce((s,d)=>s+d.intervalPace,0)/g.length,
      avgHR:   g.reduce((s,d)=>s+d.avgHR,0)/g.length,
      count:   g.length,
    };
  }).filter(Boolean);

  return (
    <div>
      {/* Metrics */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="Sessions"     value={subData.length}              sub="sub-threshold blocks" />
        <MetricCard label="Best rep pace" value={fmtPace(Math.min(...allPaces))} sub="min/km (3-min rep)" />
        <MetricCard label="Avg session HR" value={Math.round(avgHRAll)}       sub="bpm across all types" />
        <MetricCard label="Duration range" value="3 – 12"                     sub="minute intervals" />
      </div>

      {/* Scatter chart */}
      <p style={{ fontSize:13, color:"#888", marginBottom:8 }}>
        Each dot = one session. X = interval pace, Y = avg HR.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top:10, right:20, left:0, bottom:10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number" dataKey="x" name="pace"
            domain={[4.4, 5.5]} tickFormatter={fmtPace}
            tick={{ fontSize:11, fill:"#aaa" }}
            label={{ value:"Avg interval pace (min/km)", position:"insideBottom", offset:-4, fontSize:12, fill:"#aaa" }}
          />
          <YAxis
            type="number" dataKey="y" name="hr"
            domain={[130, 160]}
            tick={{ fontSize:11, fill:"#aaa" }}
            label={{ value:"Avg HR (bpm)", angle:-90, position:"insideLeft", offset:10, fontSize:12, fill:"#aaa" }}
          />
          <Tooltip content={<ScatterTooltip />} />
          {scatterBySeries.map(({ dur, color, label, points }) => (
            <Scatter key={dur} name={label} data={points} fill={color} opacity={0.85} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Manual legend */}
      <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
        {scatterBySeries.map(({ dur, color, label }) => (
          <div key={dur} style={{ display:"flex", alignItems:"center", gap:5, fontSize:13 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Per-duration summary bars */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:24 }}>
        {/* Pace bars */}
        <div style={{ background:"#f5f5f3", borderRadius:8, padding:"14px 16px" }}>
          <div style={{ fontWeight:500, fontSize:13, marginBottom:4 }}>Avg pace by duration</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:12 }}>faster = shorter interval</div>
          {durSummary.map(({ dur, avgPace }) => {
            const all = durSummary.map(d=>d.avgPace);
            const w = Math.round(((Math.max(...all) - avgPace) / (Math.max(...all) - Math.min(...all) + 0.01)) * 75 + 20);
            return (
              <div key={dur} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:32, fontSize:12, color:"#888", textAlign:"right" }}>{dur}m</div>
                <div style={{ flex:1, height:22, background:"#e8e8e5", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${w}%`, height:"100%", background:DUR_COLORS[dur]+"33", border:`1px solid ${DUR_COLORS[dur]}`, borderRadius:4, display:"flex", alignItems:"center", paddingLeft:8 }}>
                    <span style={{ fontSize:12, fontWeight:500, color:DUR_COLORS[dur] }}>{fmtPace(avgPace)}/km</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HR bars */}
        <div style={{ background:"#f5f5f3", borderRadius:8, padding:"14px 16px" }}>
          <div style={{ fontWeight:500, fontSize:13, marginBottom:4 }}>Avg HR by duration</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:12 }}>HR drift across interval lengths</div>
          {durSummary.map(({ dur, avgHR }) => {
            const all = durSummary.map(d=>d.avgHR);
            const w = Math.round(((avgHR - Math.min(...all)) / (Math.max(...all) - Math.min(...all) + 0.1)) * 75 + 20);
            return (
              <div key={dur} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:32, fontSize:12, color:"#888", textAlign:"right" }}>{dur}m</div>
                <div style={{ flex:1, height:22, background:"#e8e8e5", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${w}%`, height:"100%", background:DUR_COLORS[dur]+"33", border:`1px solid ${DUR_COLORS[dur]}`, borderRadius:4, display:"flex", alignItems:"center", paddingLeft:8 }}>
                    <span style={{ fontSize:12, fontWeight:500, color:DUR_COLORS[dur] }}>{Math.round(avgHR)} bpm</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session table */}
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, marginTop:20 }}>
        <thead>
          <tr style={{ borderBottom:"1px solid #e5e5e5" }}>
            {["Date","Type","Reps","Int. pace","Avg HR","Intensity"].map(h => (
              <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:"#aaa", fontWeight:400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...subData].sort((a,b)=>a.date.localeCompare(b.date)).map((d,i) => (
            <tr key={i} style={{ borderBottom:"1px solid #f0f0f0", background: d.intensity > 85 ? "#fff8f5" : "transparent" }}>
              <td style={{ padding:"6px 8px" }}>{d.date}</td>
              <td style={{ padding:"6px 8px" }}>
                <span style={{ background:DUR_COLORS[d.duration]+"22", color:DUR_COLORS[d.duration], border:`1px solid ${DUR_COLORS[d.duration]}55`, borderRadius:4, padding:"2px 7px", fontSize:11 }}>
                  {d.duration} min
                </span>
              </td>
              <td style={{ padding:"6px 8px" }}>{d.reps}×</td>
              <td style={{ padding:"6px 8px" }}>{fmtPace(d.intervalPace)}/km</td>
              <td style={{ padding:"6px 8px" }}>{d.avgHR} bpm</td>
              <td style={{ padding:"6px 8px", color: d.intensity > 85 ? "#D85A30" : "inherit" }}>{d.intensity.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Insight>
        <strong>Norwegian Singles pattern:</strong> HR drifts ~{Math.round(
          (subData.filter(d=>d.duration===12).reduce((s,d)=>s+d.avgHR,0)/subData.filter(d=>d.duration===12).length) -
          (subData.filter(d=>d.duration===3).reduce((s,d)=>s+d.avgHR,0)/subData.filter(d=>d.duration===3).length)
        )} bpm from 3-min to 12-min reps at similar intensity. The 2026-03-21 session
        (91% intensity, 153 bpm) is highlighted in orange — a likely fatigue or hot-day outlier.
      </Insight>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("easy");

  return (
    <div style={{
      maxWidth: 860, margin: "0 auto", padding: "32px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#111"
    }}>
      <h1 style={{ fontSize:22, fontWeight:500, marginBottom:4 }}>
        Training Dashboard
      </h1>
      <p style={{ fontSize:14, color:"#888", marginBottom:24 }}>
        Intervals.icu · Jul 2025 – Mar 2026
      </p>

      <div style={{ display:"flex", gap:8, marginBottom:28 }}>
        <Tab label="Morning Easy Runs"       active={tab==="easy"} onClick={()=>setTab("easy")} />
        <Tab label="Sub-Threshold Repeats"   active={tab==="sub"}  onClick={()=>setTab("sub")} />
      </div>

      {tab === "easy" ? <EasyPanel /> : <SubPanel />}
    </div>
  );
}