import { DetectedObject } from '@/types/app';
import { getObjectDescription } from '@/lib/objectDescriptions';
import { LearningMode } from '@/types/app';

interface DetectionOverlayProps {
  detections: DetectedObject[];
  videoWidth: number;
  videoHeight: number;
  mode: LearningMode;
}

const colors = [
  'hsl(199, 89%, 48%)', // sky
  'hsl(142, 71%, 45%)', // grass
  'hsl(16, 100%, 66%)', // coral
  'hsl(270, 67%, 70%)', // lavender
  'hsl(45, 100%, 60%)', // sunshine
];

export function DetectionOverlay({ detections, videoWidth, videoHeight, mode }: DetectionOverlayProps) {
  if (detections.length === 0) return null;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${videoWidth} ${videoHeight}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {detections.map((detection, index) => {
        const [x, y, width, height] = detection.bbox;
        const color = colors[index % colors.length];
        const { name } = getObjectDescription(detection.class, mode);
        const confidence = Math.round(detection.score * 100);

        return (
          <g key={`${detection.class}-${index}`}>
            {/* Bounding box */}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill="none"
              stroke={color}
              strokeWidth="4"
              rx="12"
              className="animate-pulse-soft"
            />
            
            {/* Corner accents */}
            <path
              d={`M${x + 15},${y} L${x},${y} L${x},${y + 15}`}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={`M${x + width - 15},${y} L${x + width},${y} L${x + width},${y + 15}`}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={`M${x},${y + height - 15} L${x},${y + height} L${x + 15},${y + height}`}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={`M${x + width - 15},${y + height} L${x + width},${y + height} L${x + width},${y + height - 15}`}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Label background */}
            <rect
              x={x}
              y={y - 40}
              width={Math.max(name.length * 14 + 60, 120)}
              height="36"
              fill={color}
              rx="18"
            />
            
            {/* Label text */}
            <text
              x={x + 16}
              y={y - 16}
              fill="white"
              fontSize="18"
              fontWeight="bold"
              fontFamily="Nunito, sans-serif"
            >
              {name} {confidence}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
