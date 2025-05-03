export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="loading-indicator">
        <span className="material-icons text-6xl text-primary">refresh</span>
      </div>
      <p className="mt-4 text-lg text-neutral-dark">Loading weather data...</p>
    </div>
  );
}
