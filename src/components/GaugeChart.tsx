
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

// Define interfaces for our chart data
interface ChartSegment {
  id: string;
  value: number;
  color: string;
  label: string;
}

interface GaugeChartProps {
  score: number;
  maxScore?: number;
  chartData: ChartSegment[];
  className?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  score,
  maxScore = 30,
  chartData,
  className
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const radius = 150;
  const strokeWidth = 35;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate total value of all segments
  const totalValue = chartData.reduce((sum, segment) => sum + segment.value, 0);
  
  // Calculate ratios and positions for each segment
  const gapSize = 0.04 * circumference;
  
  let currentOffset = 0;
  let currentAngle = -90; // Start at top (-90 degrees)
  
  // Score position calculation
  const scoreRatio = score / maxScore;
  const scoreAngle = scoreRatio * 360 - 90;
  const dotPosition = calculatePosition(scoreAngle, normalizedRadius);
  
  const circleStyles = {
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  
  // Process segments to calculate angles for positioning labels
  const segmentsWithAngles = chartData.map((segment) => {
    const segmentRatio = segment.value / totalValue;
    const dashArray = circumference * segmentRatio - gapSize;
    const dashOffset = -currentOffset;
    
    const startAngle = currentAngle;
    currentOffset += dashArray + gapSize;
    
    // Calculate midpoint angle for label positioning
    const midpointAngle = startAngle + (segmentRatio * 360) / 2;
    currentAngle += segmentRatio * 360;
    
    return {
      ...segment,
      dashArray,
      dashOffset,
      startAngle,
      endAngle: currentAngle,
      midpointAngle
    };
  });
  
  return (
    <div ref={chartRef} className={cn("relative flex items-center justify-center w-full max-w-md mx-auto", className)}>
      <div className="absolute top-0 left-0 w-full text-center text-white text-2xl font-bold mb-8">
        OVERALL SCORE
      </div>
      
      <svg width="350" height="350" viewBox="0 0 350 350" className="transform -rotate-90">
        {segmentsWithAngles.map((segment, index) => (
          <circle
            key={segment.id}
            cx="175"
            cy="175"
            r={normalizedRadius}
            fill="transparent"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.dashArray} ${circumference - segment.dashArray}`}
            strokeDashoffset={segment.dashOffset}
            style={circleStyles}
          />
        ))}
      </svg>
      
      <div className="absolute flex flex-col justify-center items-center w-52 h-52 rounded-full bg-gradient-to-b from-gauge-blue/70 to-yellow-200/70 backdrop-blur-sm">
        <div className="flex justify-center items-center w-16 h-16 mb-1">
          <img 
            src="/lovable-uploads/c46fbd78-ebc8-4d17-af8f-c83fb3f5d82e.png" 
            alt="Score Icon" 
            className="w-14 h-14 object-contain"
          />
        </div>
        <div className="text-black/80 text-lg font-semibold">Overall Score</div>
        <div className="text-black text-6xl font-bold mt-1">
          {score}
        </div>
      </div>
      
      <div 
        className="absolute w-3 h-3 rounded-full bg-gauge-blue shadow-lg"
        style={{ 
          left: `${dotPosition.x}px`, 
          top: `${dotPosition.y}px`,
          filter: "drop-shadow(0 0 2px rgba(84, 216, 255, 0.8))",
        }}
      />
      
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
        <line
          x1="175"
          y1="175"
          x2={dotPosition.x}
          y2={dotPosition.y}
          stroke="#54d8ff"
          strokeWidth="2"
          strokeDasharray="5 3"
          style={{ strokeLinecap: "round" }}
        />
      </svg>
      
      {/* Labels positioned next to their segment arcs */}
      {segmentsWithAngles.map((segment) => {
        // Position labels at the middle of each segment and push them outward
        // Adjust rotation to make the text appear properly oriented
        const labelDistance = normalizedRadius + strokeWidth + 20;
        const labelPosition = calculatePosition(segment.midpointAngle, labelDistance);
        
        return (
          <React.Fragment key={`label-${segment.id}`}>
            <div 
              className="absolute flex flex-col items-center pointer-events-none whitespace-nowrap"
              style={{ 
                left: `${labelPosition.x}px`, 
                top: `${labelPosition.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-2xl font-bold" style={{ color: segment.color }}>
                {segment.label}
              </div>
              <div className="text-xl font-bold" style={{ color: segment.color }}>
                {segment.value}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Helper function to calculate x,y coordinates from angle and radius
function calculatePosition(angleDegrees: number, radius: number) {
  // Convert from chart angle (where 0 is at top) to standard angle (where 0 is at right)
  const angleInRadians = ((angleDegrees + 90) * Math.PI) / 180;
  
  const x = 175 + radius * Math.cos(angleInRadians);
  const y = 175 + radius * Math.sin(angleInRadians);
  
  return { x, y };
}

export default GaugeChart;
