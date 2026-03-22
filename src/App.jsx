import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const TRAINING_START = new Date("2025-07-28");

const easyData = [
  {date:"2025-07-28",avgHR:126,pace:7.105},{date:"2025-07-29",avgHR:124,pace:7.012},
  {date:"2025-08-15",avgHR:122,pace:6.348},{date:"2025-08-18",avgHR:119,pace:7.337},
  {date:"2025-08-22",avgHR:125,pace:6.894},{date:"2025-08-24",avgHR:129,pace:7.005},
  {date:"2025-08-25",avgHR:129,pace:6.705},{date:"2025-08-27",avgHR:122,pace:7.662},
  {date:"2025-08-29",avgHR:129,pace:6.651},{date:"2025-08-31",avgHR:129,pace:7.057},
  {date:"2025-09-07",avgHR:130,pace:6.890},{date:"2025-09-08",avgHR:130,pace:6.854},
  {date:"2025-09-12",avgHR:129,pace:6.491},{date:"2025-09-14",avgHR:141,pace:6.373},
  {date:"2025-09-22",avgHR:125,pace:7.048},{date:"2025-09-23",avgHR:125,pace:6.542},
  {date:"2025-09-25",avgHR:131,pace:6.559},{date:"2025-09-27",avgHR:125,pace:6.986},
  {date:"2025-09-29",avgHR:126,pace:6.742},{date:"2025-10-02",avgHR:124,pace:6.378},
  {date:"2025-10-04",avgHR:135,pace:6.795},{date:"2025-10-05",avgHR:119,pace:7.159},
  {date:"2025-10-07",avgHR:127,pace:6.706},{date:"2025-10-08",avgHR:122,pace:7.625},
  {date:"2025-10-09",avgHR:122,pace:6.718},{date:"2025-10-11",avgHR:124,pace:6.669},
  {date:"2025-10-13",avgHR:130,pace:6.602},{date:"2025-10-14",avgHR:126,pace:6.888},
  {date:"2025-10-15",avgHR:130,pace:6.535},{date:"2025-10-16",avgHR:126,pace:6.834},
  {date:"2025-10-18",avgHR:130,pace:6.477},{date:"2025-10-19",avgHR:126,pace:7.014},
  {date:"2025-10-20",avgHR:128,pace:6.678},{date:"2025-10-22",avgHR:130,pace:6.530},
  {date:"2025-10-23",avgHR:128,pace:6.764},{date:"2025-10-25",avgHR:130,pace:6.489},
  {date:"2025-10-27",avgHR:128,pace:6.752},{date:"2025-10-29",avgHR:130,pace:6.599},
  {date:"2025-10-30",avgHR:125,pace:6.854},{date:"2025-11-01",avgHR:128,pace:6.673},
  {date:"2025-11-03",avgHR:128,pace:6.572},{date:"2025-11-05",avgHR:128,pace:6.651},
  {date:"2025-11-06",avgHR:130,pace:6.488},{date:"2025-11-08",avgHR:128,pace:6.558},
  {date:"2025-11-10",avgHR:128,pace:6.556},{date:"2025-11-12",avgHR:128,pace:6.533},
  {date:"2025-11-13",avgHR:126,pace:6.652},{date:"2025-11-15",avgHR:126,pace:6.602},
  {date:"2025-11-17",avgHR:130,pace:6.554},{date:"2025-11-19",avgHR:128,pace:6.469},
  {date:"2025-11-20",avgHR:126,pace:6.631},{date:"2025-11-22",avgHR:128,pace:6.531},
  {date:"2025-11-24",avgHR:130,pace:6.586},{date:"2025-11-26",avgHR:130,pace:6.476},
  {date:"2025-11-28",avgHR:128,pace:6.484},{date:"2025-12-01",avgHR:126,pace:6.685},
  {date:"2025-12-03",avgHR:126,pace:6.561},{date:"2025-12-05",avgHR:126,pace:6.657},
  {date:"2025-12-06",avgHR:126,pace:6.498},{date:"2025-12-08",avgHR:126,pace:6.568},
  {date:"2025-12-10",avgHR:126,pace:6.619},{date:"2025-12-12",avgHR:125,pace:6.573},
  {date:"2025-12-14",avgHR:124,pace:6.575},{date:"2025-12-15",avgHR:124,pace:6.574},
  {date:"2025-12-17",avgHR:124,pace:6.566},{date:"2025-12-19",avgHR:124,pace:6.507},
  {date:"2025-12-21",avgHR:124,pace:6.610},{date:"2025-12-22",avgHR:124,pace:6.508},
  {date:"2025-12-24",avgHR:122,pace:6.595},{date:"2025-12-26",avgHR:122,pace:6.473},
  {date:"2025-12-28",avgHR:122,pace:6.541},{date:"2025-12-29",avgHR:122,pace:6.454},
  {date:"2025-12-31",avgHR:122,pace:6.416},{date:"2026-01-02",avgHR:120,pace:6.520},
  {date:"2026-01-04",avgHR:120,pace:6.421},
];

