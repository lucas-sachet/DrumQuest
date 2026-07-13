import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  ArrowLeft, 
  Cpu, 
  Clock, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Activity, 
  Zap, 
  Radio, 
  Target,
  Sparkles
} from "lucide-react";
import { Exercise, Lesson } from "../types";

interface PracticeSessionProps {
  exercise: Exercise;
  lesson: Lesson;
  onBack: () => void;
  onFinishSession: (results: { 
    accuracy: number; 
    score: number; 
    consistency: number; 
    bpmReached: number; 
    timeSpentSeconds: number; 
  }) => void;
}

export default function PracticeSession({ exercise, lesson, onBack, onFinishSession }: PracticeSessionProps) {
  const [bpm, setBpm] = useState(exercise.bpmDefault);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.durationSeconds);
  const [beatCount, setBeatCount] = useState(0);
  const [score, setScore] = useState(0);
  const [hitsCount, setHitsCount] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [missHits, setMissHits] = useState(0);
  const [tapRating, setTapRating] = useState<string | null>(null);
  const [midiLogs, setMidiLogs] = useState<string[]>([
    "SISTEMA: Aguardando sinal do controlador MIDI...",
    "INFO: Roland TD-17 reconhecido na porta USB #1"
  ]);

  // Audio Metronome References
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextClickTimeRef = useRef<number>(0);
  const beatRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Countdown timer effect
  useEffect(() => {
    let timerId: any = null;
    if (isPlaying && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isPlaying, timeLeft]);

  // Metronome scheduler logic
  useEffect(() => {
    if (isPlaying) {
      // Initialize AudioContext on first play
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const intervalMs = (60 / bpm) * 1000;
      nextClickTimeRef.current = audioContextRef.current.currentTime;
      beatRef.current = 0;
      
      const runScheduler = () => {
        const scheduleAheadTime = 0.1; // 100ms
        const now = audioContextRef.current!.currentTime;

        while (nextClickTimeRef.current < now + scheduleAheadTime) {
          const time = nextClickTimeRef.current;
          const currentBeatIndex = beatRef.current % 8;
          
          // Trigger metronome click audio
          if (!isMuted) {
            playAudioClick(currentBeatIndex, time);
          }
          
          // Sync visual trigger with audio time
          const delayToVisual = (time - now) * 1000;
          setTimeout(() => {
            setBeatCount(prev => (prev + 1) % 8);
            lastTickTimeRef.current = Date.now();
          }, Math.max(0, delayToVisual));

          nextClickTimeRef.current += 60 / bpm;
          beatRef.current++;
        }
        
        timerIdRef.current = window.setTimeout(runScheduler, 25);
      };

      runScheduler();
    } else {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [isPlaying, bpm, isMuted]);

  // Handle Spacebar keyboard taps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        triggerUserTap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, beatCount, bpm]);

  // Play audio tick
  const playAudioClick = (beatIndex: number, time: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Accent beat 1 (index 0) and beat 5 (index 4) for dual rhythm support
    if (beatIndex === 0) {
      osc.frequency.setValueAtTime(1200, time);
      gain.gain.setValueAtTime(0.4, time);
    } else if (beatIndex === 4) {
      osc.frequency.setValueAtTime(900, time);
      gain.gain.setValueAtTime(0.3, time);
    } else {
      osc.frequency.setValueAtTime(600, time);
      gain.gain.setValueAtTime(0.2, time);
    }

    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.start(time);
    osc.stop(time + 0.06);
  };

  // User taps spacebar or on-screen pad
  const triggerUserTap = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }

    const tapTime = Date.now();
    const tickTime = lastTickTimeRef.current;
    const intervalMs = (60 / bpm) * 1000;
    
    // Calculate difference to the nearest perfect eighth grid
    const diff = Math.abs(tapTime - tickTime);
    const halfInterval = intervalMs / 2;
    const adjustedDiff = diff > halfInterval ? Math.abs(diff - intervalMs) : diff;

    setHitsCount(prev => prev + 1);

    let rating = "FORA";
    let scoreAdd = 10;

    if (adjustedDiff < 45) {
      rating = "PERFEITO!";
      setPerfectHits(prev => prev + 1);
      scoreAdd = 100;
    } else if (adjustedDiff < 110) {
      rating = "BOM";
      setGoodHits(prev => prev + 1);
      scoreAdd = 50;
    } else {
      rating = "FORA DO TEMPO";
      setMissHits(prev => prev + 1);
      scoreAdd = 5;
    }

    setScore(prev => prev + scoreAdd);
    setTapRating(rating);

    // Remove rating text after brief moment
    setTimeout(() => {
      setTapRating(prev => (prev === rating ? null : prev));
    }, 500);

    // Log simulated MIDI trigger
    const midiNotes = [38, 36, 42]; // snare, kick, hihat
    const randNote = midiNotes[Math.floor(Math.random() * midiNotes.length)];
    const noteNames: { [key: number]: string } = { 38: "Caixa (Snare)", 36: "Bumbo (Bass)", 42: "Chimbal (Hi-Hat)" };
    const randVelocity = Math.floor(Math.random() * 40) + 80; // 80 - 120
    
    const newLog = `MIDI Trigger: Nota ${randNote} [${noteNames[randNote]}] | Vel: ${randVelocity} | Diff: ${Math.round(adjustedDiff)}ms | ${rating}`;
    setMidiLogs(prev => [newLog, ...prev.slice(0, 4)]);
  };

  const handleFinish = () => {
    // Compile accurate summary
    const total = hitsCount || 1;
    const accuracy = Math.round(((perfectHits * 100) + (goodHits * 50)) / total);
    const consistency = Math.round((perfectHits / total) * 100);
    
    onFinishSession({
      accuracy: Math.min(100, Math.max(30, accuracy)),
      score: score + (timeLeft === 0 ? 500 : 100), // bonus for finishing full length
      consistency: Math.min(100, Math.max(25, consistency)),
      bpmReached: bpm,
      timeSpentSeconds: exercise.durationSeconds - timeLeft
    });
  };

  return (
    <div id="practice-session-root" className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Lição</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-ping"></span>
          <span className="text-xs font-mono text-brand-muted uppercase">Sessão Ativa</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2 text-center">
        <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest font-bold">
          PRÁTICA ATIVA • {lesson.title}
        </span>
        <h1 className="text-2xl font-display font-bold text-brand-text">{exercise.title}</h1>
        <p className="text-sm text-brand-muted max-w-xl mx-auto">{exercise.description}</p>
      </div>

      {/* Main Grid: Metronome & Controls | Visualizer & MIDI Logs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Metronome Hub */}
        <div className="md:col-span-7 bg-brand-surface p-8 rounded-2xl border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Neon corner overlay */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-xl"></div>

          {/* Clock Timer and Score Indicators */}
          <div className="flex justify-between items-center bg-brand-bg/60 p-4 rounded-xl border border-white/5 font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-muted" />
              <div>
                <div className="text-[9px] text-brand-muted uppercase">Tempo Restante</div>
                <div className="text-sm font-bold text-brand-text">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-brand-muted uppercase">Pontuação de Treino</div>
              <div className="text-sm font-bold text-brand-primary flex items-center gap-1 justify-end">
                <Zap className="w-3.5 h-3.5 fill-current text-brand-warning animate-pulse" />
                <span>{score} PTS</span>
              </div>
            </div>
          </div>

          {/* Interactive Metronome Radial visualizer */}
          <div id="radial-metronome" className="flex flex-col items-center justify-center space-y-6">
            
            {/* Visualizing beats as a row of glowing nodes (8-beat grid) */}
            <div className="flex items-center gap-3 w-full justify-between">
              {Array.from({ length: 8 }).map((_, idx) => {
                const isCurrent = beatCount === idx && isPlaying;
                const isAccent = idx === 0 || idx === 4;
                return (
                  <motion.div
                    key={idx}
                    animate={isCurrent ? { scale: [1, 1.3, 1], y: [0, -4, 0] } : {}}
                    transition={{ duration: 0.15 }}
                    className={`h-10 flex-1 rounded-lg flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? isAccent
                          ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                          : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "bg-brand-bg/80 text-brand-muted hover:bg-brand-bg"
                    } border ${isCurrent ? "border-transparent" : "border-white/5"}`}
                  >
                    <span className="text-xs font-bold font-mono">{idx + 1}</span>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isCurrent 
                        ? "bg-white animate-ping" 
                        : isAccent 
                          ? "bg-brand-accent/30" 
                          : "bg-white/10"
                    }`} />
                  </motion.div>
                );
              })}
            </div>

            {/* Tap feedback rating popup */}
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {tapRating && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`text-sm font-display font-black tracking-widest ${
                      tapRating === "PERFEITO!" 
                        ? "text-brand-success drop-shadow-[0_0_8px_rgba(48,209,88,0.4)]" 
                        : tapRating === "BOM" 
                          ? "text-brand-primary" 
                          : "text-brand-warning"
                    }`}
                  >
                    {tapRating}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Adjustable Slider & BPM Display */}
            <div className="w-full text-center space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setBpm(prev => Math.max(40, prev - 5))}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center font-bold text-brand-text text-lg cursor-pointer"
                >
                  -
                </button>
                <div className="space-y-0.5">
                  <div className="text-4xl font-display font-black text-brand-text tracking-tight">
                    {bpm} <span className="text-sm font-normal text-brand-muted">BPM</span>
                  </div>
                  <div className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">Ajuste de Andamento</div>
                </div>
                <button 
                  onClick={() => setBpm(prev => Math.min(240, prev + 5))}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center font-bold text-brand-text text-lg cursor-pointer"
                >
                  +
                </button>
              </div>

              <input 
                type="range"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-brand-primary bg-brand-bg h-1 rounded-full cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Action Row: Start/Pause Metronome & Finish Session */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-white/5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 group py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] transition-all ${
                isPlaying 
                  ? "bg-brand-warning text-brand-bg" 
                  : "bg-brand-primary text-white"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar Prática</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Iniciar Metrônomo</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-4 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-brand-muted hover:text-brand-text transition-colors flex items-center justify-center cursor-pointer"
              title={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-brand-warning" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={handleFinish}
              className="flex-1 bg-brand-success hover:bg-brand-success/90 text-brand-bg font-bold text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Concluir e Ver Nota</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Side: Virtual Tap Pad & MIDI Simulation Logs */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Large Tactile Drum Pad to test tempo */}
          <div 
            onClick={triggerUserTap}
            className="group/pad aspect-square rounded-2xl bg-gradient-to-b from-brand-surface to-[#10141b] border-2 border-brand-primary/20 hover:border-brand-primary/50 p-8 flex flex-col items-center justify-center text-center shadow-xl cursor-pointer select-none relative overflow-hidden transition-all duration-300 active:scale-95 active:border-brand-accent/50"
          >
            {/* Visual ripple backdrop on tap */}
            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover/pad:opacity-100 transition-opacity z-0 pointer-events-none"></div>
            
            <div className="w-20 h-20 rounded-full bg-brand-primary/5 border border-brand-primary/10 group-hover/pad:border-brand-primary/30 flex items-center justify-center mb-4 transition-colors z-10">
              <Activity className="w-8 h-8 text-brand-primary group-hover/pad:scale-110 transition-transform animate-pulse-slow" />
            </div>

            <h3 className="text-sm font-bold text-brand-text group-hover/pad:text-brand-primary transition-colors z-10">
              PAD DE TOQUE SENSÍVEL
            </h3>
            <p className="text-xs text-brand-muted max-w-[200px] mt-1 leading-normal z-10">
              Clique neste círculo ou aperte <span className="font-mono bg-white/5 px-1 py-0.5 rounded text-brand-text">SPACEBAR</span> no tempo do clique para simular sua baqueta.
            </p>

            <span className="mt-4 text-[10px] font-mono text-brand-accent tracking-widest z-10">
              LATÊNCIA DE TOQUE RESTRITA (WEB MIDI CLONE)
            </span>
          </div>

          {/* Web MIDI Terminal Logs */}
          <div className="bg-brand-surface rounded-2xl border border-white/5 p-5 space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono font-bold text-brand-muted flex items-center gap-1.5 uppercase">
                <Cpu className="w-3.5 h-3.5 text-brand-primary" />
                Console de Entrada MIDI
              </h4>
              <Radio className="w-3.5 h-3.5 text-brand-success animate-pulse-slow" />
            </div>

            <div className="bg-brand-bg font-mono p-4 rounded-xl border border-white/5 text-[10px] space-y-2 h-36 overflow-y-auto">
              {midiLogs.map((log, idx) => {
                let colorClass = "text-brand-muted";
                if (log.startsWith("MIDI Trigger")) {
                  colorClass = log.includes("PERFEITO") 
                    ? "text-brand-success" 
                    : log.includes("BOM") 
                      ? "text-brand-primary" 
                      : "text-brand-warning";
                } else if (log.startsWith("SISTEMA")) {
                  colorClass = "text-brand-accent";
                }
                
                return (
                  <div key={idx} className={`line-clamp-1 ${colorClass}`}>
                    {log}
                  </div>
                );
              })}
            </div>
            
            {/* MIDI Trigger simulator */}
            <div className="flex gap-2">
              <button 
                onClick={triggerUserTap}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-brand-text font-mono text-[9px] py-1.5 rounded transition-colors cursor-pointer text-center"
              >
                Gatilhar Bumbo
              </button>
              <button 
                onClick={triggerUserTap}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-brand-text font-mono text-[9px] py-1.5 rounded transition-colors cursor-pointer text-center"
              >
                Gatilhar Caixa
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
