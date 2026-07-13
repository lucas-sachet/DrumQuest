import { motion } from "motion/react";
import { 
  Flame, 
  Trophy, 
  Play, 
  Clock, 
  Zap, 
  Music, 
  Award, 
  ChevronRight, 
  Sparkles,
  Calendar,
  Activity,
  Heart,
  MessageSquareCode
} from "lucide-react";
import { UserProfile, Lesson } from "../types";

interface DashboardProps {
  profile: UserProfile;
  onNavigate: (view: string, targetId?: string) => void;
  onClaimMissionReward: (missionId: string, xpReward: number) => void;
}

export default function Dashboard({ profile, onNavigate, onClaimMissionReward }: DashboardProps) {
  // Find the next available or uncompleted lesson
  const getNextLesson = (): Lesson => {
    // Look for first lesson in available modules
    const activeModule = profile.modules.find(m => m.status === "available") || profile.modules[0];
    return activeModule.lessons[0];
  };

  const nextLesson = getNextLesson();

  // Simple hardcoded daily missions for the demo state
  const dailyMissions = [
    {
      id: "mis-1",
      title: "Aquecimento de Baqueta",
      description: "Pratique qualquer exercício de Toque Simples por 2 minutos.",
      xpReward: 50,
      progress: 1,
      target: 2,
      completed: false,
      claimed: false,
      type: "practice"
    },
    {
      id: "mis-2",
      title: "BPM Progressivo",
      description: "Aumente o andamento de um exercício em pelo menos 10 BPM.",
      xpReward: 80,
      progress: 1,
      target: 1,
      completed: true,
      claimed: false,
      type: "speed"
    },
    {
      id: "mis-3",
      title: "Alvo Rígido",
      description: "Obtenha consistência rítmica acima de 90% em uma sessão.",
      xpReward: 100,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      type: "accuracy"
    }
  ];

  return (
    <div id="dashboard-root" className="space-y-8 animate-fade-in">
      {/* Upper Status & Greeting Section */}
      <div id="dashboard-header" className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-brand-surface p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-brand-primary">
            <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
            <span>SESSÃO DE HOJE PRONTA</span>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-brand-text">
            Olá, {profile.name}! <span className="text-brand-muted">👋</span>
          </h1>
          <p className="text-sm text-brand-muted max-w-xl">
            Pronto para subir de nível? Seu último treino foi de <span className="text-brand-text font-medium">Toque Simples</span>. Sua consistência está evoluindo rápido!
          </p>
        </div>

        {/* Level Badge and Streak Panel */}
        <div className="flex items-center gap-4 bg-brand-bg/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
              <span className="text-xl font-display font-extrabold text-brand-primary">{profile.level}</span>
            </div>
            <div>
              <div className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">Level</div>
              <div className="text-sm font-bold text-brand-text">{profile.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-brand-warning/10 flex items-center justify-center border border-brand-warning/20">
              <Flame className="w-6 h-6 text-brand-warning animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">Streak</div>
              <div className="text-sm font-bold text-brand-text">{profile.streakDays} Dias Seguidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Side Level & Progress, Next Lesson | Right Side Statistics & Missions */}
      <div id="dashboard-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: Journey Continuity & Main Progression Card */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Continue Journey Call to Action Card */}
          <div id="continue-journey-card" className="relative overflow-hidden bg-gradient-to-r from-brand-primary/20 via-brand-accent/15 to-brand-surface p-8 rounded-2xl border border-brand-primary/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-md">
              <span className="inline-flex items-center gap-1 bg-brand-primary/20 border border-brand-primary/30 text-[10px] font-mono font-bold text-brand-primary px-2 py-1 rounded">
                RECOMENDADO
              </span>
              <div>
                <div className="text-xs font-mono text-brand-muted mb-1">{nextLesson.moduleName}</div>
                <h2 className="text-2xl font-display font-bold text-brand-text">{nextLesson.title}</h2>
              </div>
              <p className="text-sm text-brand-muted line-clamp-2">
                {nextLesson.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-brand-muted">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.round(nextLesson.timeSeconds / 60)} min</span>
                <span className="flex items-center gap-1 text-brand-accent"><Award className="w-3.5 h-3.5" /> +{nextLesson.xpReward} XP</span>
                <span className="bg-brand-surface/80 px-2 py-0.5 rounded border border-white/5 text-[10px]">{nextLesson.difficulty}</span>
              </div>
            </div>

            <button 
              id="btn-continue-journey"
              onClick={() => onNavigate("lesson", nextLesson.id)}
              className="group flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-sm px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer whitespace-nowrap self-stretch md:self-auto"
            >
              <span>Continuar Jornada</span>
              <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* XP Progress Details */}
          <div id="xp-progress-panel" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-mono font-medium text-brand-muted">PROGRESSO DO LEVEL</h3>
              <span className="text-xs font-mono text-brand-primary font-bold">
                {profile.xp} / {profile.xpNextLevel} XP
              </span>
            </div>
            
            {/* ProgressBar */}
            <div className="h-3 bg-brand-bg rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(profile.xp / profile.xpNextLevel) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <div className="flex justify-between text-xs text-brand-muted">
              <span>Nível {profile.level}</span>
              <span>Faltam {profile.xpNextLevel - profile.xp} XP para o nível {profile.level + 1}</span>
            </div>
          </div>

          {/* Quick Learning Stats */}
          <div id="quick-stats-grid" className="grid grid-cols-3 gap-4">
            <div className="bg-brand-surface p-4 rounded-xl border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center mx-auto mb-2 text-brand-accent">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xl font-display font-bold text-brand-text">{profile.totalPracticeHours}h</div>
              <div className="text-[10px] font-mono text-brand-muted">Tempo Praticado</div>
            </div>

            <div className="bg-brand-surface p-4 rounded-xl border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-brand-success/10 flex items-center justify-center mx-auto mb-2 text-brand-success">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-xl font-display font-bold text-brand-text">{profile.totalExercisesCompleted}</div>
              <div className="text-[10px] font-mono text-brand-muted">Exercícios Concluídos</div>
            </div>

            <div className="bg-brand-surface p-4 rounded-xl border border-white/5 text-center">
              <div className="w-8 h-8 rounded-lg bg-brand-warning/10 flex items-center justify-center mx-auto mb-2 text-brand-warning">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-xl font-display font-bold text-brand-text">
                {profile.badges.filter(b => b.unlockedAt).length}
              </div>
              <div className="text-[10px] font-mono text-brand-muted">Badges Conquistadas</div>
            </div>
          </div>

          {/* Future AI Concept Highlight */}
          <div id="ai-concept-highlight" className="bg-brand-surface/40 p-5 rounded-2xl border border-brand-accent/20 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl"></div>
            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 text-brand-accent shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-brand-text">Plano de Estudos Inteligente IA</span>
                <span className="bg-brand-accent/20 text-[8px] font-mono font-bold text-brand-accent px-1.5 py-0.5 rounded tracking-wide uppercase">
                  FUTURO
                </span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Nossa inteligência artificial está analisando sua regularidade nos treinos de Toque Simples e Toque Duplo. Em breve, ela desenhará seu treino personalizado ideal focado no seu ponto fraco: velocidade da mão esquerda.
              </p>
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Daily Quests, Challenges, Upcoming Web MIDI preview */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Daily Quests Panel */}
          <div id="daily-missions-panel" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold text-brand-text flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-warning" />
                  Missões Diárias
                </h3>
                <p className="text-xs text-brand-muted">Reseta em 18 horas</p>
              </div>
              <span className="text-xs font-mono bg-white/5 text-brand-muted px-2 py-1 rounded">2/3 Concluídos</span>
            </div>

            {/* List of daily missions */}
            <div className="space-y-4">
              {dailyMissions.map((mission) => {
                // Determine if completed (let's simulate progress or completed)
                const isCompleted = mission.completed;
                return (
                  <div 
                    key={mission.id} 
                    id={`mission-${mission.id}`}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted 
                        ? "bg-brand-success/5 border-brand-success/20" 
                        : "bg-brand-bg border-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-brand-text">{mission.title}</span>
                        <p className="text-xs text-brand-muted leading-normal">{mission.description}</p>
                      </div>
                      
                      <span className="text-xs font-mono text-brand-accent font-semibold shrink-0">
                        +{mission.xpReward} XP
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      {/* Quest mini progress bar */}
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isCompleted ? "bg-brand-success" : "bg-brand-primary"}`}
                          style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-brand-muted shrink-0">
                        {mission.progress}/{mission.target}
                      </span>
                    </div>

                    {isCompleted && (
                      <button
                        onClick={() => onClaimMissionReward(mission.id, mission.xpReward)}
                        className="mt-3 w-full bg-brand-success hover:bg-brand-success/90 text-brand-bg font-bold text-xs py-1.5 rounded transition-colors"
                      >
                        Resgatar +{mission.xpReward} XP
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Web MIDI Connection Status & Interactive Simulation Teaser */}
          <div id="midi-concept-panel" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-mono font-medium text-brand-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-success animate-ping"></span>
                Web MIDI Status
              </h3>
              <span className="bg-white/5 text-[9px] font-mono text-brand-muted px-1.5 py-0.5 rounded uppercase">
                Hardware Link
              </span>
            </div>

            <div className="bg-brand-bg p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-text">Dispositivo Reconhecido:</span>
                <span className="text-xs font-mono font-bold text-brand-primary">Roland V-Drums (TD-17)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-text">Latência Estimada:</span>
                <span className="text-xs font-mono text-brand-success">1.8 ms (Excelente)</span>
              </div>
              <p className="text-[11px] text-brand-muted">
                Conecte seu cabo USB Host ou interface MIDI. O DrumQuest mapeia automaticamente bumbo, caixa, tom-toms, chimbal e pratos para avaliar seu tempo em tempo real.
              </p>
            </div>

            <button 
              id="btn-midi-how-to"
              onClick={() => onNavigate("practice", "les-3")} // navigate to a practice/lesson
              className="w-full bg-brand-bg hover:bg-white/5 text-brand-text text-xs font-semibold py-2.5 rounded-lg border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4 text-brand-primary" />
              <span>Ver Simulador de Metrônomo MIDI</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
