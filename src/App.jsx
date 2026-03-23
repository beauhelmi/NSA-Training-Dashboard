import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const TRAINING_START = new Date("2025-07-28");

const DUR_COLORS = {
  3:"#378ADD", 4:"#7B61D4", 6:"#639922", 7:"#5DAAAA",
  10:"#BA7517", 12:"#D85A30", 15:"#C7387A", 17:"#8B4513",
};
const DUR_LABELS = {
  3:"3 min", 4:"4 min", 6:"6 min", 7:"7 min",
  10:"10 min", 12:"12 min", 15:"15 min", 17:"17 min",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmtPace = (dec) => {
  if (!dec && dec !== 0) return "—";
  const m = Math.floor(dec);
  const s = Math.round((dec - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

function getWeekNum(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((d - TRAINING_START) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diff / 7) + 1);
}

function buildWeeklyData(allActivities) {
  const weeks = {};
  allActivities.forEach((a) => {
    const w = a.week || getWeekNum(a.date);
    if (!weeks[w]) {
      weeks[w] = { week: w, weekStart: a.date, runs: 0, totalKm: 0, hrSum: 0, paceSum: 0, paceCount: 0 };
    }
    weeks[w].runs++;
    weeks[w].totalKm += a.distance || 0;
    if (a.avgHR) weeks[w].hrSum += a.avgHR;
    if (a.pace)  { weeks[w].paceSum += a.pace; weeks[w].paceCount++; }
  });
  return Object.values(weeks)
    .sort((a, b) => a.week - b.week)
    .map((w) => ({
      week:      w.week,
      weekStart: w.weekStart,
      runs:      w.runs,
      totalKm:   Math.round(w.totalKm * 10) / 10,
      avgHR:     w.runs ? Math.round(w.hrSum / w.runs) : null,
      avgPace:   w.paceCount ? Math.round((w.paceSum / w.paceCount) * 1000) / 1000 : null,
    }));
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub }) {
  return (
    <div style={{ background:"#f5f5f3", borderRadius:8, padding:"12px 16px", flex:"1 1 0", minWidth:110 }}>
      <div style={{ fontSize:12, color:"#888", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:500 }}>{value ?? "—"}</div>
      {sub && <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function Insight({ children }) {
  return (
    <div style={{
      borderLeft:"3px solid #5DCAA5", borderRadius:"0 8px 8px 0",
      background:"#f5f5f3", padding:"10px 16px", marginTop:20,
      fontSize:13, color:"#555", lineHeight:1.6,
    }}>{children}</div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"8px 16px", borderRadius:8, border:"1px solid",
      borderColor: active ? "#333" : "#ddd",
      background: active ? "#f0f0ee" : "transparent",
      fontWeight: active ? 500 : 400, cursor:"pointer",
      fontSize:13, color: active ? "#111" : "#666",
    }}>{label}</button>
  );
}

// ── TOOLTIPS ──────────────────────────────────────────────────────────────────
function EasyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:8, padding:"10px 14px", fontSize:13 }}>
      <div style={{ fontWeight:500, marginBottom:4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color:p.color }}>
          {p.name === "pace" ? `Pace: ${fmtPace(p.value)}/km` : `HR: ${p.value} bpm`}
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
      <div style={{ fontWeight:500, marginBottom:4 }}>{d.date} · Wk {d.week}</div>
      <div>Pace: {fmtPace(d.x)}/km</div>
      <div>HR: {d.y} bpm <span style={{fontSize:11,color:"#aaa"}}>{d.workoutHR ? "workout only" : "session avg"}</span></div>
      {d.reps && <div>Reps: {d.reps}×</div>}
    </div>
  );
}

function WeeklyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:8, padding:"10px 14px", fontSize:13 }}>
      <div style={{ fontWeight:500, marginBottom:4 }}>Week {label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color:p.color }}>
          {p.name === "totalKm" ? `Volume: ${p.value} km`
           : p.name === "avgHR"  ? `Avg HR: ${p.value} bpm`
           : `Avg pace: ${fmtPace(p.value)}/km`}
        </div>
      ))}
    </div>
  );
}

