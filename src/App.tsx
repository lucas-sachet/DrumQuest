import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Workflow, 
  BarChart4, 
  Award, 
  Trophy, 
  Clock, 
  Flame, 
  ChevronRight, 
  Sparkles,
  Bot,
  Layers,
  Send,
  X,
  Radio,
  Drum,
  User,
  Heart,
  Volume2
} from "lucide-react";

import { UserProfile, Lesson, Exercise } from "./types";
import { INITIAL_PROFILE } from "./data";

// Sub-components
import Dashboard from "./components/Dashboard";
import Journey from "./components/Journey";
import LessonView from "./components/LessonView";
import PracticeSession from "./components/PracticeSession";
import ResultView from "./components/ResultView";
import ProfileView from "./components/ProfileView";
import StatsView from "./components/StatsView";
import SkillTreeView from "./components/SkillTreeView";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [lastPracticeResults, setLastPracticeResults] = useState<any | null>(null);
  const [grantedXp, setGrantedXp] = useState<number>(0);

  // Coach IA Floating Panel State
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [coachInput, setCoachInput] = useState("");
  const [coachChat, setCoachChat] = useState<Array<{ sender: "user" | "ia"; text: string }>>([
    { sender: "ia", text: "Olá! Eu sou seu Coach IA de Bateria. Pergunte-me qualquer dúvida sobre postura, rudimentos, velocidade ou como evoluir mais rápido no DrumQuest!" }
  ]);

  // Helper to find a lesson by ID
  const findLessonById = (id: string): Lesson | undefined => {
    return profile.modules.flatMap(m => m.lessons).find(l => l.id === id);
  };

  // Helper to find an exercise by ID
  const findExerciseById = (id: string): Exercise | undefined => {
    return profile.modules.flatMap(m => m.lessons).flatMap(l => l.exercises).find(e => e.id === id);
  };

  // Handler for claim mission reward
  const handleClaimMissionReward = (missionId: string, xpReward: number) => {
    setProfile(prev => {
      let newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let newXpNext = prev.xpNextLevel;

      if (newXp >= newXpNext) {
        newXp = newXp - newXpNext;
        newLevel += 1;
        newXpNext = Math.round(newXpNext * 1.2);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNextLevel: newXpNext,
        title: newLevel >= 10 ? "Grão-Mestre das Baquetas" : newLevel >= 5 ? "Guerreiro do Paradiddle" : "Aventureiro das Baquetas"
      };
    });
    
    // Alert user
    alert(`🎉 Missão Reclamada! Você recebeu +${xpReward} XP!`);
  };

  // Handler for skill upgrade
  const handleUpgradeSkill = (skillId: string, costXp: number) => {
    setProfile(prev => {
      if (prev.xp < costXp) return prev;

      const updatedSkills = prev.skills.map(skill => {
        if (skill.id === skillId) {
          const nextLevel = skill.level + 1;
          return {
            ...skill,
            level: nextLevel,
            isUnlocked: true
          };
        }
        return skill;
      });

      // Also unlock dependencies automatically if relevant
      const fullyUpdatedSkills = updatedSkills.map(skill => {
        if (skill.dependencies.includes(skillId)) {
          return { ...skill, isUnlocked: true };
        }
        return skill;
      });

      return {
        ...prev,
        xp: prev.xp - costXp,
        skills: fullyUpdatedSkills
      };
    });
  };

  // Handler to finish practice session
  const handleFinishSession = (results: { 
    accuracy: number; 
    score: number; 
    consistency: number; 
    bpmReached: number; 
    timeSpentSeconds: number; 
  }) => {
    const xpReward = Math.round(results.accuracy * 1.5) + (results.consistency >= 85 ? 50 : 20);
    setGrantedXp(xpReward);
    setLastPracticeResults(results);

    setProfile(prev => {
      let newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let newXpNext = prev.xpNextLevel;

      if (newXp >= newXpNext) {
        newXp = newXp - newXpNext;
        newLevel += 1;
        newXpNext = Math.round(newXpNext * 1.2);
      }

      // Add to practice history (for graph updates)
      const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const currentDayName = dayNames[new Date().getDay()];

      const updatedHistory = prev.history.map(day => {
        if (day.date === currentDayName) {
          return {
            ...day,
            minutes: day.minutes + Math.round(results.timeSpentSeconds / 60),
            completedCount: day.completedCount + 1,
            accuracy: Math.round((day.accuracy + results.accuracy) / 2),
            bpm: Math.max(day.bpm, results.bpmReached)
          };
        }
        return day;
      });

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNextLevel: newXpNext,
        totalPracticeHours: parseFloat((prev.totalPracticeHours + (results.timeSpentSeconds / 3600)).toFixed(1)),
        totalExercisesCompleted: prev.totalExercisesCompleted + 1,
        history: updatedHistory
      };
    });

    setActiveTab("result");
  };

  // Navigates
  const handleNavigate = (view: string, targetId?: string) => {
    if (view === "lesson" && targetId) {
      setSelectedLessonId(targetId);
      setActiveTab("lesson");
    } else if (view === "practice" && targetId) {
      setSelectedExerciseId(targetId);
      // Find matching lesson
      const matchingLesson = profile.modules.flatMap(m => m.lessons).find(l => 
        l.exercises.some(e => e.id === targetId)
      );
      if (matchingLesson) {
        setSelectedLessonId(matchingLesson.id);
      }
      setActiveTab("practice");
    } else {
      setActiveTab(view);
    }
  };

  // Coach IA simulated chat bot answers
  const handleCoachSendMessage = () => {
    if (!coachInput.trim()) return;

    const userMsg = coachInput;
    setCoachChat(prev => [...prev, { sender: "user", text: userMsg }]);
    setCoachInput("");

    // Simulate AI thinking and replying
    setTimeout(() => {
      let iaReply = "Ótima pergunta! Para desenvolver velocidade no toque simples, o segredo é relaxar os dedos e punhos. Pratique 5 minutos por dia a 80 BPM focando em manter a baqueta batendo no mesmo ponto exato do pad.";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes("postura") || lower.includes("costas") || lower.includes("dor")) {
        iaReply = "A postura correta evita lesões rítmicas. Sente-se na beira do banco com as coxas paralelas ao chão (ângulo ligeiramente maior de 90 graus para aliviar a lombar). Mantenha as costas eretas e os ombros totalmente soltos.";
      } else if (lower.includes("paradiddle") || lower.includes("rudimento")) {
        iaReply = "O Paradiddle simples (D E D D - E D E E) ajuda a transitar de forma fluida pelos tambores. Tente acentuar somente o primeiro toque de cada grupo (D e d d E d e e) para dar dinâmica ao som.";
      } else if (lower.includes("velocidade") || lower.includes("rapido") || lower.includes("bpm")) {
        iaReply = "Velocidade é uma consequência do controle e relaxamento. Se você tensionar os músculos, alcançará um teto físico rápido. Pratique a técnica Möller e use o rebote a seu favor para economizar energia.";
      } else if (lower.includes("midi") || lower.includes("bateria eletronica")) {
        iaReply = "O DrumQuest aceita conexões de controladores USB MIDI! Basta plugar sua bateria eletrônica no computador e selecionar a porta. O app detectará bumbos e caixas calculando sua precisão na hora!";
      }

      setCoachChat(prev => [...prev, { sender: "ia", text: iaReply }]);
    }, 800);
  };

  return (
    <div id="app-wrapper" className="min-h-screen bg-brand-bg text-brand-text flex flex-col md:flex-row font-sans relative">
      
      {/* LEFT SIDEBAR (Desktop only) */}
      <aside className="hidden md:flex flex-col w-[260px] bg-brand-surface border-r border-white/5 p-6 shrink-0 h-screen sticky top-0 z-40 select-none">
        {/* Sidebar Logo */}
        <div className="flex items-center gap-3 cursor-pointer mb-10 group" onClick={() => handleNavigate("dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center border border-brand-primary/20 shadow-lg shadow-brand-primary/10 transition-transform group-hover:scale-105">
            <Drum className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-display font-black tracking-tight text-brand-text uppercase block">
              DrumQuest
            </span>
            <span className="text-[9px] font-mono text-brand-accent font-bold uppercase tracking-widest block -mt-1">
              SaaS PROTOTYPE
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <button 
            onClick={() => handleNavigate("dashboard")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all text-sm text-left cursor-pointer ${activeTab === "dashboard" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm" : "text-brand-muted hover:text-brand-text hover:bg-white/5 border border-transparent"}`}
          >
            <span className="text-lg">⊞</span>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => handleNavigate("journey")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all text-sm text-left cursor-pointer ${activeTab === "journey" || activeTab === "lesson" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm" : "text-brand-muted hover:text-brand-text hover:bg-white/5 border border-transparent"}`}
          >
            <span className="text-lg">🛣</span>
            <span>Trilha de Estudos</span>
          </button>
          <button 
            onClick={() => handleNavigate("skills")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all text-sm text-left cursor-pointer ${activeTab === "skills" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm" : "text-brand-muted hover:text-brand-text hover:bg-white/5 border border-transparent"}`}
          >
            <span className="text-lg">🕸</span>
            <span>Habilidades</span>
          </button>
          <button 
            onClick={() => handleNavigate("stats")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all text-sm text-left cursor-pointer ${activeTab === "stats" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm" : "text-brand-muted hover:text-brand-text hover:bg-white/5 border border-transparent"}`}
          >
            <span className="text-lg">📊</span>
            <span>Estatísticas</span>
          </button>
          <button 
            onClick={() => handleNavigate("profile")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all text-sm text-left cursor-pointer ${activeTab === "profile" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm" : "text-brand-muted hover:text-brand-text hover:bg-white/5 border border-transparent"}`}
          >
            <span className="text-lg">👤</span>
            <span>Perfil</span>
          </button>
        </nav>

        {/* AI COACH READY sidebar block */}
        <div 
          onClick={() => setIsCoachOpen(true)}
          className="mt-auto p-4 bg-brand-accent/5 hover:bg-brand-accent/10 rounded-xl border border-brand-accent/15 cursor-pointer transition-all active:scale-98"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-accent mb-1 tracking-wider uppercase">
            <Bot className="w-3.5 h-3.5 animate-bounce" />
            <span>AI COACH READY</span>
          </div>
          <div className="text-[10px] text-brand-muted leading-relaxed">
            IA analisando seu progresso semanal. Clique para obter dicas.
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(155,92,255,0.035),transparent_45%)] overflow-x-hidden">
        
        {/* MOBILE UPPER NAVIGATION BAR */}
        <header id="mobile-header" className="md:hidden sticky top-0 z-40 bg-[#0B0F14]/90 backdrop-blur-md border-b border-white/5 py-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate("dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center border border-brand-primary/20 shadow">
              <Drum className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-display font-black tracking-tight text-brand-text uppercase">
              DrumQuest
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-brand-surface px-2.5 py-1 rounded-md border border-white/5 text-[10px] font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 text-brand-warning animate-pulse-slow" />
              <span>{profile.streakDays}d</span>
            </div>
            <button
              onClick={() => setIsCoachOpen(true)}
              className="bg-brand-accent/15 hover:bg-brand-accent/25 border border-brand-accent/30 text-brand-accent px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow"
            >
              <Bot className="w-3.5 h-3.5 animate-bounce" />
              <span>Coach IA</span>
            </button>
          </div>
        </header>

        {/* DESKTOP TOP BAR */}
        <header id="desktop-top-bar" className="hidden md:flex h-20 border-b border-white/5 items-center justify-between px-8 bg-brand-bg/20 backdrop-blur-xs select-none">
          <div>
            <h1 className="text-xl font-bold font-sans text-brand-text">
              Olá, {profile.name}! 👋
            </h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Pronto para evoluir o seu groove hoje?
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-brand-surface/40 px-3.5 py-1.5 rounded-full border border-white/5 text-xs font-mono font-semibold">
              <span className="text-brand-warning font-semibold">🔥 {profile.streakDays} DIAS</span>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-brand-muted uppercase tracking-wider">NÍVEL {profile.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[180px] h-2 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, (profile.xp / profile.xpNextLevel) * 100))}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-brand-muted tracking-tight">
                  {profile.xp.toLocaleString()} / {profile.xpNextLevel.toLocaleString()} XP
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent border-2 border-brand-surface shrink-0 shadow-lg shadow-brand-accent/10" />
          </div>
        </header>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 p-4 md:p-8 relative z-10 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              {activeTab === "dashboard" && (
                <Dashboard 
                  profile={profile} 
                  onNavigate={handleNavigate}
                  onClaimMissionReward={handleClaimMissionReward}
                />
              )}

              {activeTab === "journey" && (
                <Journey 
                  profile={profile} 
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === "lesson" && selectedLessonId && (
                <LessonView 
                  lesson={findLessonById(selectedLessonId)!}
                  onBack={() => handleNavigate("journey")}
                  onStartExercise={(exId) => handleNavigate("practice", exId)}
                />
              )}

              {activeTab === "practice" && selectedExerciseId && (
                <PracticeSession 
                  exercise={findExerciseById(selectedExerciseId)!}
                  lesson={findLessonById(selectedLessonId!)!}
                  onBack={() => handleNavigate("lesson", selectedLessonId!)}
                  onFinishSession={handleFinishSession}
                />
              )}

              {activeTab === "result" && lastPracticeResults && (
                <ResultView 
                  results={lastPracticeResults}
                  xpGranted={grantedXp}
                  onContinue={() => handleNavigate("journey")}
                  onRestart={() => handleNavigate("practice", selectedExerciseId!)}
                />
              )}

              {activeTab === "skills" && (
                <SkillTreeView 
                  profile={profile}
                  onUpgradeSkill={handleUpgradeSkill}
                />
              )}

              {activeTab === "stats" && (
                <StatsView 
                  profile={profile}
                />
              )}

              {activeTab === "profile" && (
                <ProfileView 
                  profile={profile}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Dynamic bottom telemetry footer */}
        <footer className="mt-auto py-4 px-8 bg-brand-surface/30 border-t border-white/5 flex flex-col xs:flex-row justify-between items-center gap-3 text-xs font-mono select-none">
          <div className="flex flex-wrap items-center gap-4 text-brand-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
              <span>Dispositivo MIDI: <span className="text-brand-text">TD-17 V-Drums</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              <span>Latência: <span className="text-brand-text">3ms</span></span>
            </div>
          </div>
          <div className="text-[10px] text-brand-muted/70 tracking-widest">SYSTEM v.1.0.4-PROTOTYPE</div>
        </footer>
      </div>

      {/* Mobile Sticky Footer Navigation Bar */}
      <footer id="mobile-navigation" className="md:hidden sticky bottom-0 z-40 bg-[#0c1015]/95 backdrop-blur-md border-t border-white/5 py-3 px-4 flex items-center justify-around text-[10px] font-mono text-brand-muted">
        <button 
          onClick={() => handleNavigate("dashboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "dashboard" ? "text-brand-primary" : "hover:text-brand-text"}`}
        >
          <Layers className="w-5 h-5" />
          <span>Início</span>
        </button>
        <button 
          onClick={() => handleNavigate("journey")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "journey" || activeTab === "lesson" ? "text-brand-primary" : "hover:text-brand-text"}`}
        >
          <Compass className="w-5 h-5" />
          <span>Trilha</span>
        </button>
        <button 
          onClick={() => handleNavigate("skills")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "skills" ? "text-brand-primary" : "hover:text-brand-text"}`}
        >
          <Workflow className="w-5 h-5" />
          <span>Árvore</span>
        </button>
        <button 
          onClick={() => handleNavigate("stats")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "stats" ? "text-brand-primary" : "hover:text-brand-text"}`}
        >
          <BarChart4 className="w-5 h-5" />
          <span>Stats</span>
        </button>
        <button 
          onClick={() => handleNavigate("profile")}
          className={`flex flex-col items-center gap-1 cursor-pointer ${activeTab === "profile" ? "text-brand-primary" : "hover:text-brand-text"}`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </button>
      </footer>

      {/* Interactive Coach IA Floating Panel */}
      <AnimatePresence>
        {isCoachOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          >
            {/* Close touch container */}
            <div className="flex-1" onClick={() => setIsCoachOpen(false)} />

            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-md bg-brand-surface h-full border-l border-white/5 flex flex-col justify-between shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-brand-bg/50">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-brand-accent/15 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text flex items-center gap-1">
                      <span>Coach IA DrumQuest</span>
                      <span className="bg-brand-accent/20 text-[8px] font-mono font-bold text-brand-accent px-1.5 py-0.5 rounded tracking-wide uppercase">
                        ONLINE
                      </span>
                    </h3>
                    <p className="text-[10px] text-brand-muted">Conselheiro inteligente de percussão</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCoachOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-brand-muted hover:text-brand-text cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-sans">
                {coachChat.map((msg, idx) => {
                  const isIa = msg.sender === "ia";
                  return (
                    <div 
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${isIa ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}
                    >
                      {isIa && (
                        <div className="w-6 h-6 rounded bg-brand-accent/15 border border-brand-accent/20 flex items-center justify-center text-brand-accent text-[10px] shrink-0 mt-0.5">
                          IA
                        </div>
                      )}
                      
                      <div className={`p-3.5 rounded-xl border ${
                        isIa 
                          ? "bg-brand-bg border-white/5 text-brand-muted leading-relaxed" 
                          : "bg-brand-primary border-brand-primary/20 text-white"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions row */}
              <div className="px-5 py-2 overflow-x-auto flex gap-2 scrollbar-none border-t border-white/5 bg-brand-bg/20">
                <button 
                  onClick={() => { setCoachInput("Como melhorar a postura?"); }}
                  className="bg-white/5 hover:bg-white/10 text-[10px] font-mono text-brand-muted hover:text-brand-text px-2.5 py-1 rounded-full border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
                >
                  Postura correta?
                </button>
                <button 
                  onClick={() => { setCoachInput("Qual é o ritmo do Paradiddle?"); }}
                  className="bg-white/5 hover:bg-white/10 text-[10px] font-mono text-brand-muted hover:text-brand-text px-2.5 py-1 rounded-full border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
                >
                  Paradiddle?
                </button>
                <button 
                  onClick={() => { setCoachInput("Como aumentar o BPM e a velocidade?"); }}
                  className="bg-white/5 hover:bg-white/10 text-[10px] font-mono text-brand-muted hover:text-brand-text px-2.5 py-1 rounded-full border border-white/5 whitespace-nowrap cursor-pointer transition-colors"
                >
                  Velocidade?
                </button>
              </div>

              {/* Input section */}
              <div className="p-4 border-t border-white/5 bg-brand-bg/40 flex items-center gap-3">
                <input 
                  type="text"
                  placeholder="Escreva sua dúvida sobre bateria..."
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCoachSendMessage()}
                  className="flex-1 bg-brand-bg rounded-lg border border-white/10 text-xs px-4 py-3 text-brand-text placeholder-brand-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none"
                />
                <button 
                  onClick={handleCoachSendMessage}
                  className="w-10 h-10 rounded-lg bg-brand-accent hover:bg-brand-accent/90 text-white flex items-center justify-center shrink-0 shadow cursor-pointer active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

