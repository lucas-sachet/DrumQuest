import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GitFork, 
  Sparkles, 
  Lock, 
  Unlock, 
  ChevronRight, 
  Award, 
  Check, 
  BookOpen, 
  Flame, 
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  Workflow
} from "lucide-react";
import { UserProfile, SkillNode } from "../types";

interface SkillTreeViewProps {
  profile: UserProfile;
  onUpgradeSkill: (skillId: string, costXp: number) => void;
}

export default function SkillTreeView({ profile, onUpgradeSkill }: SkillTreeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedSkillId, setSelectedSkillId] = useState<string>(profile.skills[0].id);

  const categories = [
    "Todos",
    "Tempo",
    "Coordenação",
    "Rudimentos",
    "Grooves",
    "Independência",
    "Dinâmica",
    "Leitura",
    "Técnica"
  ];

  // Filtering skills based on selection
  const filteredSkills = profile.skills.filter(s => 
    selectedCategory === "Todos" ? true : s.category === selectedCategory
  );

  const selectedSkill = profile.skills.find(s => s.id === selectedSkillId) || profile.skills[0];

  // Check if a skill can be upgraded
  const canUpgrade = (skill: SkillNode): { allowed: boolean; reason?: string } => {
    if (profile.xp < skill.xpCost) {
      return { allowed: false, reason: `Falta XP (Você possui ${profile.xp} de ${skill.xpCost} XP necessários)` };
    }
    if (skill.level >= skill.maxLevel) {
      return { allowed: false, reason: "Habilidade já alcançou o nível máximo!" };
    }
    
    // Check dependencies
    if (skill.dependencies.length > 0) {
      for (const depId of skill.dependencies) {
        const depSkill = profile.skills.find(s => s.id === depId);
        if (depSkill && depSkill.level < 1) {
          return { allowed: false, reason: `Bloqueado. Requer desbloquear primeiro: "${depSkill.name}"` };
        }
      }
    }

    return { allowed: true };
  };

  const upgradeStatus = canUpgrade(selectedSkill);

  const handleUpgradeClick = () => {
    if (upgradeStatus.allowed) {
      onUpgradeSkill(selectedSkill.id, selectedSkill.xpCost);
    }
  };

  return (
    <div id="skill-tree-root" className="space-y-8 animate-fade-in">
      
      {/* Skill Tree Header */}
      <div id="skill-tree-header" className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold tracking-tight text-brand-text flex items-center gap-2">
            <Workflow className="w-8 h-8 text-brand-accent animate-pulse-slow" />
            Árvore de Habilidades
          </h1>
          <p className="text-sm text-brand-muted max-w-xl">
            Invista seus pontos de XP recebidos ao treinar para desbloquear novas habilidades e aumentar sua proficiência passiva.
          </p>
        </div>

        {/* Available currency display */}
        <div className="bg-brand-surface p-4 rounded-xl border border-white/5 flex items-center gap-4 shadow-lg shrink-0">
          <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-brand-muted uppercase">XP Disponível</div>
            <div className="text-lg font-bold text-brand-text font-mono flex items-center gap-1.5">
              <span>{profile.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div id="skill-category-filters" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat 
                ? "bg-brand-accent text-white shadow-md shadow-brand-accent/15 border border-brand-accent/20" 
                : "bg-brand-surface hover:bg-brand-surface/80 text-brand-muted hover:text-brand-text border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Double Column Layout: Visual Nodes (Left 7) | Inspector Node Details (Right 5) */}
      <div id="skill-tree-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Nodes Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const isSelected = skill.id === selectedSkillId;
              const hasLevels = skill.level > 0;
              const isLocked = !skill.isUnlocked && skill.dependencies.length > 0 && 
                profile.skills.find(s => s.id === skill.dependencies[0])?.level === 0;

              return (
                <motion.div
                  layout
                  key={skill.id}
                  id={`skill-node-${skill.id}`}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden select-none ${
                    isSelected 
                      ? "bg-brand-surface border-brand-accent shadow-xl shadow-brand-accent/5 ring-1 ring-brand-accent" 
                      : isLocked 
                        ? "bg-brand-surface/20 border-white/5 opacity-40"
                        : "bg-brand-surface hover:bg-brand-surface/80 border-white/10"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted">
                      <span>{skill.category.toUpperCase()}</span>
                      {hasLevels ? (
                        <span className="text-brand-success font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Lvl {skill.level}/{skill.maxLevel}
                        </span>
                      ) : isLocked ? (
                        <span className="text-brand-warning flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Bloqueada
                        </span>
                      ) : (
                        <span className="text-brand-primary font-bold flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          Desbloqueada
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-brand-text line-clamp-1">{skill.name}</h4>
                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">{skill.description}</p>
                  </div>

                  {/* Node bottom stats (xp upgrade cost) */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-brand-muted">Custo Upgrade</span>
                    <span className="text-brand-accent font-bold">-{skill.xpCost} XP</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Side: Inspector Panel */}
        <div className="lg:col-span-5 bg-brand-surface p-6 rounded-2xl border border-white/10 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl"></div>

          {/* Icon Category Header */}
          <div className="space-y-1 relative z-10 text-left border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
              INSPETOR DE TALENTOS
            </span>
            <h3 className="text-xl font-display font-bold text-brand-text">{selectedSkill.name}</h3>
            <p className="text-xs text-brand-muted">Disciplina: {selectedSkill.category}</p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-brand-bg p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-brand-muted uppercase">Descrição da Habilidade</span>
              <p className="text-xs text-brand-muted leading-relaxed">
                {selectedSkill.description}
              </p>
            </div>

            {/* Level status breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-brand-muted uppercase">Status do Nível</span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center font-display font-black text-2xl text-brand-primary border border-white/5">
                  {selectedSkill.level}
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-text">Nível Atual</div>
                  <div className="text-[10px] text-brand-muted">Limite de Proficiência: {selectedSkill.maxLevel}</div>
                </div>
              </div>
            </div>

            {/* Dependency list */}
            {selectedSkill.dependencies.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-brand-muted uppercase">Pré-Requisitos</span>
                <div className="space-y-1.5 text-xs text-brand-muted">
                  {selectedSkill.dependencies.map((depId, idx) => {
                    const depSkill = profile.skills.find(s => s.id === depId);
                    return (
                      <div key={idx} className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-warning"></span>
                        <span>{depSkill?.name} (Nível {depSkill?.level || 0} / {depSkill?.maxLevel})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action upgrade button */}
          <div className="pt-4 border-t border-white/5 text-left space-y-3">
            <button
              onClick={handleUpgradeClick}
              disabled={!upgradeStatus.allowed}
              className={`w-full font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                upgradeStatus.allowed
                  ? "bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/20 active:scale-95"
                  : "bg-white/5 text-brand-muted border border-white/5 cursor-not-allowed"
              }`}
            >
              <span>Aprimorar Habilidade (-{selectedSkill.xpCost} XP)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!upgradeStatus.allowed && (
              <p className="text-[10px] text-brand-warning text-center font-mono font-medium">
                ⚠️ {upgradeStatus.reason}
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
