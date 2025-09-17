import CountGame from "./CountGame";
const CountWraper = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Multiplayer Count Game
        </h1>
        <CountGame />
      </div>
    </div>
  );
};

export default CountWraper;
