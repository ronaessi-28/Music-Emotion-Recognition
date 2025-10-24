import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PredictionResult } from "@/pages/Index";

interface VisualizationsProps {
  result: PredictionResult;
}

export const Visualizations = ({ result }: VisualizationsProps) => {
  // Mock data for visualizations
  const emotionDistribution = [
    { emotion: "Happy", value: result.emotion === "Happy" ? result.confidence : 0.1 },
    { emotion: "Sad", value: result.emotion === "Sad" ? result.confidence : 0.15 },
    { emotion: "Calm", value: result.emotion === "Calm" ? result.confidence : 0.12 },
    { emotion: "Energetic", value: result.emotion === "Energetic" ? result.confidence : 0.08 },
  ];

  const maxValue = Math.max(...emotionDistribution.map(e => e.value));

  return (
    <Card className="p-8">
      <h3 className="text-2xl font-bold mb-6">Analysis Details</h3>
      
      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="distribution">Emotion Distribution</TabsTrigger>
          <TabsTrigger value="features">Audio Features</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Probability distribution across all emotion categories
          </p>
          {emotionDistribution.map((item) => (
            <div key={item.emotion} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.emotion}</span>
                <span className="text-muted-foreground">
                  {(item.value * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <p className="text-muted-foreground mb-4">
            Key audio features extracted from the track
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">MFCC</h4>
              <p className="text-2xl font-bold">Extracted</p>
              <p className="text-sm text-muted-foreground">
                Mel-Frequency Cepstral Coefficients for timbre analysis
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Chroma</h4>
              <p className="text-2xl font-bold">Analyzed</p>
              <p className="text-sm text-muted-foreground">
                Pitch class representation for harmonic content
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Spectral Centroid</h4>
              <p className="text-2xl font-bold">Computed</p>
              <p className="text-sm text-muted-foreground">
                Brightness measure of the audio spectrum
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Zero Crossing Rate</h4>
              <p className="text-2xl font-bold">Measured</p>
              <p className="text-sm text-muted-foreground">
                Percussiveness indicator from signal changes
              </p>
            </div>
          </div>

          {result.features && (
            <div className="p-6 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold mb-4">Feature Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                {result.features.tempo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo</p>
                    <p className="text-xl font-bold">{result.features.tempo.toFixed(1)} BPM</p>
                  </div>
                )}
                {result.features.energy !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Energy</p>
                    <p className="text-xl font-bold">{(result.features.energy * 100).toFixed(1)}%</p>
                  </div>
                )}
                {result.features.valence !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Valence</p>
                    <p className="text-xl font-bold">{(result.features.valence * 100).toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
