import { motion } from "motion/react";
import { 
  Trophy, 
  Award, 
  ArrowRight, 
  Home, 
  Sparkles, 
  Zap, 
  Activity, 
  CheckCircle2,
  ListRestart
} from "lucide-react";

interface ResultViewProps {
  results: {
    accuracy: number;
    score: number;
    consistency: number;
    bpmReached: number;
    timeSpentSeconds: number;
  };
  xpGranted: number;
  onContinue: () => void;
  onRestart: () => void;
}

export default function ResultView({ results, xpGranted, onContinue, onRestart }: ResultViewProps) {
  // Determine Grade
  const getGradeAndColor = () => {
    const acc = results.accuracy;
    if (acc >= 90) return { grade: "S", label: "Lendário!", color: "text-brand-accent border-brand-accent/30 bg-brand-accent/5 shadow-brand-accent/10" };
    if (acc >= 80) return { grade: "A", label: "Excelente!", color: "text-brand-success border-brand-success/30 bg-brand-success/5 shadow-brand-success/10" };
    if (acc >= 65) return { grade: "B", label: "Muito Bom!", color: "text-brand-primary border-brand-primary/30 bg-brand-primary/5 shadow-brand-primary/10" };
    return { grade: "C", label: "Bom Trabalho!", color: "text-brand-warning border-brand-warning/30 bg-brand-warning/5 shadow-brand-warning/10" };
  };

  const { grade, label, color } = getGradeAndColor();

  return (
    <div id="result-view-root" className="max-w-2xl mx-auto space-y-8 animate-fade-in text-center">
      
      {/* Grade and Celebratory Trophy Animation Header */}
      <div className="space-y-4">
        <motion.div 
          initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="mx-auto w-28 h-28 rounded-full bg-brand-bg flex items-center justify-center border-4 border-brand-primary/10 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-brand-primary/5 rounded-full animate-ping"></div>
          <Trophy className="w-12 h-12 text-brand-warning animate-bounce" />
        </motion.div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest font-bold">
            TREINO CONCLUÍDO COM SUCESSO!
          </span>
          <h1 className="text-3xl font-display font-black text-brand-text">Recompensas Desbloqueadas</h1>
        </div>
      </div>

      {/* Large Grade Display Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-2xl border flex flex-col items-center justify-center space-y-4 shadow-2xl max-w-sm mx-auto relative overflow-hidden ${color}`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="text-7xl font-display font-black tracking-tighter select-none">
          {grade}
        </div>
        
        <div className="space-y-1">
          <span className="text-lg font-bold text-brand-text">{label}</span>
          <p className="text-xs text-brand-muted">Nota atribuída com base na grade de tempo real do Web MIDI.</p>
        </div>
      </motion.div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-brand-surface p-4 rounded-xl border border-white/5">
          <div className="text-xs text-brand-muted mb-1 font-mono uppercase">Precisão</div>
          <div className="text-xl font-display font-bold text-brand-success">{results.accuracy}%</div>
          <div className="text-[9px] font-mono text-brand-muted mt-1">Sincronia do clique</div>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl border border-white/5">
          <div className="text-xs text-brand-muted mb-1 font-mono uppercase">Consistência</div>
          <div className="text-xl font-display font-bold text-brand-accent">{results.consistency}%</div>
          <div className="text-[9px] font-mono text-brand-muted mt-1">Sustentação do pulso</div>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl border border-white/5">
          <div className="text-xs text-brand-muted mb-1 font-mono uppercase">Andamento</div>
          <div className="text-xl font-display font-bold text-brand-warning">{results.bpmReached} <span className="text-xs font-normal">BPM</span></div>
          <div className="text-[9px] font-mono text-brand-muted mt-1">Velocidade sustentada</div>
        </div>

        <div className="bg-brand-surface p-4 rounded-xl border border-white/5">
          <div className="text-xs text-brand-muted mb-1 font-mono uppercase">Tempo</div>
          <div className="text-xl font-display font-bold text-brand-text">
            {results.timeSpentSeconds}s
          </div>
          <div className="text-[9px] font-mono text-brand-muted mt-1">Duração de prática</div>
        </div>

      </div>

      {/* XP Earned Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-brand-surface p-6 rounded-2xl border border-brand-primary/20 flex items-center justify-between gap-6 shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 text-brand-primary">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono text-brand-muted uppercase">Recompensa Recebida</span>
            <div className="text-lg font-bold text-brand-text flex items-center gap-1.5">
              <span>+{xpGranted} XP Recebidos</span>
              <Sparkles className="w-4 h-4 text-brand-warning" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-brand-muted font-mono uppercase">Score de Treino</div>
          <div className="text-sm font-bold text-brand-accent">+{results.score} PTS</div>
        </div>
      </motion.div>

      {/* Suggested next steps */}
      <div className="bg-brand-surface/40 p-5 rounded-xl border border-white/5 text-left space-y-3">
        <h3 className="text-xs font-mono font-bold text-brand-muted uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-brand-accent" />
          Próximos Objetivos Recomendados pela IA
        </h3>
        <div className="space-y-2 text-xs text-brand-muted">
          <div className="flex gap-2 items-start">
            <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
            <span>Excelente constância! Experimente aumentar o andamento do Toque Simples em mais 5 BPM para testar sua flexibilidade.</span>
          </div>
          <div className="flex gap-2 items-start">
            <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
            <span>Sua mão esquerda atrasou um pouco perto dos 40 segundos de treino. Tente focar em golpes mais baixos e punho relaxado.</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={onContinue}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <span>Voltar para Trilha</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRestart}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-brand-text font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <ListRestart className="w-4 h-4 text-brand-primary" />
          <span>Praticar Novamente</span>
        </button>
      </div>

    </div>
  );
}
