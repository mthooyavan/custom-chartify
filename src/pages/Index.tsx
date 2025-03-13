
import GaugeChart from "@/components/GaugeChart";

const Index = () => {
  // Chart data with segments for the gauge chart
  const chartData = [
    {
      id: "bad",
      value: 10,
      color: "#ff4d4d",
      label: "BAD"
    },
    {
      id: "good",
      value: 8,
      color: "#2de08a",
      label: "GOOD"
    },
    {
      id: "standard",
      value: 4,
      color: "#ff8f33",
      label: "STANDARD"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <GaugeChart 
          score={26} 
          maxScore={30}
          chartData={chartData}
        />
      </div>
    </div>
  );
};

export default Index;