// ── PANEL 1 — EASY RUNS ───────────────────────────────────────────────────────
function EasyPanel({ data }) {
  const [showHR, setShowHR]     = useState(true);
  const [showPace, setShowPace] = useState(true);

  if (!data.length) return <p style={{ color:"#aaa", fontSize:14 }}>No #easyRun activities found.</p>;

  const avgPace  = data.reduce((s, d) => s + (d.pace || 0), 0) / data.length;
  const avgHRAll = data.reduce((s, d) => s + (d.avgHR || 0), 0) / data.length;
  const half     = Math.floor(data.length / 2);
  const p1 = data.slice(0, half).reduce((s, d) => s + (d.pace || 0), 0) / half;
  const p2 = data.slice(half).reduce((s, d) => s + (d.pace || 0), 0) / (data.length - half);
  const paceGain = p1 - p2;

  const chartData = data.map((d) => ({ date: d.date.slice(5), pace: d.pace, hr: d.avgHR }));

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="Sessions"    value={data.length}               sub="#easyRun tagged" />
        <MetricCard label="Avg pace"    value={fmtPace(avgPace)}          sub="min/km overall" />
        <MetricCard label="Avg HR"      value={Math.round(avgHRAll)}      sub="bpm overall" />
        <MetricCard label="Pace gain"   value={`−${fmtPace(Math.abs(paceGain))}`} sub="faster in 2nd half" />
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#888" }}>Show:</span>
        <button onClick={() => setShowPace(v => !v)} style={{
          padding:"4px 12px", borderRadius:6, border:"1px solid #378ADD",
          background: showPace ? "#378ADD" : "transparent",
          color: showPace ? "#fff" : "#378ADD", cursor:"pointer", fontSize:13,
        }}>Pace</button>
        <button onClick={() => setShowHR(v => !v)} style={{
          padding:"4px 12px", borderRadius:6, border:"1px solid #D4537E",
          background: showHR ? "#D4537E" : "transparent",
          color: showHR ? "#fff" : "#D4537E", cursor:"pointer", fontSize:13,
        }}>Heart Rate</button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top:5, right:20, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize:11, fill:"#aaa" }} interval={Math.floor(data.length / 10)} />
          {showPace && (
            <YAxis yAxisId="pace" orientation="left" domain={[5.5, 8.5]} reversed
              tickFormatter={fmtPace} tick={{ fontSize:11, fill:"#378ADD" }}
              label={{ value:"pace (min/km)", angle:-90, position:"insideLeft", fill:"#378ADD", fontSize:11, dy:55 }} />
          )}
          {showHR && (
            <YAxis yAxisId="hr" orientation="right" domain={[110, 150]}
              tick={{ fontSize:11, fill:"#D4537E" }}
              label={{ value:"HR (bpm)", angle:90, position:"insideRight", fill:"#D4537E", fontSize:11, dy:-30 }} />
          )}
          <Tooltip content={<EasyTooltip />} />
          {showPace && <Line yAxisId="pace" type="monotone" dataKey="pace" name="pace"
            stroke="#378ADD" dot={{ r:2 }} activeDot={{ r:5 }} strokeWidth={1.5} connectNulls />}
          {showHR && <Line yAxisId="hr" type="monotone" dataKey="hr" name="hr"
            stroke="#D4537E" dot={{ r:2 }} activeDot={{ r:5 }} strokeWidth={1.5} connectNulls />}
        </LineChart>
      </ResponsiveContainer>

      <Insight>
        <strong>Aerobic base trend:</strong> {data.length} sessions tagged <code>#easyRun</code>.
        Pace improved ~{fmtPace(Math.abs(paceGain))}/km in the second half — aerobic efficiency growing.
      </Insight>
    </div>
  );
}

