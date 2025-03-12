import React, { useEffect, useState, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (chartRef.current) {
      observer.observe(chartRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Calculate the circumference
  const radius = 150;
  const strokeWidth = 35;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate the stroke dashoffset based on the score
  const totalScoreSum = badScore + goodScore + standardScore;
  const badRatio = badScore / totalScoreSum;
  const goodRatio = goodScore / totalScoreSum;
  const standardRatio = standardScore / totalScoreSum;
  
  // Calculate the stroke dash array and offset for each segment
  const badDashArray = circumference * badRatio;
  const goodDashArray = circumference * goodRatio;
  const standardDashArray = circumference * standardRatio;
  
  // Calculate starting angles
  const badStartAngle = 0;
  const goodStartAngle = badStartAngle + badRatio * 360;
  const standardStartAngle = goodStartAngle + goodRatio * 360;
  
  // Calculate label positions
  const badLabelPosition = calculateLabelPosition(badStartAngle + badRatio * 360 / 2, radius + 45);
  const goodLabelPosition = calculateLabelPosition(goodStartAngle + goodRatio * 360 / 2, radius + 45);
  const standardLabelPosition = calculateLabelPosition(standardStartAngle + standardRatio * 360 / 2, radius + 45);
  
  // Calculate the dot position based on score
  const scoreRatio = score / maxScore;
  const scoreAngle = scoreRatio * 360 - 90;
  const dotPosition = calculateLabelPosition(scoreAngle, normalizedRadius);
  
  // Calculate path for blue line to dot
  const blueLineEndX = dotPosition.x;
  const blueLineEndY = dotPosition.y;

  // Define the shared styles for the circles with rounded stroke caps
  const circleStyles = {
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    transition: "stroke-dashoffset 1s ease-in-out",
  };
  
  return (
    <div ref={chartRef} className={cn("relative flex items-center justify-center w-full max-w-md mx-auto", className)}>
      <div className="absolute top-0 left-0 w-full text-center text-white text-2xl font-bold mb-8">
        OVERALL SCORE
      </div>
      
      <svg width="350" height="350" viewBox="0 0 350 350" className="transform -rotate-90">
        {/* BAD segment */}
        <circle
          cx="175"
          cy="175"
          r={normalizedRadius}
          fill="transparent"
          stroke="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${badDashArray} ${circumference - badDashArray}`}
          strokeDashoffset="0"
          className={isVisible ? "stroke-gauge-bad animate-circle-progress" : "stroke-gauge-bad"}
          style={{
            ...circleStyles,
            '--initial-offset': `${circumference}`,
            '--target-offset': '0',
          } as React.CSSProperties}
        />
        
        {/* GOOD segment */}
        <circle
          cx="175"
          cy="175"
          r={normalizedRadius}
          fill="transparent"
          stroke="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${goodDashArray} ${circumference - goodDashArray}`}
          strokeDashoffset={-badDashArray}
          className={isVisible ? "stroke-gauge-good animate-circle-progress" : "stroke-gauge-good"}
          style={{
            ...circleStyles,
            '--initial-offset': `${circumference - badDashArray}`,
            '--target-offset': `${-badDashArray}`,
          } as React.CSSProperties}
        />
        
        {/* STANDARD segment */}
        <circle
          cx="175"
          cy="175"
          r={normalizedRadius}
          fill="transparent"
          stroke="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${standardDashArray} ${circumference - standardDashArray}`}
          strokeDashoffset={-(badDashArray + goodDashArray)}
          className={isVisible ? "stroke-gauge-standard animate-circle-progress" : "stroke-gauge-standard"}
          style={{
            ...circleStyles,
            '--initial-offset': `${circumference - badDashArray - goodDashArray}`,
            '--target-offset': `${-(badDashArray + goodDashArray)}`,
          } as React.CSSProperties}
        />
      </svg>
      
      {/* Center circle with gradient and score */}
      <div className="absolute flex flex-col justify-center items-center w-52 h-52 rounded-full bg-gradient-to-b from-gauge-blue/70 to-yellow-200/70 backdrop-blur-sm animate-pulse-gentle">
        <div className="flex justify-center items-center w-16 h-16 mb-1">
          <img 
            src="/lovable-uploads/c46fbd78-ebc8-4d17-af8f-c83fb3f5d82e.png" 
            alt="Score Icon" 
            className="w-14 h-14 object-contain"
          />
        </div>
        <div className="text-black/80 text-lg font-semibold">Overall Score</div>
        <div className="text-black text-6xl font-bold mt-1">
          {isVisible ? (
            <span key={score} className="inline-block animate-scale-in">
              {score}
            </span>
          ) : (
            <span>{score}</span>
          )}
        </div>
      </div>
      
      {/* Blue dot and line */}
      <div 
        className={`absolute w-3 h-3 rounded-full bg-gauge-blue shadow-lg transform translate-x-[${dotPosition.x - 175}px] translate-y-[${dotPosition.y - 175}px] ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ 
          left: `${dotPosition.x}px`, 
          top: `${dotPosition.y}px`,
          filter: "drop-shadow(0 0 2px rgba(84, 216, 255, 0.8))",
        }}
      />
      
      {/* Blue line */}
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
        <line
          x1="175"
          y1="175"
          x2={blueLineEndX}
          y2={blueLineEndY}
          stroke="#54d8ff"
          strokeWidth="2"
          strokeDasharray="5 3"
          className={isVisible ? "animate-fade-in" : "opacity-0"}
          style={{ 
            animationDelay: "0.8s",
            strokeLinecap: "round" 
          }}
        />
      </svg>
      
      {/* Score Labels */}
      {/* BAD Label */}
      <div 
        className="absolute text-white text-xl font-bold"
        style={{ 
          left: `${badLabelPosition.x - 10}px`, 
          top: `${badLabelPosition.y - 25}px`,
        }}
      >
        <div className="flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="text-red-500 mb-1">BAD</div>
          <div className="text-gauge-bad">{badScore}</div>
        </div>
      </div>
      
      {/* GOOD Label */}
      <div 
        className="absolute text-white text-xl font-bold"
        style={{ 
          left: `${goodLabelPosition.x - 10}px`, 
          top: `${goodLabelPosition.y - 25}px`,
        }}
      >
        <div className="flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-green-500 mb-1">GOOD</div>
          <div className="text-gauge-good">{goodScore}</div>
        </div>
      </div>
      
      {/* STANDARD Label */}
      <div 
        className="absolute text-white text-xl font-bold"
        style={{ 
          left: `${standardLabelPosition.x - 15}px`, 
          top: `${standardLabelPosition.y - 25}px`,
        }}
      >
        <div className="flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="text-orange-500 mb-1">STANDARD</div>
          <div className="text-gauge-standard">{standardScore}</div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate position based on angle and radius
function calculateLabelPosition(angleDegrees: number, radius: number) {
  // Convert angle from degrees to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  // Calculate x and y coordinates
  const x = 175 + radius * Math.cos(angleRadians);
  const y = 175 + radius * Math.sin(angleRadians);
  
  return { x, y };
}

export default GaugeChart;