const subData = [
  {date:"2025-07-30",week:1, duration:10,reps:3, avgHR:152,intervalPace:5.444,intensity:80.0},
  {date:"2025-08-02",week:1, duration:6, reps:4, avgHR:146,intervalPace:5.258,intensity:84.6},
  {date:"2025-08-05",week:2, duration:3, reps:8, avgHR:143,intervalPace:5.073,intensity:84.3},
  {date:"2025-08-07",week:2, duration:10,reps:2, avgHR:136,intervalPace:5.250,intensity:79.1},
  {date:"2025-08-09",week:2, duration:6, reps:4, avgHR:137,intervalPace:5.229,intensity:83.1},
  {date:"2025-08-12",week:3, duration:12,reps:2, avgHR:143,intervalPace:5.392,intensity:80.3},
  {date:"2025-08-14",week:3, duration:6, reps:4, avgHR:141,intervalPace:5.050,intensity:81.5},
  {date:"2025-08-16",week:3, duration:3, reps:8, avgHR:141,intervalPace:4.950,intensity:82.6},
  {date:"2025-08-26",week:5, duration:3, reps:8, avgHR:145,intervalPace:4.785,intensity:84.6},
  {date:"2025-08-28",week:5, duration:6, reps:4, avgHR:152,intervalPace:5.004,intensity:82.5},
  {date:"2025-08-30",week:5, duration:12,reps:2, avgHR:147,intervalPace:5.150,intensity:80.3},
  {date:"2025-09-06",week:6, duration:10,reps:3, avgHR:154,intervalPace:5.200,intensity:82.2},
  {date:"2025-09-09",week:7, duration:7, reps:4, avgHR:147,intervalPace:5.075,intensity:85.2},
  {date:"2025-09-11",week:7, duration:7, reps:4, avgHR:149,intervalPace:5.112,intensity:84.9},
  {date:"2025-09-24",week:9, duration:4, reps:8, avgHR:158,intervalPace:4.800,intensity:92.6},
  {date:"2025-09-26",week:9, duration:6, reps:5, avgHR:147,intervalPace:4.993,intensity:86.2},
  {date:"2025-09-28",week:9, duration:12,reps:3, avgHR:147,intervalPace:5.100,intensity:85.2},
  {date:"2025-09-30",week:10,duration:6, reps:4, avgHR:149,intervalPace:4.929,intensity:86.5},
  {date:"2025-10-09",week:11,duration:3, reps:8, avgHR:146,intervalPace:4.702,intensity:88.8},
  {date:"2025-10-11",week:11,duration:6, reps:5, avgHR:148,intervalPace:4.920,intensity:85.8},
  {date:"2025-10-14",week:12,duration:3, reps:10,avgHR:154,intervalPace:5.179,intensity:80.0},
  {date:"2025-10-17",week:12,duration:6, reps:5, avgHR:143,intervalPace:4.997,intensity:86.7},
  {date:"2025-10-19",week:12,duration:10,reps:3, avgHR:144,intervalPace:5.128,intensity:85.8},
  {date:"2025-10-21",week:13,duration:3, reps:10,avgHR:147,intervalPace:4.787,intensity:90.0},
  {date:"2025-10-23",week:13,duration:6, reps:5, avgHR:141,intervalPace:4.953,intensity:86.7},
  {date:"2025-10-25",week:13,duration:3, reps:10,avgHR:142,intervalPace:5.039,intensity:85.8},
  {date:"2025-10-28",week:14,duration:3, reps:10,avgHR:156,intervalPace:4.592,intensity:90.9},
  {date:"2025-10-30",week:14,duration:6, reps:5, avgHR:149,intervalPace:4.950,intensity:84.8},
  {date:"2025-11-01",week:14,duration:10,reps:3, avgHR:149,intervalPace:5.261,intensity:82.4},
  {date:"2025-11-04",week:15,duration:3, reps:10,avgHR:143,intervalPace:4.681,intensity:90.3},
  {date:"2025-11-06",week:15,duration:6, reps:5, avgHR:149,intervalPace:4.770,intensity:88.2},
  {date:"2025-11-08",week:15,duration:10,reps:3, avgHR:141,intervalPace:5.183,intensity:82.4},
  {date:"2025-11-11",week:16,duration:3, reps:10,avgHR:149,intervalPace:4.560,intensity:90.9},
  {date:"2025-11-13",week:16,duration:6, reps:5, avgHR:147,intervalPace:4.970,intensity:87.3},
  {date:"2025-11-18",week:17,duration:3, reps:5, avgHR:136,intervalPace:4.680,intensity:87.9},
  {date:"2025-11-20",week:17,duration:4, reps:3, avgHR:134,intervalPace:4.844,intensity:83.0},
  {date:"2025-12-02",week:19,duration:10,reps:3, avgHR:152,intervalPace:4.961,intensity:82.7},
  {date:"2025-12-04",week:19,duration:3, reps:8, avgHR:148,intervalPace:4.533,intensity:82.7},
  {date:"2025-12-09",week:20,duration:6, reps:3, avgHR:144,intervalPace:5.000,intensity:88.2},
  {date:"2025-12-11",week:20,duration:4, reps:2, avgHR:138,intervalPace:4.533,intensity:75.2},
  {date:"2025-12-16",week:21,duration:3, reps:10,avgHR:140,intervalPace:4.877,intensity:79.9},
  {date:"2025-12-18",week:21,duration:6, reps:5, avgHR:143,intervalPace:5.067,intensity:81.2},
  {date:"2026-01-06",week:24,duration:10,reps:3, avgHR:151,intervalPace:5.289,intensity:77.0},
  {date:"2026-01-08",week:24,duration:6, reps:4, avgHR:142,intervalPace:5.044,intensity:77.6},
  {date:"2026-01-10",week:24,duration:3, reps:8, avgHR:144,intervalPace:4.721,intensity:80.8},
  {date:"2026-01-13",week:25,duration:3, reps:8, avgHR:145,intervalPace:4.792,intensity:78.2},
  {date:"2026-01-16",week:25,duration:6, reps:4, avgHR:139,intervalPace:4.938,intensity:76.5},
  {date:"2026-01-18",week:25,duration:15,reps:2, avgHR:145,intervalPace:5.300,intensity:73.5},
  {date:"2026-01-20",week:26,duration:10,reps:3, avgHR:146,intervalPace:5.039,intensity:81.7},
  {date:"2026-01-22",week:26,duration:10,reps:2, avgHR:140,intervalPace:5.117,intensity:77.4},
  {date:"2026-01-24",week:26,duration:15,reps:3, avgHR:147,intervalPace:5.228,intensity:76.0},
  {date:"2026-01-28",week:27,duration:3, reps:10,avgHR:153,intervalPace:4.647,intensity:82.5},
  {date:"2026-01-31",week:27,duration:17,reps:3, avgHR:148,intervalPace:5.211,intensity:76.4},
  {date:"2026-02-03",week:28,duration:10,reps:2, avgHR:142,intervalPace:5.150,intensity:78.6},
  {date:"2026-02-05",week:28,duration:3, reps:4, avgHR:141,intervalPace:4.487,intensity:80.2},
  {date:"2026-02-13",week:29,duration:3, reps:9, avgHR:144,intervalPace:4.911,intensity:78.2},
  {date:"2026-02-16",week:30,duration:10,reps:3, avgHR:143,intervalPace:5.178,intensity:80.5},
  {date:"2026-02-18",week:30,duration:6, reps:5, avgHR:146,intervalPace:5.080,intensity:78.6},
  {date:"2026-02-20",week:30,duration:3, reps:9, avgHR:144,intervalPace:4.744,intensity:80.5},
  {date:"2026-02-23",week:31,duration:10,reps:3, avgHR:140,intervalPace:5.156,intensity:79.0},
  {date:"2026-03-03",week:32,duration:3, reps:8, avgHR:138,intervalPace:4.985,intensity:77.5},
  {date:"2026-03-05",week:32,duration:6, reps:4, avgHR:140,intervalPace:5.000,intensity:76.7},
  {date:"2026-03-10",week:33,duration:6, reps:4, avgHR:142,intervalPace:5.008,intensity:77.9},
  {date:"2026-03-12",week:33,duration:12,reps:2, avgHR:144,intervalPace:5.008,intensity:80.4},
  {date:"2026-03-17",week:34,duration:6, reps:4, avgHR:143,intervalPace:4.963,intensity:76.7},
  {date:"2026-03-19",week:34,duration:12,reps:2, avgHR:144,intervalPace:5.017,intensity:77.9},
  {date:"2026-03-21",week:34,duration:3, reps:8, avgHR:153,intervalPace:4.647,intensity:91.0},
];

