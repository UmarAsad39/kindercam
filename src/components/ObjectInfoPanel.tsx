import { DetectedObject, LearningMode } from '@/types/app';
import { getObjectDescription } from '@/lib/objectDescriptions';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

interface ObjectInfoPanelProps {
  detection: DetectedObject | null;
  mode: LearningMode;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStopSpeaking: () => void;
}

export function ObjectInfoPanel({ detection, mode, isSpeaking, onSpeak, onStopSpeaking }: ObjectInfoPanelProps) {
  if (!detection) {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-card/90 backdrop-blur-lg rounded-3xl p-6 shadow-card mx-auto max-w-lg">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce-slow">🔍</div>
            <p className="text-muted-foreground font-semibold text-lg">
              Point the camera at something to discover!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { name, description } = getObjectDescription(detection.class, mode);
  const confidence = Math.round(detection.score * 100);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="bg-card/95 backdrop-blur-lg rounded-3xl p-6 shadow-card mx-auto max-w-lg animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-foreground">{name}</h2>
              <span className="px-3 py-1 bg-grass/20 rounded-full text-sm font-bold text-grass">
                {confidence}% sure
              </span>
            </div>
            
            {mode === 'early-learner' && (
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <Button
            variant={isSpeaking ? "coral" : "default"}
            size="icon-lg"
            onClick={isSpeaking ? onStopSpeaking : onSpeak}
            className="shrink-0"
          >
            {isSpeaking ? (
              <VolumeX className="w-8 h-8" />
            ) : (
              <Volume2 className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
