import { useState } from "react";
import { motion } from "motion/react";
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Clock, 
  Award, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen,
  ChevronRight,
  Tv,
  Volume2,
  ListRestart
} from "lucide-react";
import { Lesson, Exercise } from "../types";

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onStartExercise: (exerciseId: string) => void;
}

export default function LessonView({ lesson, onBack, onStartExercise }: LessonViewProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35); // simulated starting progress %

  const handlePlayToggle = () => {
    setIsPlayingVideo(!isPlayingVideo);
  };

  return (
    <div id="lesson-view-root" className="space-y-8 animate-fade-in">
      
      {/* Back navigation and general info */}
      <div id="lesson-nav-header" className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Trilha</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-brand-muted uppercase bg-white/5 px-2 py-1 rounded">
            {lesson.moduleName}
          </span>
          <span className="text-xs font-mono text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded font-bold">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Lesson Hero Details */}
      <div id="lesson-hero-intro" className="space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight text-brand-text">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-xs font-mono text-brand-muted">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Estimativa: {Math.round(lesson.timeSeconds / 60)} min</span>
          <span className="flex items-center gap-1 text-brand-accent"><Award className="w-4 h-4" /> Recompensa: +{lesson.xpReward} XP</span>
        </div>
      </div>

      {/* Main Grid: Left Side Player and Exercise Launch | Right Side Explanation & Mistakes */}
      <div id="lesson-view-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Video Player + Exercises List */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Interactive Simulated Video Player */}
          <div id="lesson-video-player" className="relative aspect-video bg-brand-surface rounded-2xl border border-white/5 overflow-hidden shadow-2xl group">
            
            {/* Visual backdrop placeholder with animated elements */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#11161d] to-[#0d1116] p-6 text-center select-none">
              
              {/* Decorative drum graphic */}
              <div className="w-24 h-24 rounded-full bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mb-4 group-hover:scale-105 transition-transform relative">
                <Volume2 className={`w-8 h-8 text-brand-primary ${isPlayingVideo ? "animate-pulse" : ""}`} />
                {isPlayingVideo && (
                  <>
                    <span className="absolute -inset-2 rounded-full border border-brand-primary/20 animate-ping"></span>
                    {/* Animated sound pulses */}
                    <div className="absolute left-[-20px] bottom-6 flex gap-1 h-8 items-end">
                      <div className="w-1 bg-brand-primary h-4 rounded animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-1 bg-brand-primary h-6 rounded animate-bounce [animation-delay:0.3s]"></div>
                      <div className="w-1 bg-brand-primary h-2 rounded animate-bounce [animation-delay:0.5s]"></div>
                    </div>
                    <div className="absolute right-[-20px] bottom-6 flex gap-1 h-8 items-end">
                      <div className="w-1 bg-brand-primary h-3 rounded animate-bounce [animation-delay:0.4s]"></div>
                      <div className="w-1 bg-brand-primary h-7 rounded animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 bg-brand-primary h-5 rounded animate-bounce [animation-delay:0.6s]"></div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1 max-w-sm">
                <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest font-bold">VÍDEO AULA INTERATIVA</span>
                <h4 className="text-sm font-semibold text-brand-text">Técnica e Demonstração Prática</h4>
                <p className="text-xs text-brand-muted">Assista ao instrutor executando o padrão e entenda a dinâmica corporal.</p>
              </div>

              {/* Play overlays / controls overlay */}
              <div className="absolute inset-0 bg-brand-bg/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={handlePlayToggle}
                  className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-transform cursor-pointer hover:bg-brand-primary/90"
                >
                  {isPlayingVideo ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
              </div>
            </div>

            {/* Simulated Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between gap-4 z-20">
              <button 
                onClick={handlePlayToggle}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
              >
                {isPlayingVideo ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              {/* Progress Slider track */}
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative group/track">
                <div 
                  className="h-full bg-brand-primary rounded-full relative" 
                  style={{ width: `${videoProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover/track:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-white shrink-0">
                {isPlayingVideo ? "01:24" : "00:42"} / 03:00
              </div>
            </div>
          </div>

          {/* Exercises Section with practice triggers */}
          <div id="exercises-list-section" className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-brand-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                Exercícios Desta Aula
              </h3>
              <p className="text-xs text-brand-muted">Clique em Iniciar Prática para abrir o metrônomo interativo e acumular XP.</p>
            </div>

            <div className="space-y-4">
              {lesson.exercises.map((exercise, idx) => (
                <div 
                  key={exercise.id} 
                  id={`exercise-row-${exercise.id}`}
                  className="bg-brand-surface p-5 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-primary/20 transition-all shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-brand-bg border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-brand-muted font-bold">
                        EXERCÍCIO {idx + 1}
                      </span>
                      <span className="text-xs font-mono text-brand-accent">{exercise.bpmDefault} BPM Padrão</span>
                    </div>
                    <h4 className="text-sm font-bold text-brand-text">{exercise.title}</h4>
                    <p className="text-xs text-brand-muted leading-relaxed max-w-lg">{exercise.description}</p>
                    
                    {/* Pattern visualizer ribbon */}
                    <div className="flex items-center gap-2 bg-brand-bg/50 px-3 py-1.5 rounded border border-white/5 w-fit">
                      <span className="text-[10px] font-mono text-brand-muted uppercase">Padrão:</span>
                      <span className="text-xs font-mono text-brand-primary font-bold">{exercise.rhythmPattern}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartExercise(exercise.id)}
                    className="group bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold text-xs px-4 py-3 rounded-lg flex items-center gap-1.5 shrink-0 shadow-lg active:scale-95 transition-all cursor-pointer w-full sm:w-auto text-center justify-center"
                  >
                    <span>Praticar Agora</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Explanation, Objectives, Mistakes and Tips */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Objective Box */}
          <div id="lesson-objective-card" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-sm font-mono font-medium text-brand-muted flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-accent" />
              OBJETIVO DA LIÇÃO
            </h3>
            <p className="text-sm text-brand-text leading-relaxed font-medium">
              "{lesson.objective}"
            </p>
          </div>

          {/* What you will learn */}
          <div id="lesson-learning-points" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-sm font-mono font-medium text-brand-muted uppercase tracking-wider">O que você vai aprender</h3>
            <ul className="space-y-3">
              {lesson.whatYouLearn.map((point, index) => (
                <li key={index} className="flex gap-3 items-start text-xs text-brand-muted leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes Warning */}
          <div id="lesson-common-mistakes" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-sm font-mono font-medium text-brand-warning flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Erros Comuns (Evite!)
            </h3>
            <ul className="space-y-3">
              {lesson.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex gap-3 items-start text-xs text-brand-muted leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-warning shrink-0 mt-1.5" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expert Tips */}
          <div id="lesson-expert-tips" className="bg-brand-surface p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-sm font-mono font-medium text-brand-accent flex items-center gap-2 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              Dicas de Mestre
            </h3>
            <ul className="space-y-3">
              {lesson.tips.map((tip, index) => (
                <li key={index} className="flex gap-3 items-start text-xs text-brand-muted leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
