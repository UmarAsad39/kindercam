import { useState, useEffect, useRef, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { DetectedObject } from '@/types/app';

export function useObjectDetection(videoRef: React.RefObject<HTMLVideoElement>) {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const isDetecting = useRef(false);

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2'
        });
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load detection model');
        setIsLoading(false);
        console.error('Model loading error:', err);
      }
    };

    loadModel();
  }, []);

  const detect = useCallback(async () => {
    if (!model || !videoRef.current || isDetecting.current) return;
    
    const video = videoRef.current;
    if (video.readyState !== 4) return;

    isDetecting.current = true;

    try {
      const predictions = await model.detect(video);
      
      const filteredDetections: DetectedObject[] = predictions
        .filter(pred => pred.score > 0.5)
        .map(pred => ({
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox as [number, number, number, number]
        }));

      setDetections(filteredDetections);
    } catch (err) {
      console.error('Detection error:', err);
    }

    isDetecting.current = false;
  }, [model, videoRef]);

  const startDetection = useCallback(() => {
    const loop = () => {
      detect();
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, [detect]);

  const stopDetection = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    model,
    isLoading,
    detections,
    error,
    startDetection,
    stopDetection
  };
}