const weeklyData = [
  {week:1,weekStart:"2025-07-28",runs:8,totalKm:54.8,avgHR:133.9,avgPace:6.793},
  {week:2,weekStart:"2025-08-04",runs:7,totalKm:57.0,avgHR:131.0,avgPace:6.672},
  {week:3,weekStart:"2025-08-11",runs:7,totalKm:53.6,avgHR:134.4,avgPace:6.463},
  {week:4,weekStart:"2025-08-18",runs:9,totalKm:66.4,avgHR:127.3,avgPace:6.873},
  {week:5,weekStart:"2025-08-25",runs:8,totalKm:63.0,avgHR:135.8,avgPace:6.495},
  {week:6,weekStart:"2025-09-01",runs:6,totalKm:52.8,avgHR:138.0,avgPace:6.318},
  {week:7,weekStart:"2025-09-08",runs:8,totalKm:59.6,avgHR:137.5,avgPace:6.395},
  {week:8,weekStart:"2025-09-15",runs:11,totalKm:38.4,avgHR:134.8,avgPace:7.162},
  {week:9,weekStart:"2025-09-22",runs:7,totalKm:64.0,avgHR:136.9,avgPace:6.329},
  {week:10,weekStart:"2025-09-29",runs:9,totalKm:51.5,avgHR:134.3,avgPace:6.967},
  {week:11,weekStart:"2025-10-06",runs:6,totalKm:53.1,avgHR:133.2,avgPace:6.629},
  {week:12,weekStart:"2025-10-13",runs:7,totalKm:58.4,avgHR:135.9,avgPace:6.346},
  {week:13,weekStart:"2025-10-20",runs:7,totalKm:65.4,avgHR:133.0,avgPace:6.488},
  {week:14,weekStart:"2025-10-27",runs:7,totalKm:64.7,avgHR:135.9,avgPace:6.769},
  {week:15,weekStart:"2025-11-03",runs:7,totalKm:62.7,avgHR:134.0,avgPace:6.423},
  {week:16,weekStart:"2025-11-10",runs:7,totalKm:68.6,avgHR:137.6,avgPace:6.467},
  {week:17,weekStart:"2025-11-17",runs:7,totalKm:45.2,avgHR:130.1,avgPace:6.509},
  {week:18,weekStart:"2025-11-25",runs:9,totalKm:58.7,avgHR:130.2,avgPace:5.785},
  {week:19,weekStart:"2025-12-01",runs:8,totalKm:56.2,avgHR:135.1,avgPace:6.348},
  {week:20,weekStart:"2025-12-08",runs:9,totalKm:45.0,avgHR:139.7,avgPace:6.400},
  {week:21,weekStart:"2025-12-15",runs:4,totalKm:35.1,avgHR:133.2,avgPace:6.381},
  {week:22,weekStart:"2025-12-24",runs:5,totalKm:24.9,avgHR:124.4,avgPace:6.850},
  {week:23,weekStart:"2025-12-29",runs:6,totalKm:33.2,avgHR:141.3,avgPace:6.294},
  {week:24,weekStart:"2026-01-05",runs:6,totalKm:56.1,avgHR:138.8,avgPace:6.499},
  {week:25,weekStart:"2026-01-12",runs:7,totalKm:54.8,avgHR:134.1,avgPace:6.662},
  {week:26,weekStart:"2026-01-20",runs:5,totalKm:53.0,avgHR:138.2,avgPace:6.442},
  {week:27,weekStart:"2026-01-27",runs:5,totalKm:54.6,avgHR:139.0,avgPace:6.412},
  {week:28,weekStart:"2026-02-03",runs:6,totalKm:38.4,avgHR:146.7,avgPace:5.992},
  {week:29,weekStart:"2026-02-10",runs:7,totalKm:46.5,avgHR:129.0,avgPace:6.889},
  {week:30,weekStart:"2026-02-16",runs:7,totalKm:57.4,avgHR:137.0,avgPace:6.337},
  {week:31,weekStart:"2026-02-23",runs:3,totalKm:25.3,avgHR:132.7,avgPace:6.589},
  {week:32,weekStart:"2026-03-03",runs:5,totalKm:37.5,avgHR:134.6,avgPace:6.397},
  {week:33,weekStart:"2026-03-10",runs:4,totalKm:33.4,avgHR:138.5,avgPace:6.236},
  {week:34,weekStart:"2026-03-16",runs:7,totalKm:54.2,avgHR:136.7,avgPace:6.327},
  {week:35,weekStart:"2026-03-23",runs:1,totalKm:7.0,avgHR:129.0,avgPace:6.455},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmtPace = (dec) => {
  if (!dec && dec !== 0) return "—";
  const m = Math.floor(dec);
  const s = Math.round((dec - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const DUR_COLORS = {
  3:"#378ADD",4:"#7B61D4",6:"#639922",7:"#5DAAAA",
  10:"#BA7517",12:"#D85A30",15:"#C7387A",17:"#8B4513"
};
const DUR_LABELS = {
  3:"3 min",4:"4 min",6:"6 min",7:"7 min",
  10:"10 min",12:"12 min",15:"15 min",17:"17 min"
};

const activeDurations = [...new Set(subData.map(d=>d.duration))].sort((a,b)=>a-b);

const scatterBySeries = activeDurations.map((dur) => ({
  dur, color:DUR_COLORS[dur]||"#888", label:DUR_LABELS[dur]||`${dur} min`,
  points: subData.filter(d=>d.duration===dur)
    .map(d=>({x:d.intervalPace,y:d.avgHR,date:d.date,week:d.week,reps:d.reps})),
}));

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function MetricCard({label,value,sub}) {
  return (
    <div style={{background:"#f5f5f3",borderRadius:8,padding:"12px 16px",flex:"1 1 0",minWidth:110}}>
      <div style={{fontSize:12,color:"#888",marginBottom:4}}>{label}</div>
      <div style={{fontSize:20,fontWeight:500}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{sub}</div>}
    </div>
  );
}
function Insight({children}) {
  return (
    <div style={{borderLeft:"3px solid #5DCAA5",borderRadius:"0 8px 8px 0",
      background:"#f5f5f3",padding:"10px 16px",marginTop:20,fontSize:13,color:"#555",lineHeight:1.6}}>
      {children}
    </div>
  );
}
function Tab({label,active,onClick}) {
  return (
    <button onClick={onClick} style={{
      padding:"8px 16px",borderRadius:8,border:"1px solid",
      borderColor:active?"#333":"#ddd",background:active?"#f0f0ee":"transparent",
      fontWeight:active?500:400,cursor:"pointer",fontSize:13,color:active?"#111":"#666"
    }}>{label}</button>
  );
}
function EasyTooltip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:8,padding:"10px 14px",fontSize:13}}>
      <div style={{fontWeight:500,marginBottom:4}}>{label}</div>
      {payload.map(p=>(
        <div key={p.name} style={{color:p.color}}>
          {p.name==="pace"?`Pace: ${fmtPace(p.value)}/km`:`HR: ${p.value} bpm`}
        </div>
      ))}
    </div>
  );
}
function ScatterTooltip({active,payload}) {
  if(!active||!payload?.length) return null;
  const d=payload[0]?.payload;
  if(!d) return null;
  return (
    <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:8,padding:"10px 14px",fontSize:13}}>
      <div style={{fontWeight:500,marginBottom:4}}>{d.date} · Wk {d.week}</div>
      <div>Pace: {fmtPace(d.x)}/km</div>
      <div>HR: {d.y} bpm</div>
      {d.reps&&<div>Reps: {d.reps}×</div>}
    </div>
  );
}
function WeeklyTooltip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:8,padding:"10px 14px",fontSize:13}}>
      <div style={{fontWeight:500,marginBottom:4}}>Week {label}</div>
      {payload.map(p=>(
        <div key={p.name} style={{color:p.color}}>
          {p.name==="totalKm"?`Volume: ${p.value} km`
           :p.name==="avgHR"?`Avg HR: ${p.value} bpm`
           :`Avg pace: ${fmtPace(p.value)}/km`}
        </div>
      ))}
    </div>
  );
}

