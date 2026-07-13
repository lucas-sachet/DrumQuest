import { motion } from "motion/react";
import { 
  Play, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Award, 
  Compass, 
  Zap, 
  ChevronRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import { UserProfile, Module, Lesson } from "../types";

interface JourneyProps {
  profile: UserProfile;
  onNavigate: (view: string, targetId?: string) => void;
}

export default function Journey({ profile, onNavigate }: JourneyProps) {
  return (
    <div id="journey-root" className="space-y-12 animate-fade-in">
      
      {/* Header with Title and Overall Journey Stats */}
      <div id="journey-header" className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold tracking-tight text-brand-text flex items-center gap-2">
            <Compass className="w-8 h-8 text-brand-primary animate-pulse-slow" />
            Trilha de Aprendizado
          </h1>
          <p className="text-sm text-brand-muted max-w-xl">
            Siga o caminho lendário do ritmo. Complete lições, acumule XP, evolua na árvore de habilidades e desbloqueie novas conquistas.
          </p>
        </div>

        {/* Global Journey stats */}
        <div className="flex gap-4">
          <div className="bg-brand-surface p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
            <div className="text-2xl font-display font-bold text-brand-success">
              {profile.modules.filter(m => m.status === "completed").length} / {profile.modules.length}
            </div>
            <div className="text-[10px] font-mono text-brand-muted">Módulos Concluídos</div>
          </div>
          <div className="bg-brand-surface p-4 rounded-xl border border-white/5 text-center min-w-[120px]">
            <div className="text-2xl font-display font-bold text-brand-primary">
              {profile.modules.flatMap(m => m.lessons).length}
            </div>
            <div className="text-[10px] font-mono text-brand-muted">Aulas Disponíveis</div>
          </div>
        </div>
      </div>

      {/* Visual Learning Trail */}
      <div id="journey-trail" className="relative space-y-16">
        
        {/* Background linking line for the modules */}
        <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-white/5 z-0 hidden md:block" />

        {profile.modules.map((module, moduleIdx) => {
          const isCompleted = module.status === "completed";
          const isAvailable = module.status === "available";
          const isLocked = module.status === "locked";

          return (
            <div 
              key={module.id} 
              id={`module-section-${module.id}`}
              className={`relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start transition-all duration-500 ${
                isLocked ? "opacity-50" : "opacity-100"
              }`}
            >
              
              {/* Left Side: Module Status Identifier (Line marker) */}
              <div className="md:col-span-1 flex md:flex-col items-center justify-start gap-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all shadow-xl shrink-0 ${
                  isCompleted 
                    ? "bg-brand-success/10 border-brand-success/30 text-brand-success shadow-brand-success/5" 
                    : isAvailable 
                      ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-brand-primary/10 animate-glow"
                      : "bg-brand-surface border-white/5 text-brand-muted"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : isLocked ? (
                    <Lock className="w-8 h-8" />
                  ) : (
                    <Zap className="w-8 h-8 animate-bounce" />
                  )}
                </div>
                
                <div className="md:hidden h-[2px] flex-1 bg-white/5" />
              </div>

              {/* Center & Right Sides: Module Details & Lessons List */}
              <div className="md:col-span-11 space-y-6">
                
                {/* Module description card */}
                <div className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-3 shadow-lg relative overflow-hidden">
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-brand-success/10 text-brand-success text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl border-l border-b border-brand-success/20">
                      CONCLUÍDO
                    </div>
                  )}
                  {isAvailable && (
                    <div className="absolute top-0 right-0 bg-brand-primary/20 text-brand-primary text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl border-l border-b border-brand-primary/20 animate-pulse">
                      DISPONÍVEL AGORA
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-brand-muted">MÓDULO {moduleIdx + 1}</span>
                      <span className="text-white/20">•</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-brand-muted">{module.difficulty}</span>
                    </div>
                    <h2 className="text-xl font-display font-bold text-brand-text">{module.name}</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brand-muted">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Estimativa: {module.timeEstimate}</span>
                    <span className="flex items-center gap-1 text-brand-accent"><Award className="w-3.5 h-3.5" /> Recompensa: +{module.xpReward} XP</span>
                    <span className="flex items-center gap-1 text-brand-text"><BookOpen className="w-3.5 h-3.5" /> {module.lessons.length} Aulas</span>
                  </div>
                </div>

                {/* Lessons Trail in this Module */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {module.lessons.map((lesson, lessonIdx) => {
                    return (
                      <motion.div
                        key={lesson.id}
                        id={`lesson-card-${lesson.id}`}
                        whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
                        transition={{ duration: 0.2 }}
                        onClick={() => !isLocked && onNavigate("lesson", lesson.id)}
                        className={`p-5 rounded-xl border flex flex-col justify-between gap-6 transition-all shadow-md group ${
                          isLocked 
                            ? "bg-brand-surface/30 border-white/5 cursor-not-allowed select-none" 
                            : "bg-brand-surface hover:bg-brand-surface/80 border-white/10 hover:border-brand-primary/30 cursor-pointer"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-brand-muted">AULA {lessonIdx + 1}</span>
                            {!isLocked ? (
                              <span className="text-[10px] font-mono text-brand-primary font-semibold group-hover:text-brand-accent transition-colors flex items-center gap-0.5">
                                Ver Aula
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-brand-muted" />
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                            {lesson.title}
                          </h3>
                          
                          <p className="text-xs text-brand-muted line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        {/* Footer stats for the lesson */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-brand-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round(lesson.timeSeconds / 60)} min
                          </span>
                          <span className="text-brand-accent font-semibold flex items-center gap-0.5">
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

              </div>

            </div>
          );
        })}

        {/* Future concept representation inside journey */}
        <div id="future-journey-teaser" className="bg-gradient-to-r from-brand-surface to-brand-bg p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-brand-accent/20 text-[8px] font-mono font-bold text-brand-accent px-1.5 py-0.5 rounded uppercase tracking-wider">
                Expansão de Campanha
              </span>
              <span className="text-xs text-brand-muted">Próximos Módulos</span>
            </div>
            <h3 className="text-lg font-display font-bold text-brand-text">Módulo 4: Rudimentos Híbridos & Grooves Ímpares</h3>
            <p className="text-xs text-brand-muted max-w-xl">
              Novas lições em compassos compostos (5/4 e 7/8), rudimentos avançados de flams e ruffs, e arranjos inspirados em bateristas de Jazz Fusion e Prog Metal.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-brand-muted shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        </div>

      </div>

    </div>
  );
}