// ── PANEL 2 — SUB-THRESHOLD ───────────────────────────────────────────────────
function SubPanel({ data }) {
  const [filterDur, setFilterDur] = useState("all");

  if (!data.length) return <p style={{ color:"#aaa", fontSize:14 }}>No #subT activities found.</p>;

  const validData      = data.filter(d => d.intervalPace && d.avgHR);
  const activeDurations = [...new Set(validData.map(d => d.duration).filter(Boolean))].sort((a, b) => a - b);
  const filtered       = filterDur === "all" ? validData : validData.filter(d => d.duration === Number(filterDur));

  const allPaces  = validData.map(d => d.intervalPace);
  const avgHRAll  = validData.reduce((s, d) => s + (d.workoutHR ?? d.avgHR), 0) / validData.length;

  const durSummary = activeDurations.map(dur => {
    const g = validData.filter(d => d.duration === dur);
    return {
      dur,
      avgPace: g.reduce((s, d) => s + d.intervalPace, 0) / g.length,
      avgHR:   g.reduce((s, d) => s + d.avgHR, 0) / g.length,
      count:   g.length,
    };
  });

  const scatterBySeries = activeDurations.map(dur => ({
    dur, color: DUR_COLORS[dur] || "#888", label: DUR_LABELS[dur] || `${dur} min`,
    points: (filterDur === "all" || Number(filterDur) === dur)
      ? validData.filter(d => d.duration === dur)
          .map(d => ({ x: d.intervalPace, y: d.workoutHR ?? d.avgHR, date: d.date, week: d.week, reps: d.reps, workoutHR: d.workoutHR, avgHR: d.avgHR }))
      : [],
  })).filter(s => s.points.length > 0);

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="Sessions"      value={data.length}                    sub="#subT tagged" />
        <MetricCard label="Best rep pace" value={fmtPace(Math.min(...allPaces))} sub="min/km" />
        <MetricCard label="Avg HR"        value={Math.round(avgHRAll)}           sub="bpm all types" />
        <MetricCard label="Duration range" value={`${Math.min(...activeDurations)} – ${Math.max(...activeDurations)}`} sub="minute intervals" />
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#888" }}>Filter:</span>
        <button onClick={() => setFilterDur("all")} style={{
          padding:"3px 10px", borderRadius:6, fontSize:12,
          border:`1px solid ${filterDur === "all" ? "#333" : "#ddd"}`,
          background: filterDur === "all" ? "#f0f0ee" : "transparent",
          cursor:"pointer", fontWeight: filterDur === "all" ? 500 : 400,
        }}>All</button>
        {activeDurations.map(dur => (
          <button key={dur} onClick={() => setFilterDur(String(dur))} style={{
            padding:"3px 10px", borderRadius:6, fontSize:12,
            border:`1px solid ${filterDur === String(dur) ? DUR_COLORS[dur] : "#ddd"}`,
            background: filterDur === String(dur) ? DUR_COLORS[dur] + "22" : "transparent",
            color: filterDur === String(dur) ? DUR_COLORS[dur] : "#666", cursor:"pointer",
          }}>{DUR_LABELS[dur] || `${dur} min`}</button>
        ))}
      </div>
      <Insight>
        <strong>Tag-driven data:</strong> {data.length} sessions tagged <code>#subT</code> — all interval
        formats automatically grouped by duration. Use the filter buttons to isolate any duration.
      </Insight>
      <p style={{ fontSize:12, color:"#aaa", marginBottom:6 }}>Each dot = one session. Hover for details.</p>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top:10, right:20, left:0, bottom:20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" dataKey="x" name="pace" domain={[4.2, 5.6]} tickFormatter={fmtPace}
            tick={{ fontSize:11, fill:"#aaa" }}
            label={{ value:"Interval pace (min/km)", position:"insideBottom", offset:-12, fontSize:12, fill:"#aaa" }} />
          <YAxis type="number" dataKey="y" name="hr" domain={[125, 165]}
            tick={{ fontSize:11, fill:"#aaa" }}
            label={{ value:"Avg HR (bpm)", angle:-90, position:"insideLeft", offset:10, fontSize:12, fill:"#aaa" }} />
          <Tooltip content={<ScatterTooltip />} />
          {scatterBySeries.map(({ dur, color, points }) => (
            <Scatter key={dur} data={points} fill={color} opacity={0.85} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      <div style={{ display:"flex", gap:14, marginTop:6, flexWrap:"wrap" }}>
        {scatterBySeries.map(({ dur, color, label }) => (
          <div key={dur} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:color }} />{label}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:20 }}>
        <div style={{ background:"#f5f5f3", borderRadius:8, padding:"14px 16px" }}>
          <div style={{ fontWeight:500, fontSize:13, marginBottom:2 }}>Avg pace by duration</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:10 }}>faster = shorter interval</div>
          {durSummary.map(({ dur, avgPace }) => {
            const all = durSummary.map(d => d.avgPace);
            const w = Math.round(((Math.max(...all) - avgPace) / (Math.max(...all) - Math.min(...all) + 0.01)) * 75 + 20);
            return (
              <div key={dur} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                <div style={{ width:36, fontSize:11, color:"#888", textAlign:"right" }}>{DUR_LABELS[dur] || `${dur}m`}</div>
                <div style={{ flex:1, height:20, background:"#e8e8e5", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${w}%`, height:"100%", background: DUR_COLORS[dur] + "33",
                    border:`1px solid ${DUR_COLORS[dur]}`, borderRadius:4,
                    display:"flex", alignItems:"center", paddingLeft:6 }}>
                    <span style={{ fontSize:11, fontWeight:500, color:DUR_COLORS[dur] }}>{fmtPace(avgPace)}/km</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background:"#f5f5f3", borderRadius:8, padding:"14px 16px" }}>
          <div style={{ fontWeight:500, fontSize:13, marginBottom:2 }}>Avg HR by duration</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:10 }}>HR drift across lengths</div>
          {durSummary.map(({ dur, avgHR }) => {
            const all = durSummary.map(d => d.avgHR);
            const w = Math.round(((avgHR - Math.min(...all)) / (Math.max(...all) - Math.min(...all) + 0.1)) * 75 + 20);
            return (
              <div key={dur} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                <div style={{ width:36, fontSize:11, color:"#888", textAlign:"right" }}>{DUR_LABELS[dur] || `${dur}m`}</div>
                <div style={{ flex:1, height:20, background:"#e8e8e5", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${w}%`, height:"100%", background: DUR_COLORS[dur] + "33",
                    border:`1px solid ${DUR_COLORS[dur]}`, borderRadius:4,
                    display:"flex", alignItems:"center", paddingLeft:6 }}>
                    <span style={{ fontSize:11, fontWeight:500, color:DUR_COLORS[dur] }}>{Math.round(avgHR)} bpm</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ overflowX:"auto", marginTop:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #e5e5e5" }}>
              {["Wk","Date","Duration","Reps","Int. pace","Avg HR","Intensity"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:"#aaa", fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={i} style={{ borderBottom:"1px solid #f0f0f0", background: d.intensity > 88 ? "#fff8f5" : "transparent" }}>
                <td style={{ padding:"5px 8px", color:"#aaa", fontWeight:500 }}>W{d.week}</td>
                <td style={{ padding:"5px 8px" }}>{d.date}</td>
                <td style={{ padding:"5px 8px" }}>
                  <span style={{
                    background: (DUR_COLORS[d.duration] || "#888") + "22",
                    color: DUR_COLORS[d.duration] || "#888",
                    border: `1px solid ${(DUR_COLORS[d.duration] || "#888")}55`,
                    borderRadius:4, padding:"1px 7px", fontSize:11,
                  }}>{DUR_LABELS[d.duration] || `${d.duration} min`}</span>
                </td>
                <td style={{ padding:"5px 8px" }}>{d.reps ? `${d.reps}×` : "—"}</td>
                <td style={{ padding:"5px 8px" }}>{fmtPace(d.intervalPace)}/km</td>
                <td style={{ padding:"5px 8px" }}>
                  {d.workoutHR ?? d.avgHR} bpm
                  {d.workoutHR && d.workoutHR !== d.avgHR &&
                    <span style={{ fontSize:10, color:"#aaa", marginLeft:4 }}>(session: {d.avgHR})</span>
                  }
                </td>
                <td style={{ padding:"5px 8px", color: d.intensity > 88 ? "#D85A30" : "inherit" }}>
                  {d.intensity ? d.intensity.toFixed(1) + "%" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
  );
}

// ── PANEL 3 — WEEKLY PROGRESS ─────────────────────────────────────────────────
function WeeklyPanel({ weeklyData }) {
  const [metric, setMetric] = useState("totalKm");

  if (!weeklyData.length) return <p style={{ color:"#aaa", fontSize:14 }}>No data yet.</p>;

  const metricConfig = {
    totalKm: { label:"Weekly volume (km)", color:"#378ADD" },
    avgHR:   { label:"Avg HR (bpm)",       color:"#D4537E" },
    avgPace: { label:"Avg pace (min/km)",  color:"#639922" },
  };
  const cfg = metricConfig[metric];

  const totalKmAll  = weeklyData.reduce((s, d) => s + d.totalKm, 0);
  const peakWeek    = weeklyData.reduce((a, b) => a.totalKm > b.totalKm ? a : b);
  const avgRuns     = (weeklyData.reduce((s, d) => s + d.runs, 0) / weeklyData.length).toFixed(1);
  const validPace   = weeklyData.filter(d => d.avgPace);
  const bestPaceWk  = validPace.length ? validPace.reduce((a, b) => a.avgPace < b.avgPace ? a : b) : null;

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="Total distance"   value={`${totalKmAll.toFixed(0)} km`} sub={`${weeklyData.length} weeks`} />
        <MetricCard label="Peak week"        value={`${peakWeek.totalKm} km`}      sub={`Wk ${peakWeek.week} · ${peakWeek.weekStart}`} />
        <MetricCard label="Avg runs/week"    value={avgRuns}                        sub="sessions per week" />
        <MetricCard label="Best avg pace wk" value={bestPaceWk ? `Wk ${bestPaceWk.week}` : "—"} sub={bestPaceWk ? `${fmtPace(bestPaceWk.avgPace)}/km avg` : ""} />
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center" }}>
        <span style={{ fontSize:13, color:"#888" }}>View:</span>
        {Object.entries(metricConfig).map(([key, c]) => (
          <button key={key} onClick={() => setMetric(key)} style={{
            padding:"4px 12px", borderRadius:6, fontSize:13,
            border:`1px solid ${metric === key ? c.color : "#ddd"}`,
            background: metric === key ? c.color + "22" : "transparent",
            color: metric === key ? c.color : "#666", cursor:"pointer",
            fontWeight: metric === key ? 500 : 400,
          }}>{key === "totalKm" ? "Volume" : key === "avgHR" ? "Avg HR" : "Avg Pace"}</button>
        ))}
      </div>
      <Insight>
        <strong>{weeklyData.length} weeks of training:</strong> You covered {totalKmAll.toFixed(0)} km
        total, peaking at {peakWeek.totalKm} km in Week {peakWeek.week} ({peakWeek.weekStart}).
        {(() => {
          const low = weeklyData.filter(w => w.totalKm < 30);
          const lowest = low.length ? low.reduce((a,b) => a.totalKm < b.totalKm ? a : b) : null;
          const rampWeek = weeklyData.find(w => w.week > (lowest?.week || 0) && w.totalKm > 45);
          return lowest ? ` Week ${lowest.week} was your lowest volume week at ${lowest.totalKm} km${
            rampWeek ? `, before ramping back up from Week ${rampWeek.week} onwards` : ""
          }.` : "";
        })()}
        {" "}Avg {avgRuns} runs per week across the full block.
      </Insight>  
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={weeklyData} margin={{ top:5, right:20, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize:10, fill:"#aaa" }} tickFormatter={v => `W${v}`} interval={3} />
          <YAxis tick={{ fontSize:11, fill:"#aaa" }}
            tickFormatter={metric === "avgPace" ? fmtPace : undefined}
            reversed={metric === "avgPace"} />
          <Tooltip content={<WeeklyTooltip />} />
          <Bar dataKey={metric} fill={cfg.color} radius={[3, 3, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ overflowX:"auto", marginTop:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #e5e5e5" }}>
              {["Week","Start date","Runs","Volume (km)","Avg HR","Avg pace"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:"#aaa", fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((d, i) => (
              <tr key={i} style={{ borderBottom:"1px solid #f0f0f0",
                background: d.totalKm === peakWeek.totalKm ? "#f0f8ff" : "transparent" }}>
                <td style={{ padding:"5px 8px", fontWeight:500 }}>W{d.week}</td>
                <td style={{ padding:"5px 8px", color:"#888" }}>{d.weekStart}</td>
                <td style={{ padding:"5px 8px" }}>{d.runs}</td>
                <td style={{ padding:"5px 8px", fontWeight: d.totalKm === peakWeek.totalKm ? 500 : 400,
                  color: d.totalKm === peakWeek.totalKm ? "#378ADD" : "inherit" }}>{d.totalKm}</td>
                <td style={{ padding:"5px 8px" }}>{d.avgHR ?? "—"}</td>
                <td style={{ padding:"5px 8px" }}>{d.avgPace ? fmtPace(d.avgPace) + "/km" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState("easy");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then(r => {
        if (!r.ok) throw new Error("data.json not found — run fetch_data.py first");
        return r.json();
      })
      .then(data => {
        setAllData(data);
        // Find most recent date in data
        const dates = data.map(d => d.date).sort();
        if (dates.length) setLastUpdated(dates[dates.length - 1]);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ padding:40, fontFamily:"sans-serif", color:"#888" }}>Loading data.json…</div>
  );

  if (error) return (
    <div style={{ padding:40, fontFamily:"sans-serif" }}>
      <h2 style={{ color:"#D85A30", fontSize:18, marginBottom:12 }}>⚠ Data not loaded</h2>
      <p style={{ color:"#555", fontSize:14, marginBottom:16 }}>{error}</p>
      <pre style={{ background:"#f5f5f3", padding:16, borderRadius:8, fontSize:12 }}>
        {`# Run this in your project folder:\npython fetch_data.py`}
      </pre>
    </div>
  );

  // ── Filter by tag ─────────────────────────────────────────────────────────
  const easyData   = allData.filter(a => Array.isArray(a.tags) && a.tags.includes("easy runs"));
  const subData    = allData.filter(a => Array.isArray(a.tags) && a.tags.includes("SubT"));
  const weeklyData = buildWeeklyData(allData.filter(a => a.distance > 0));

  return (
    <div style={{
      maxWidth:880, margin:"0 auto", padding:"32px 20px",
      fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color:"#111",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
        <h1 style={{ fontSize:22, fontWeight:500 }}>Beau NSA Dashboard</h1>
        {lastUpdated && (
          <span style={{ fontSize:12, color:"#aaa", marginTop:6 }}>
            Updated to {lastUpdated}
          </span>
        )}
      </div>
      <p style={{ fontSize:14, color:"#888", marginBottom:24 }}>
        Intervals.icu · {allData.length} activities · {weeklyData.length} weeks
      </p>

      <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
        <TabBtn label="Easy Runs"     active={tab === "easy"}   onClick={() => setTab("easy")} />
        <TabBtn label="Sub-Threshold" active={tab === "sub"}    onClick={() => setTab("sub")} />
        <TabBtn label="Weekly Progress"       active={tab === "weekly"} onClick={() => setTab("weekly")} />
      </div>

      {tab === "easy"   && <EasyPanel   data={easyData} />}
      {tab === "sub"    && <SubPanel    data={subData} />}
      {tab === "weekly" && <WeeklyPanel weeklyData={weeklyData} />}
    </div>
  );
}