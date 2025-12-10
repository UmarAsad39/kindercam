export type LearningMode = 'preschooler' | 'early-learner';

export interface DetectedObject {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface AppSettings {
  mode: LearningMode;
  ttsEnabled: boolean;
  continuousMode: boolean;
}
