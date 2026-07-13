import { useState } from "react";
import { motion } from "motion/react";
import { 
  BarChart4, 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity, 
  Calendar, 
  Sliders, 
  ChevronRight,
  Gauge
} from "lucide-react";
import { UserProfile, PracticeHistory } from "../types";

interface StatsViewProps {
  profile: UserProfile;
}

export default function StatsView({ profile }: StatsViewProps) {
  const [activeMetric, setActiveMetric] = useState<"bpm" | "time">("bpm");

  // Summarize stats
  const totalMinutes = profile.history.reduce((sum, day) => sum + day.minutes, 0);
  const avgAccuracy = Math.round(profile.history.reduce((sum, day) => sum + day.accuracy, 0) / profile.history.length);
  const maxBpm = Math.max(...profile.history.map(day => day.bpm));

  // Visual SVG settings for charts
  const width = 500;
  const height = 180;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // BPM Chart Line points calculation
  const getBpmPoints = () => {
    const minVal = 70;
    const maxVal = 120;
    const range = maxVal - minVal;
    
    return profile.history.map((day, idx) => {
      const x = padding + (idx / (profile.history.length - 1)) * chartWidth;
      const y = height - padding - ((day.bpm - minVal) / range) * chartHeight;
      return { x, y, day: day.date, bpm: day.bpm };
    });
  };

  const bpmPoints = getBpmPoints();
  const bpmLinePath = bpmPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const bpmAreaPath = `${bpmLinePath} L ${bpmPoints[bpmPoints.length - 1].x} ${height - padding} L ${bpmPoints[0].x} ${height - padding} Z`;

  // Practice Time Bar dimensions calculation
  const getTimeBars = () => {
    const maxTime = 50; // max minutes in a session
    
    return profile.history.map((day, idx) => {
      const x = padding + (idx / (profile.history.length - 1)) * chartWidth - 12;
      const barHeight = (day.minutes / maxTime) * chartHeight;
      const y = height - padding - barHeight;
      return { x, y, width: 24, height: barHeight, day: day.date, minutes: day.minutes };
    });
  };

  const timeBars = getTimeBars();

  // Categorize skills for the breakdown map
  const skillCategories = [
    { name: "Tempo", level: 2, icon: "⏱️", color: "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" },
    { name: "Coordenação", level: 3, icon: "🤹", color: "bg-brand-success/10 border-brand-success/20 text-brand-success" },
    { name: "Rudimentos", level: 4, icon: "🥁", color: "bg-brand-accent/10 border-brand-accent/20 text-brand-accent" },
    { name: "Grooves", level: 3, icon: "🎵", color: "bg-brand-warning/10 border-brand-warning/20 text-brand-warning" },
    { name: "Independência", level: 1, icon: "🕸️", color: "bg-brand-accent/10 border-brand-accent/20 text-brand-accent" },
    { name: "Dinâmica", level: 2, icon: "🔉", color: "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" },
    { name: "Leitura", level: 2, icon: "📖", color: "bg-brand-success/10 border-brand-success/20 text-brand-success" },
    { name: "Técnica", level: 0, icon: "📐", color: "bg-white/5 border-white/5 text-brand-muted" },
  ];

  return (
    <div id="stats-view-root" className="space-y-8 animate-fade-in">
      
      {/* Title & Top Description */}
      <div id="stats-header" className="space-y-2 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-display font-bold tracking-tight text-brand-text flex items-center gap-2">
          <BarChart4 className="w-8 h-8 text-brand-success" />
          Estatísticas & Performance
        </h1>
        <p className="text-sm text-brand-muted max-w-xl">
          Sua evolução rítmica mapeada através de sensores simulados e cronômetros de prática. Veja seu andamento subir!
        </p>
      </div>

      {/* Main Grid: Multi-stat Summary Counters */}
      <div id="stats-summary-cards" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-mono text-brand-muted uppercase">Tempo de Prática</span>
            <div className="text-3xl font-display font-bold text-brand-text">
              {totalMinutes} <span className="text-sm font-normal text-brand-muted">minutos</span>
            </div>
            <p className="text-[10px] text-brand-muted">Consumo desta semana corrente</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 text-brand-primary shrink-0">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-mono text-brand-muted uppercase">Precisão Média</span>
            <div className="text-3xl font-display font-bold text-brand-success">
              {avgAccuracy}%
            </div>
            <p className="text-[10px] text-brand-muted">Calculada com base na grade MIDI</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 flex items-center justify-center border border-brand-success/20 text-brand-success shrink-0">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-mono text-brand-muted uppercase">BPM Pico Alçado</span>
            <div className="text-3xl font-display font-bold text-brand-warning">
              {maxBpm} <span className="text-sm font-normal text-brand-muted">BPM</span>
            </div>
            <p className="text-[10px] text-brand-muted">Toque simples / paradiddle sustentado</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-warning/10 flex items-center justify-center border border-brand-warning/20 text-brand-warning shrink-0">
            <Gauge className="w-6 h-6 animate-bounce" />
          </div>
        </div>

      </div>

      {/* Grid: Charts Display (Left 8) vs Skill distribution (Right 4) */}
      <div id="stats-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8: Charts with tab toggles */}
        <div className="lg:col-span-8 bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
          
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
            <h3 className="text-sm font-mono font-bold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              Histórico de Performance Semanal
            </h3>

            {/* Toggle tabs */}
            <div className="flex bg-brand-bg p-1 rounded-lg border border-white/5 text-xs font-mono">
              <button
                onClick={() => setActiveMetric("bpm")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  activeMetric === "bpm" 
                    ? "bg-brand-primary text-white" 
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                Evolução BPM
              </button>
              <button
                onClick={() => setActiveMetric("time")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  activeMetric === "time" 
                    ? "bg-brand-primary text-white" 
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                Minutos de Prática
              </button>
            </div>
          </div>

          {/* SVG Rendered Charts container */}
          <div className="relative w-full overflow-x-auto flex justify-center bg-brand-bg/50 p-4 rounded-xl border border-white/5">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full max-w-[550px] h-auto overflow-visible select-none"
            >
              {/* Common grid lines */}
              <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#ffffff" strokeOpacity="0.03" strokeDasharray="3" />
              <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#ffffff" strokeOpacity="0.03" strokeDasharray="3" />
              <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#ffffff" strokeOpacity="0.08" />

              {/* BPM LINE CHART */}
              {activeMetric === "bpm" && (
                <>
                  {/* Fill Area gradient under line */}
                  <path 
                    d={bpmAreaPath} 
                    fill="url(#bpmGrad)" 
                    opacity="0.15" 
                  />

                  {/* Line stroke */}
                  <path 
                    d={bpmLinePath} 
                    fill="none" 
                    stroke="#4F8CFF" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {/* Line glowing points */}
                  {bpmPoints.map((point, idx) => (
                    <g key={idx}>
                      <circle 
                        cx={point.x} 
                        cy={point.y} 
                        r="5" 
                        fill="#4F8CFF" 
                        stroke="#0B0F14" 
                        strokeWidth="1.5" 
                      />
                      {/* Interactive hover values */}
                      <text 
                        x={point.x} 
                        y={point.y - 10} 
                        textAnchor="middle" 
                        fill="#FFFFFF" 
                        fontSize="9" 
                        fontFamily="var(--font-mono)" 
                        fontWeight="bold"
                      >
                        {point.bpm}
                      </text>
                    </g>
                  ))}

                  <defs>
                    <linearGradient id="bpmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F8CFF" />
                      <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </>
              )}

              {/* PRACTICE TIME BAR CHART */}
              {activeMetric === "time" && (
                <>
                  {timeBars.map((bar, idx) => (
                    <g key={idx}>
                      {/* Glow effect bar */}
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        rx="4"
                        fill="#9B5CFF"
                        opacity="0.25"
                        className="blur-[2px]"
                      />
                      {/* Real bar */}
                      <rect
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        rx="4"
                        fill="url(#timeGrad)"
                      />
                      {/* Minutes text above bar */}
                      <text 
                        x={bar.x + bar.width / 2} 
                        y={bar.y - 8} 
                        textAnchor="middle" 
                        fill="#FFFFFF" 
                        fontSize="9" 
                        fontFamily="var(--font-mono)" 
                        fontWeight="bold"
                      >
                        {bar.minutes}m
                      </text>
                    </g>
                  ))}

                  <defs>
                    <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9B5CFF" />
                      <stop offset="100%" stopColor="#4F8CFF" />
                    </linearGradient>
                  </defs>
                </>
              )}

              {/* X Axis labels (Weekdays) */}
              {profile.history.map((day, idx) => {
                const x = padding + (idx / (profile.history.length - 1)) * chartWidth;
                return (
                  <text 
                    key={idx} 
                    x={x} 
                    y={height - 12} 
                    textAnchor="middle" 
                    fill="#9CA3AF" 
                    fontSize="9" 
                    fontFamily="var(--font-mono)"
                  >
                    {day.date}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-xs text-brand-muted bg-brand-bg/30 p-4 rounded-xl border border-white/5">
            <span>Legenda: {activeMetric === "bpm" ? "BPM máximo sustentado com consistência > 90%." : "Soma dos minutos totais praticados."}</span>
            <span className="text-brand-primary font-mono font-bold">Histórico consolidado</span>
          </div>
        </div>

        {/* Right 4: Skill categories levels breakdown */}
        <div className="lg:col-span-4 bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-brand-accent" />
              Perfil por Competência
            </h3>
            <p className="text-xs text-brand-muted">Nível consolidado do baterista nas 8 competências fundamentais de estudos.</p>
          </div>

          {/* List of competencies */}
          <div className="space-y-4">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-2 font-semibold text-brand-text">
                    <span className="shrink-0 text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="font-mono text-brand-muted font-bold">Nível {cat.level} / 5</span>
                </div>

                {/* Micro progression blocks */}
                <div className="flex gap-1.5 h-1.5">
                  {Array.from({ length: 5 }).map((_, blockIdx) => (
                    <div 
                      key={blockIdx}
                      className={`flex-1 rounded-full transition-all ${
                        blockIdx < cat.level 
                          ? "bg-brand-primary shadow-[0_0_4px_rgba(79,140,255,0.4)]" 
                          : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