// ── PANEL 1 — EASY RUNS ───────────────────────────────────────────────────────
function EasyPanel() {
  const [showHR,setShowHR]=useState(true);
  const [showPace,setShowPace]=useState(true);
  const avgPace=easyData.reduce((s,d)=>s+d.pace,0)/easyData.length;
  const avgHRAll=easyData.reduce((s,d)=>s+d.avgHR,0)/easyData.length;
  const half=Math.floor(easyData.length/2);
  const p1=easyData.slice(0,half).reduce((s,d)=>s+d.pace,0)/half;
  const p2=easyData.slice(half).reduce((s,d)=>s+d.pace,0)/(easyData.length-half);
  const chartData=easyData.map(d=>({date:d.date.slice(5),pace:d.pace,hr:d.avgHR}));
  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <MetricCard label="Total sessions" value={easyData.length} sub="morning easy runs"/>
        <MetricCard label="Avg pace" value={fmtPace(avgPace)} sub="min/km overall"/>
        <MetricCard label="Avg heart rate" value={Math.round(avgHRAll)} sub="bpm overall"/>
        <MetricCard label="Pace gain" value={`−${fmtPace(Math.abs(p1-p2))}`} sub="faster in 2nd half"/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:13,color:"#888"}}>Show:</span>
        <button onClick={()=>setShowPace(v=>!v)} style={{padding:"4px 12px",borderRadius:6,
          border:"1px solid #378ADD",background:showPace?"#378ADD":"transparent",
          color:showPace?"#fff":"#378ADD",cursor:"pointer",fontSize:13}}>Pace</button>
        <button onClick={()=>setShowHR(v=>!v)} style={{padding:"4px 12px",borderRadius:6,
          border:"1px solid #D4537E",background:showHR?"#D4537E":"transparent",
          color:showHR?"#fff":"#D4537E",cursor:"pointer",fontSize:13}}>Heart Rate</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{top:5,right:20,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
          <XAxis dataKey="date" tick={{fontSize:11,fill:"#aaa"}} interval={6}/>
          {showPace&&<YAxis yAxisId="pace" orientation="left" domain={[5.5,8.5]} reversed
            tickFormatter={fmtPace} tick={{fontSize:11,fill:"#378ADD"}}
            label={{value:"pace (min/km)",angle:-90,position:"insideLeft",fill:"#378ADD",fontSize:11,dy:55}}/>}
          {showHR&&<YAxis yAxisId="hr" orientation="right" domain={[110,150]}
            tick={{fontSize:11,fill:"#D4537E"}}
            label={{value:"HR (bpm)",angle:90,position:"insideRight",fill:"#D4537E",fontSize:11,dy:-30}}/>}
          <Tooltip content={<EasyTooltip/>}/>
          {showPace&&<Line yAxisId="pace" type="monotone" dataKey="pace" name="pace"
            stroke="#378ADD" dot={{r:2}} activeDot={{r:5}} strokeWidth={1.5} connectNulls/>}
          {showHR&&<Line yAxisId="hr" type="monotone" dataKey="hr" name="hr"
            stroke="#D4537E" dot={{r:2}} activeDot={{r:5}} strokeWidth={1.5} connectNulls/>}
        </LineChart>
      </ResponsiveContainer>
      <Insight><strong>Aerobic base trend:</strong> Over ~8 months your pace improved by ~{fmtPace(Math.abs(p1-p2))}/km
        in the second half of your log while HR stayed stable — clear sign of growing aerobic efficiency.</Insight>
    </div>
  );
}

