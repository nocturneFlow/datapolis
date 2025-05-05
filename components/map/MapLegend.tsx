import { useMapContext } from "@/contexts/map-context";
import { metricOptions } from "@/lib/map-constants";

export default function MapLegend() {
  const { activeMetric, colorScheme, metricMaxValues } = useMapContext();

  // Find the label for the active metric
  const metricLabel =
    metricOptions.find((m) => m.value === activeMetric)?.label || activeMetric;

  // Get the maximum value for this metric
  const maxValue = metricMaxValues[activeMetric] || 10000;

  // Create stops based on the same logic as in MapContainer
  let stops: number[];
  if (maxValue <= 100) {
    stops = [0, maxValue * 0.1, maxValue * 0.25, maxValue * 0.5, maxValue];
  } else if (maxValue <= 1000) {
    stops = [0, maxValue * 0.15, maxValue * 0.4, maxValue * 0.7, maxValue];
  } else {
    stops = [0, maxValue * 0.05, maxValue * 0.2, maxValue * 0.5, maxValue];
  }

  return (
    <div className="pt-2 space-y-4">
      <h4 className="text-xs uppercase tracking-wide font-medium">
        {metricLabel}
      </h4>
      <div className="space-y-2">
        <div
          className="h-3 w-full bg-gradient-to-r"
          style={{
            backgroundImage: `linear-gradient(to right, ${colorScheme.join(
              ", "
            )})`,
          }}
        />
        <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
          {stops.map((stop, index) => (
            <span key={index}>{Math.round(stop)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
