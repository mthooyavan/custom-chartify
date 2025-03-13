
import GaugeChart from "@/components/GaugeChart";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <GaugeChart score={26} />
      </div>
    </div>
  );
};

export default Index;
