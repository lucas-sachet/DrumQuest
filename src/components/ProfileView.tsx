import { motion } from "motion/react";
import { 
  Award, 
  Flame, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Calendar,
  Sparkles
} from "lucide-react";
import { UserProfile, Badge, Achievement } from "../types";

interface ProfileViewProps {
  profile: UserProfile;
}

export default function ProfileView({ profile }: ProfileViewProps) {
  // Sorting badges: Unlocked first
  const sortedBadges = [...profile.badges].sort((a, b) => {
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    return 0;
  });

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case "Lendário": return "text-brand-accent border-brand-accent/20 bg-brand-accent/5";
      case "Épico": return "text-brand-warning border-brand-warning/20 bg-brand-warning/5";
      case "Raro": return "text-brand-primary border-brand-primary/20 bg-brand-primary/5";
      default: return "text-brand-muted border-white/5 bg-white/5";
    }
  };

  return (
    <div id="profile-view-root" className="space-y-12 animate-fade-in">
      
      {/* Profile Overview Card */}
      <div id="profile-header-card" className="bg-brand-surface p-8 rounded-2xl border border-white/5 shadow-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative overflow-hidden">
        {/* Abstract glowing graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar frame */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-primary via-brand-accent to-brand-warning p-[3px] shadow-xl">
            <div className="w-full h-full bg-[#11141a] rounded-[13px] flex items-center justify-center font-display font-black text-3xl text-brand-text">
              {profile.name.charAt(0)}
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-brand-text">{profile.name}</h2>
              <span className="bg-brand-primary/20 text-brand-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-primary/20">
                PRO MEMBERSHIP
              </span>
            </div>
            
            <p className="text-sm font-mono text-brand-accent font-semibold">{profile.title}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-brand-muted pt-2">
              <span className="flex items-center gap-1.5 bg-brand-bg/60 px-3 py-1.5 rounded-lg border border-white/5">
                <Flame className="w-4 h-4 text-brand-warning" />
                Streak: {profile.streakDays} dias
              </span>
              <span className="flex items-center gap-1.5 bg-brand-bg/60 px-3 py-1.5 rounded-lg border border-white/5">
                <Clock className="w-4 h-4 text-brand-primary" />
                Total: {profile.totalPracticeHours}h
              </span>
            </div>
          </div>
        </div>

        {/* Level and XP visual bar */}
        <div className="relative z-10 w-full md:w-80 space-y-3 bg-brand-bg/40 p-5 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-brand-muted uppercase">Level {profile.level}</span>
            <span className="text-brand-text font-bold">{profile.xp} / {profile.xpNextLevel} XP</span>
          </div>

          <div className="h-2 bg-brand-bg rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-warning rounded-full"
              style={{ width: `${(profile.xp / profile.xpNextLevel) * 100}%` }}
            />
          </div>

          <p className="text-[10px] font-mono text-brand-muted text-center uppercase tracking-wide">
            Suba de nível para desbloquear bônus passivos
          </p>
        </div>
      </div>

      {/* Main Grid: Badges (Left) vs Achievements (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Badges List (Medalhas de Conquista) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-brand-text flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-accent" />
              Medalhas & Badges
            </h3>
            <p className="text-xs text-brand-muted">Consiga pontuações altas e complete desafios para desbloquear.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {sortedBadges.map((badge) => {
              const isUnlocked = !!badge.unlockedAt;
              const styleClass = getRarityStyle(badge.rarity);
              
              return (
                <div 
                  key={badge.id}
                  id={`badge-card-${badge.id}`}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center justify-between gap-4 transition-all ${
                    isUnlocked 
                      ? "bg-brand-surface/80 border-white/10 hover:border-brand-primary/20" 
                      : "bg-brand-surface/20 border-white/5 opacity-40"
                  }`}
                >
                  {/* Badge Icon Frame */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center relative ${styleClass}`}>
                    {isUnlocked ? (
                      <Trophy className="w-6 h-6 text-brand-warning" />
                    ) : (
                      <Lock className="w-5 h-5 text-brand-muted" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-brand-text leading-tight">{badge.name}</div>
                    <p className="text-[10px] text-brand-muted leading-tight">{badge.description}</p>
                  </div>

                  <div className="w-full pt-2 border-t border-white/5 flex justify-between items-center text-[8px] font-mono">
                    <span className={`px-1.5 py-0.5 rounded ${styleClass}`}>
                      {badge.rarity}
                    </span>
                    <span className="text-brand-muted">
                      {isUnlocked ? badge.unlockedAt : "Bloqueado"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Achievements Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-brand-text flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              Lista de Conquistas (Achievements)
            </h3>
            <p className="text-xs text-brand-muted">Missões de longo prazo com grandes recompensas de XP.</p>
          </div>

          <div className="space-y-4">
            {profile.achievements.map((achievement) => {
              const isDone = achievement.isUnlocked;
              return (
                <div 
                  key={achievement.id}
                  id={`achievement-card-${achievement.id}`}
                  className={`p-5 rounded-xl border flex flex-col gap-4 transition-all ${
                    isDone 
                      ? "bg-brand-success/5 border-brand-success/20" 
                      : "bg-brand-surface border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start text-left">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${
                        isDone 
                          ? "bg-brand-success/10 border-brand-success/20 text-brand-success" 
                          : "bg-brand-bg border-white/5 text-brand-muted"
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Calendar className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-brand-text">{achievement.name}</h4>
                        <p className="text-xs text-brand-muted leading-relaxed">{achievement.description}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-brand-accent shrink-0 flex items-center gap-0.5">
                      <Zap className="w-3.5 h-3.5 fill-current text-brand-warning" />
                      +{achievement.xpReward} XP
                    </span>
                  </div>

                  {/* Achievement progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted">
                      <span>Progresso da Conquista</span>
                      <span>
                        {isDone ? achievement.maxProgress : achievement.progress} / {achievement.maxProgress}
                      </span>
                    </div>

                    <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isDone ? "bg-brand-success" : "bg-brand-primary"}`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
