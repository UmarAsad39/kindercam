import { useEffect, useRef, useState, useCallback } from 'react';
import { LearningMode } from '@/types/app';
import { useCamera } from '@/hooks/useCamera';
import { useObjectDetection } from '@/hooks/useObjectDetection';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { DetectionOverlay } from './DetectionOverlay';
import { ObjectInfoPanel } from './ObjectInfoPanel';
import { getObjectDescription } from '@/lib/objectDescriptions';
import { Button } from './ui/button';
import { ArrowLeft, Camera, Loader2, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  mode: LearningMode;
  onBack: () => void;
}

export function CameraView({ mode, onBack }: CameraViewProps) {
  const { videoRef, isStreaming, error: cameraError, startCamera, stopCamera } = useCamera();
  const { isLoading: modelLoading, detections, error: modelError, startDetection, stopDetection } = useObjectDetection(videoRef);
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [isPaused, setIsPaused] = useState(false);
  const [capturedDetection, setCapturedDetection] = useState<typeof detections[0] | null>(null);
  const lastSpokenObject = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      stopDetection();
    };
  }, [startCamera, stopCamera, stopDetection]);

  // Start detection when streaming
  useEffect(() => {
    if (isStreaming && !modelLoading) {
      startDetection();
    }
  }, [isStreaming, modelLoading, startDetection]);

  // Handle video dimensions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [videoRef]);

  // Auto-speak in preschooler mode
  useEffect(() => {
    if (mode !== 'preschooler' || isPaused || detections.length === 0) return;

    const topDetection = detections[0];
    if (topDetection && topDetection.class !== lastSpokenObject.current) {
      const { name, description } = getObjectDescription(topDetection.class, mode);
      speak(`${name}! ${description}`);
      lastSpokenObject.current = topDetection.class;
    }
  }, [detections, mode, isPaused, speak]);

  const handleManualCapture = useCallback(() => {
    if (detections.length > 0) {
      const topDetection = detections[0];
      setCapturedDetection(topDetection);
      setIsPaused(true);
      stopDetection();
      
      const { name, description } = getObjectDescription(topDetection.class, mode);
      speak(`${name}! ${description}`);
    }
  }, [detections, mode, speak, stopDetection]);

  const handleResume = useCallback(() => {
    setCapturedDetection(null);
    setIsPaused(false);
    lastSpokenObject.current = '';
    startDetection();
  }, [startDetection]);

  const handleSpeak = useCallback(() => {
    const detection = capturedDetection || detections[0];
    if (detection) {
      const { name, description } = getObjectDescription(detection.class, mode);
      speak(`${name}! ${description}`, true);
    }
  }, [capturedDetection, detections, mode, speak]);

  const currentDetection = capturedDetection || (detections.length > 0 ? detections[0] : null);

  // Loading state
  if (modelLoading) {
    return (
      <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-6">
        <div className="bg-card rounded-3xl p-8 shadow-card text-center animate-pulse-soft">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Getting Ready!</h2>
          <p className="text-muted-foreground font-medium">
            Loading the magic detection brain...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (cameraError || modelError) {
    return (
      <div className="min-h-screen gradient-sky flex flex-col items-center justify-center p-6">
        <div className="bg-card rounded-3xl p-8 shadow-card text-center max-w-md">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Oops!</h2>
          <p className="text-muted-foreground font-medium mb-6">
            {cameraError || modelError}
          </p>
          <Button variant="default" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground relative overflow-hidden" ref={containerRef}>
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="bg-card/80 backdrop-blur-lg hover:bg-card"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Mode indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-card/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-soft">
          <span className="font-bold text-sm text-foreground">
            {mode === 'preschooler' ? '👶 Preschooler' : '📚 Early Learner'}
          </span>
        </div>
      </div>

      {/* Video container */}
      <div className="relative w-full h-screen">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />

        {/* Detection overlay */}
        {!isPaused && (
          <DetectionOverlay
            detections={detections}
            videoWidth={videoDimensions.width}
            videoHeight={videoDimensions.height}
            mode={mode}
          />
        )}

        {/* Paused overlay */}
        {isPaused && capturedDetection && (
          <DetectionOverlay
            detections={[capturedDetection]}
            videoWidth={videoDimensions.width}
            videoHeight={videoDimensions.height}
            mode={mode}
          />
        )}
      </div>

      {/* Object info panel */}
      <ObjectInfoPanel
        detection={currentDetection}
        mode={mode}
        isSpeaking={isSpeaking}
        onSpeak={handleSpeak}
        onStopSpeaking={stopSpeaking}
      />

      {/* Manual capture button for early learner mode */}
      {mode === 'early-learner' && !isPaused && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <Button
            variant="sunshine"
            size="icon-lg"
            onClick={handleManualCapture}
            disabled={detections.length === 0}
            className="shadow-glow"
          >
            <Camera className="w-10 h-10" />
          </Button>
        </div>
      )}

      {/* Resume button when paused */}
      {isPaused && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <Button
            variant="grass"
            size="icon-lg"
            onClick={handleResume}
            className="shadow-glow"
          >
            <RefreshCw className="w-10 h-10" />
          </Button>
        </div>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-button animate-pulse-soft">
            <span className="font-bold flex items-center gap-2">
              🔊 Speaking...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
