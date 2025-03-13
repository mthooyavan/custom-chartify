
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  score: number;
  maxScore?: number;
  badScore?: number;
  goodScore?: number;
  standardScore?: number;
  className?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  score,
  maxScore = 30,
  badScore = 10,
  goodScore = 8,
  standardScore = 4,
  className
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const radius = 150;
  const strokeWidth = 35;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const totalScoreSum = badScore + goodScore + standardScore;
  const badRatio = badScore / totalScoreSum;
  const goodRatio = goodScore / totalScoreSum;
  const standardRatio = standardScore / totalScoreSum;
  
  const gapSize = 0.04 * circumference;
  
  const badDashArray = circumference * badRatio - gapSize;
  const goodDashArray = circumference * goodRatio - gapSize;
  const standardDashArray = circumference * standardRatio - gapSize;
  
  const badOffset = 0;
  const goodOffset = badDashArray + gapSize;
  const standardOffset = goodOffset + goodDashArray + gapSize;
  
  const badStartAngle = 0;
  const goodStartAngle = badStartAngle + badRatio * 360;
  const standardStartAngle = goodStartAngle + goodRatio * 360;
  
  const badLabelPosition = calculateLabelPosition(badStartAngle + badRatio * 360 / 2, radius + 45);
  const goodLabelPosition = calculateLabelPosition(goodStartAngle + goodRatio * 360 / 2, radius + 45);
  const standardLabelPosition = calculateLabelPosition(standardStartAngle + standardRatio * 360 / 2, radius + 45);
  
  const scoreRatio = score / maxScore;
  const scoreAngle = scoreRatio * 360 - 90;
  const dotPosition = calculateLabelPosition(scoreAngle, normalizedRadius);
  
  const blueLineEndX = dotPosition.x;
  const blueLineEndY = dotPosition.y;

  const circleStyles = {
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  
  return (
    <div ref={chartRef} className={cn("relative flex items-center justify-center w-full max-w-md mx-auto", className)}>
      <div className="absolute top-0 left-0 w-full text-center text-white text-2xl font-bold mb-8">
        OVERALL SCORE
      </div>
      
      <svg width="350" height="350" viewBox="0 0 350 350" className="transform -rotate-90">
        <circle
          cx="175"
          cy="175"
          r={normalizedRadius}
          fill="transparent"
          stroke="#ff4d4d"
          strokeWidth={strokeWidth}
          strokeDasharray={`${badDashArray} ${circumference - badDashArray}`}
          strokeDashoffset="0"
          style={circleStyles}
        />
        
        <circle
          cx="175"
          cy="175"
          r={normalizedRadius}
          fill="transparent"
          stroke="#2de08a"
          strokeWidth={strokeWidth}
          strokeDasharray={`${goodDashArray} ${circumference - goodDashArray}`}
          strokeDashoffset={-goodOffset}
          style={circleStyles}
        />
        
        <circle
          cx="175"
          cy="175"
          r={normalizedRadius}
          fill="transparent"
          stroke="#ff8f33"
          strokeWidth={strokeWidth}
          strokeDasharray={`${standardDashArray} ${circumference - standardDashArray}`}
          strokeDashoffset={-standardOffset}
          style={circleStyles}
        />
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
          x2={blueLineEndX}
          y2={blueLineEndY}
          stroke="#54d8ff"
          strokeWidth="2"
          strokeDasharray="5 3"
          style={{ strokeLinecap: "round" }}
        />
      </svg>
      
      <div className="absolute text-white text-xl font-bold"
        style={{ 
          left: `${badLabelPosition.x - 10}px`, 
          top: `${badLabelPosition.y - 25}px`,
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-red-500 mb-1">BAD</div>
          <div className="text-gauge-bad">{badScore}</div>
        </div>
      </div>
      
      <div className="absolute text-white text-xl font-bold"
        style={{ 
          left: `${goodLabelPosition.x - 10}px`, 
          top: `${goodLabelPosition.y - 25}px`,
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-green-500 mb-1">GOOD</div>
          <div className="text-gauge-good">{goodScore}</div>
        </div>
      </div>
      
      <div className="absolute text-white text-xl font-bold"
        style={{ 
          left: `${standardLabelPosition.x - 15}px`, 
          top: `${standardLabelPosition.y - 25}px`,
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-orange-500 mb-1">STANDARD</div>
          <div className="text-gauge-standard">{standardScore}</div>
        </div>
      </div>
      
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
        <line
          x1="175"
          y1="175"
          x2={badLabelPosition.x}
          y2={badLabelPosition.y}
          stroke="#ff4d4d"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1="175"
          y1="175"
          x2={goodLabelPosition.x}
          y2={goodLabelPosition.y}
          stroke="#2de08a"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1="175"
          y1="175"
          x2={standardLabelPosition.x}
          y2={standardLabelPosition.y}
          stroke="#ff8f33"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
};

function calculateLabelPosition(angleDegrees: number, radius: number) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  const x = 175 + radius * Math.cos(angleRadians);
  const y = 175 + radius * Math.sin(angleRadians);
  
  return { x, y };
}

export default GaugeChart;
