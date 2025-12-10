import { useState } from 'react';
import { LearningMode } from '@/types/app';
import { ModeSelector } from '@/components/ModeSelector';
import { CameraView } from '@/components/CameraView';

const Index = () => {
  const [mode, setMode] = useState<LearningMode | null>(null);

  const handleSelectMode = (selectedMode: LearningMode) => {
    setMode(selectedMode);
  };

  const handleBack = () => {
    setMode(null);
  };

  if (mode) {
    return <CameraView mode={mode} onBack={handleBack} />;
  }

  return <ModeSelector onSelectMode={handleSelectMode} />;
};

export default Index;
