import { LearningMode } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Baby, GraduationCap, Sparkles } from 'lucide-react';
interface ModeSelectorProps {
  onSelectMode: (mode: LearningMode) => void;
}
export function ModeSelector({
  onSelectMode
}: ModeSelectorProps) {
  return <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-6">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-sunshine rounded-full opacity-60 animate-float" />
      <div className="absolute top-20 right-16 w-10 h-10 bg-coral rounded-full opacity-50 animate-bounce-slow" />
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-lavender rounded-full opacity-50 animate-float" style={{
      animationDelay: '1s'
    }} />
      <div className="absolute bottom-20 right-24 w-8 h-8 bg-grass rounded-full opacity-60 animate-bounce-slow" style={{
      animationDelay: '0.5s'
    }} />

      {/* Logo and Title */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-card rounded-3xl shadow-card mb-6 animate-wiggle">
          <span className="text-5xl">📸</span>
        </div>
        <h1 className="text-5xl font-black text-foreground mb-3 tracking-tight">
          KinderCam
        </h1>
        <p className="text-xl text-muted-foreground font-semibold">
          Point, discover, and learn!
        </p>
      </div>

      {/* Mode Selection */}
      <div className="w-full max-w-md space-y-4 animate-slide-up" style={{
      animationDelay: '0.2s'
    }}>
        <p className="text-center text-muted-foreground font-semibold mb-6">
          Choose your learning mode:
        </p>

        {/* Preschooler Mode */}
        <button onClick={() => onSelectMode('preschooler')} className="w-full p-6 bg-card rounded-3xl shadow-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-4 border-transparent hover:border-sunshine group">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-sunshine/20 rounded-2xl flex items-center justify-center group-hover:bg-sunshine/30 transition-colors text-sky-700">
              <Baby className="w-10 h-10 text-accent" />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-foreground">Preschooler</h3>
                <span className="px-2 py-0.5 bg-sunshine/20 rounded-full text-sm font-bold text-accent">
                  Ages 3-5
                </span>
              </div>
              <p className="text-muted-foreground font-medium">
                Voice feedback only, automatic detection
              </p>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-sm text-grass font-semibold">
                  <Sparkles className="w-4 h-4" /> Auto-detect
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
                  🔊 Voice-only
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Early Learner Mode */}
        <button onClick={() => onSelectMode('early-learner')} className="w-full p-6 bg-card rounded-3xl shadow-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-4 border-transparent hover:border-primary group">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-foreground">Early Learner</h3>
                <span className="px-2 py-0.5 bg-primary/20 rounded-full text-sm font-bold text-primary">
                  Ages 6-8
                </span>
              </div>
              <p className="text-muted-foreground font-medium">
                Text descriptions with optional capture
              </p>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-sm text-grass font-semibold">
                  📖 Read & Learn
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
                  📷 Manual capture
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-muted-foreground text-sm font-medium animate-slide-up" style={{
      animationDelay: '0.4s'
    }}>
        Parent/sibling assist mode for guided learning
      </p>
    </div>;
}