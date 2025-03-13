
import React, { useRef, useEffect, useState } from "react";
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
  const [dimensions, setDimensions] = useState({ width: 350, height: 350 });
  
  useEffect(() => {
    const updateSize = () => {
      if (chartRef.current) {
        const containerWidth = chartRef.current.clientWidth;
        const size = Math.min(containerWidth, 350);
        setDimensions({ width: size, height: size });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  const radius = dimensions.width * 0.428; // Adjusted to be proportional 
  const strokeWidth = dimensions.width * 0.1; // Adjusted to be proportional
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
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
  
  // Calculate the middle angle of each segment for label positioning
  const badMidAngle = badStartAngle + (badRatio * 360) / 2;
  const goodMidAngle = goodStartAngle + (goodRatio * 360) / 2;
  const standardMidAngle = standardStartAngle + (standardRatio * 360) / 2;
  
  // Position labels a bit further outside the chart
  const labelRadius = radius + strokeWidth * 2;
  const badLabelPosition = calculateLabelPosition(badMidAngle, labelRadius, centerX, centerY);
  const goodLabelPosition = calculateLabelPosition(goodMidAngle, labelRadius, centerX, centerY);
  const standardLabelPosition = calculateLabelPosition(standardMidAngle, labelRadius, centerX, centerY);
  
  // Calculate connector line points (midpoint of each segment)
  const badConnector = calculateLabelPosition(badMidAngle, radius, centerX, centerY);
  const goodConnector = calculateLabelPosition(goodMidAngle, radius, centerX, centerY);
  const standardConnector = calculateLabelPosition(standardMidAngle, radius, centerX, centerY);
  
  const scoreRatio = score / maxScore;
  const scoreAngle = scoreRatio * 360 - 90;
  const dotPosition = calculateLabelPosition(scoreAngle, normalizedRadius, centerX, centerY);
  
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
      
      <svg width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="transform -rotate-90">
        <circle
          cx={centerX}
          cy={centerY}
          r={normalizedRadius}
          fill="transparent"
          stroke="#ff4d4d"
          strokeWidth={strokeWidth}
          strokeDasharray={`${badDashArray} ${circumference - badDashArray}`}
          strokeDashoffset="0"
          style={circleStyles}
        />
        
        <circle
          cx={centerX}
          cy={centerY}
          r={normalizedRadius}
          fill="transparent"
          stroke="#2de08a"
          strokeWidth={strokeWidth}
          strokeDasharray={`${goodDashArray} ${circumference - goodDashArray}`}
          strokeDashoffset={-goodOffset}
          style={circleStyles}
        />
        
        <circle
          cx={centerX}
          cy={centerY}
          r={normalizedRadius}
          fill="transparent"
          stroke="#ff8f33"
          strokeWidth={strokeWidth}
          strokeDasharray={`${standardDashArray} ${circumference - standardDashArray}`}
          strokeDashoffset={-standardOffset}
          style={circleStyles}
        />
      </svg>
      
      <div className="absolute flex flex-col justify-center items-center w-1/2 h-1/2 rounded-full bg-gradient-to-b from-gauge-blue/70 to-yellow-200/70 backdrop-blur-sm">
        <div className="flex justify-center items-center w-1/3 h-1/3 mb-1">
          <img 
            src="/lovable-uploads/c46fbd78-ebc8-4d17-af8f-c83fb3f5d82e.png" 
            alt="Score Icon" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-black/80 text-lg font-semibold">Overall Score</div>
        <div className="text-black text-4xl md:text-5xl lg:text-6xl font-bold mt-1">
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
          x1={centerX}
          y1={centerY}
          x2={blueLineEndX}
          y2={blueLineEndY}
          stroke="#54d8ff"
          strokeWidth="2"
          strokeDasharray="5 3"
          style={{ strokeLinecap: "round" }}
        />
      </svg>
      
      {/* Label connectors */}
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
        <line
          x1={centerX}
          y1={centerY}
          x2={badConnector.x}
          y2={badConnector.y}
          stroke="#ff4d4d"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={goodConnector.x}
          y2={goodConnector.y}
          stroke="#2de08a"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={standardConnector.x}
          y2={standardConnector.y}
          stroke="#ff8f33"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        
        {/* Extended connector lines to labels */}
        <line
          x1={badConnector.x}
          y1={badConnector.y}
          x2={badLabelPosition.x}
          y2={badLabelPosition.y}
          stroke="#ff4d4d"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1={goodConnector.x}
          y1={goodConnector.y}
          x2={goodLabelPosition.x}
          y2={goodLabelPosition.y}
          stroke="#2de08a"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <line
          x1={standardConnector.x}
          y1={standardConnector.y}
          x2={standardLabelPosition.x}
          y2={standardLabelPosition.y}
          stroke="#ff8f33"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      </svg>
      
      {/* Labels positioned correctly by their segments */}
      <div 
        className="absolute text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold"
        style={{ 
          left: `${badLabelPosition.x}px`, 
          top: `${badLabelPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-red-500 mb-1">BAD</div>
          <div className="text-gauge-bad">{badScore}</div>
        </div>
      </div>
      
      <div 
        className="absolute text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold"
        style={{ 
          left: `${goodLabelPosition.x}px`, 
          top: `${goodLabelPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-green-500 mb-1">GOOD</div>
          <div className="text-gauge-good">{goodScore}</div>
        </div>
      </div>
      
      <div 
        className="absolute text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold"
        style={{ 
          left: `${standardLabelPosition.x}px`, 
          top: `${standardLabelPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-orange-500 mb-1">STANDARD</div>
          <div className="text-gauge-standard">{standardScore}</div>
        </div>
      </div>
    </div>
  );
};

function calculateLabelPosition(angleDegrees: number, radius: number, centerX: number, centerY: number) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  const x = centerX + radius * Math.cos(angleRadians);
  const y = centerY + radius * Math.sin(angleRadians);
  
  return { x, y };
}

export default GaugeChart;