// ── PANEL 2 — SUB-THRESHOLD ───────────────────────────────────────────────────
function SubPanel() {
  const [filterDur,setFilterDur]=useState("all");
  const filtered=filterDur==="all"?subData:subData.filter(d=>d.duration===Number(filterDur));
  const allPaces=subData.map(d=>d.intervalPace);
  const avgHRAll=subData.reduce((s,d)=>s+d.avgHR,0)/subData.length;
  const durSummary=activeDurations.map(dur=>{
    const g=subData.filter(d=>d.duration===dur);
    return {dur,avgPace:g.reduce((s,d)=>s+d.intervalPace,0)/g.length,
      avgHR:g.reduce((s,d)=>s+d.avgHR,0)/g.length,count:g.length};
  });
  const scatterFiltered=filterDur==="all"?scatterBySeries:scatterBySeries.filter(s=>s.dur===Number(filterDur));
  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <MetricCard label="Total sessions" value={subData.length} sub="from Week 1"/>
        <MetricCard label="Best rep pace" value={fmtPace(Math.min(...allPaces))} sub="min/km"/>
        <MetricCard label="Avg session HR" value={Math.round(avgHRAll)} sub="bpm all types"/>
        <MetricCard label="Duration range" value="3 – 17" sub="minute intervals"/>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:13,color:"#888"}}>Filter:</span>
        <button onClick={()=>setFilterDur("all")} style={{padding:"3px 10px",borderRadius:6,fontSize:12,
          border:`1px solid ${filterDur==="all"?"#333":"#ddd"}`,
          background:filterDur==="all"?"#f0f0ee":"transparent",
          cursor:"pointer",fontWeight:filterDur==="all"?500:400}}>All</button>
        {activeDurations.map(dur=>(
          <button key={dur} onClick={()=>setFilterDur(String(dur))} style={{
            padding:"3px 10px",borderRadius:6,fontSize:12,
            border:`1px solid ${filterDur===String(dur)?DUR_COLORS[dur]:"#ddd"}`,
            background:filterDur===String(dur)?DUR_COLORS[dur]+"22":"transparent",
            color:filterDur===String(dur)?DUR_COLORS[dur]:"#666",cursor:"pointer"
          }}>{DUR_LABELS[dur]}</button>
        ))}
      </div>
      <p style={{fontSize:12,color:"#aaa",marginBottom:6}}>Each dot = one session. Hover for details.</p>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{top:10,right:20,left:0,bottom:20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
          <XAxis type="number" dataKey="x" name="pace" domain={[4.2,5.6]} tickFormatter={fmtPace}
            tick={{fontSize:11,fill:"#aaa"}}
            label={{value:"Interval pace (min/km)",position:"insideBottom",offset:-12,fontSize:12,fill:"#aaa"}}/>
          <YAxis type="number" dataKey="y" name="hr" domain={[125,165]} tick={{fontSize:11,fill:"#aaa"}}
            label={{value:"Avg HR (bpm)",angle:-90,position:"insideLeft",offset:10,fontSize:12,fill:"#aaa"}}/>
          <Tooltip content={<ScatterTooltip/>}/>
          {scatterFiltered.map(({dur,color,points})=>(
            <Scatter key={dur} data={points} fill={color} opacity={0.85}/>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <div style={{display:"flex",gap:14,marginTop:6,flexWrap:"wrap"}}>
        {scatterFiltered.map(({dur,color,label})=>(
          <div key={dur} style={{display:"flex",alignItems:"center",gap:5,fontSize:12}}>
            <div style={{width:10,height:10,borderRadius:2,background:color}}/>{label}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:20}}>
        <div style={{background:"#f5f5f3",borderRadius:8,padding:"14px 16px"}}>
          <div style={{fontWeight:500,fontSize:13,marginBottom:2}}>Avg pace by duration</div>
          <div style={{fontSize:11,color:"#aaa",marginBottom:10}}>faster = shorter interval</div>
          {durSummary.map(({dur,avgPace})=>{
            const all=durSummary.map(d=>d.avgPace);
            const w=Math.round(((Math.max(...all)-avgPace)/(Math.max(...all)-Math.min(...all)+0.01))*75+20);
            return (
              <div key={dur} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <div style={{width:36,fontSize:11,color:"#888",textAlign:"right"}}>{DUR_LABELS[dur]}</div>
                <div style={{flex:1,height:20,background:"#e8e8e5",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${w}%`,height:"100%",background:DUR_COLORS[dur]+"33",
                    border:`1px solid ${DUR_COLORS[dur]}`,borderRadius:4,display:"flex",alignItems:"center",paddingLeft:6}}>
                    <span style={{fontSize:11,fontWeight:500,color:DUR_COLORS[dur]}}>{fmtPace(avgPace)}/km</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:"#f5f5f3",borderRadius:8,padding:"14px 16px"}}>
          <div style={{fontWeight:500,fontSize:13,marginBottom:2}}>Avg HR by duration</div>
          <div style={{fontSize:11,color:"#aaa",marginBottom:10}}>HR drift across lengths</div>
          {durSummary.map(({dur,avgHR})=>{
            const all=durSummary.map(d=>d.avgHR);
            const w=Math.round(((avgHR-Math.min(...all))/(Math.max(...all)-Math.min(...all)+0.1))*75+20);
            return (
              <div key={dur} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <div style={{width:36,fontSize:11,color:"#888",textAlign:"right"}}>{DUR_LABELS[dur]}</div>
                <div style={{flex:1,height:20,background:"#e8e8e5",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${w}%`,height:"100%",background:DUR_COLORS[dur]+"33",
                    border:`1px solid ${DUR_COLORS[dur]}`,borderRadius:4,display:"flex",alignItems:"center",paddingLeft:6}}>
                    <span style={{fontSize:11,fontWeight:500,color:DUR_COLORS[dur]}}>{Math.round(avgHR)} bpm</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{overflowX:"auto",marginTop:20}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{borderBottom:"1px solid #e5e5e5"}}>
              {["Wk","Date","Duration","Reps","Int. pace","Avg HR","Intensity"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"6px 8px",color:"#aaa",fontWeight:400,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f0f0f0",background:d.intensity>88?"#fff8f5":"transparent"}}>
                <td style={{padding:"5px 8px",color:"#aaa",fontWeight:500}}>W{d.week}</td>
                <td style={{padding:"5px 8px"}}>{d.date}</td>
                <td style={{padding:"5px 8px"}}>
                  <span style={{background:(DUR_COLORS[d.duration]||"#888")+"22",
                    color:DUR_COLORS[d.duration]||"#888",
                    border:`1px solid ${(DUR_COLORS[d.duration]||"#888")}55`,
                    borderRadius:4,padding:"1px 7px",fontSize:11}}>{DUR_LABELS[d.duration]}</span>
                </td>
                <td style={{padding:"5px 8px"}}>{d.reps}×</td>
                <td style={{padding:"5px 8px"}}>{fmtPace(d.intervalPace)}/km</td>
                <td style={{padding:"5px 8px"}}>{d.avgHR} bpm</td>
                <td style={{padding:"5px 8px",color:d.intensity>88?"#D85A30":"inherit"}}>
                  {d.intensity?d.intensity.toFixed(1)+"%":"—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Insight><strong>Full picture:</strong> You have {subData.length} interval sessions going back to Week 1
        (Jul 30, 2025). Your formats evolved from short 3×10', 4×6' blocks early on, through longer 3×15'
        and 3×17' in Jan 2026, then into structured Norwegian Singles format from Feb onwards.
        Use the filter buttons to isolate any duration.</Insight>
    </div>
  );
}

// ── PANEL 3 — WEEKLY PROGRESS ─────────────────────────────────────────────────
function WeeklyPanel() {
  const [metric,setMetric]=useState("totalKm");
  const metricConfig={
    totalKm:{label:"Weekly volume (km)",color:"#378ADD"},
    avgHR:{label:"Avg HR (bpm)",color:"#D4537E"},
    avgPace:{label:"Avg pace (min/km)",color:"#639922"},
  };
  const cfg=metricConfig[metric];
  const totalKmAll=weeklyData.reduce((s,d)=>s+d.totalKm,0);
  const peakWeek=weeklyData.reduce((a,b)=>a.totalKm>b.totalKm?a:b);
  const avgRuns=(weeklyData.reduce((s,d)=>s+d.runs,0)/weeklyData.length).toFixed(1);
  const bestPaceWeek=weeklyData.reduce((a,b)=>a.avgPace<b.avgPace?a:b);
  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <MetricCard label="Total distance" value={`${totalKmAll.toFixed(0)} km`} sub="35 weeks"/>
        <MetricCard label="Peak week" value={`${peakWeek.totalKm} km`} sub={`Wk ${peakWeek.week} · ${peakWeek.weekStart}`}/>
        <MetricCard label="Avg runs/week" value={avgRuns} sub="sessions per week"/>
        <MetricCard label="Best avg pace wk" value={`Wk ${bestPaceWeek.week}`} sub={`${fmtPace(bestPaceWeek.avgPace)}/km avg`}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:13,color:"#888"}}>View:</span>
        {Object.entries(metricConfig).map(([key,c])=>(
          <button key={key} onClick={()=>setMetric(key)} style={{
            padding:"4px 12px",borderRadius:6,fontSize:13,
            border:`1px solid ${metric===key?c.color:"#ddd"}`,
            background:metric===key?c.color+"22":"transparent",
            color:metric===key?c.color:"#666",cursor:"pointer",fontWeight:metric===key?500:400
          }}>{key==="totalKm"?"Volume":key==="avgHR"?"Avg HR":"Avg Pace"}</button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={weeklyData} margin={{top:5,right:20,left:0,bottom:5}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
          <XAxis dataKey="week" tick={{fontSize:10,fill:"#aaa"}} tickFormatter={v=>`W${v}`} interval={3}/>
          <YAxis tick={{fontSize:11,fill:"#aaa"}} tickFormatter={metric==="avgPace"?fmtPace:undefined}
            reversed={metric==="avgPace"}/>
          <Tooltip content={<WeeklyTooltip/>}/>
          <Bar dataKey={metric} fill={cfg.color} radius={[3,3,0,0]} opacity={0.85}/>
        </BarChart>
      </ResponsiveContainer>
      <div style={{overflowX:"auto",marginTop:20}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{borderBottom:"1px solid #e5e5e5"}}>
              {["Week","Start date","Runs","Volume (km)","Avg HR","Avg pace"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"6px 8px",color:"#aaa",fontWeight:400,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((d,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f0f0f0",
                background:d.totalKm===peakWeek.totalKm?"#f0f8ff":"transparent"}}>
                <td style={{padding:"5px 8px",fontWeight:500}}>W{d.week}</td>
                <td style={{padding:"5px 8px",color:"#888"}}>{d.weekStart}</td>
                <td style={{padding:"5px 8px"}}>{d.runs}</td>
                <td style={{padding:"5px 8px",fontWeight:d.totalKm===peakWeek.totalKm?500:400,
                  color:d.totalKm===peakWeek.totalKm?"#378ADD":"inherit"}}>{d.totalKm}</td>
                <td style={{padding:"5px 8px"}}>{d.avgHR}</td>
                <td style={{padding:"5px 8px"}}>{fmtPace(d.avgPace)}/km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Insight><strong>35 weeks of training:</strong> You covered {totalKmAll.toFixed(0)} km total,
        peaking at {peakWeek.totalKm} km in Week {peakWeek.week}. Weeks 21–23 show a clear holiday dip
        before ramping back into structured Norwegian Singles from Week 28 onwards.</Insight>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("easy");
  return (
    <div style={{maxWidth:880,margin:"0 auto",padding:"32px 20px",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:"#111"}}>
      <h1 style={{fontSize:22,fontWeight:500,marginBottom:4}}>Training Dashboard</h1>
      <p style={{fontSize:14,color:"#888",marginBottom:24}}>Intervals.icu · Jul 2025 – Mar 2026 · 35 weeks</p>
      <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        <Tab label="Morning Easy Runs"     active={tab==="easy"}   onClick={()=>setTab("easy")}/>
        <Tab label="Sub-Threshold Repeats" active={tab==="sub"}    onClick={()=>setTab("sub")}/>
        <Tab label="Weekly Progress"       active={tab==="weekly"} onClick={()=>setTab("weekly")}/>
      </div>
      {tab==="easy"   && <EasyPanel/>}
      {tab==="sub"    && <SubPanel/>}
      {tab==="weekly" && <WeeklyPanel/>}
    </div>
  );
}