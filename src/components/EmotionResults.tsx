import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Frown, Wind, Zap } from "lucide-react";
import type { PredictionResult } from "@/pages/Index";

interface EmotionResultsProps {
  result: PredictionResult;
}

const emotionConfig = {
  Happy: {
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    icon: Heart,
    description: "Uplifting and joyful",
  },
  Sad: {
    color: "bg-gradient-to-br from-blue-400 to-indigo-600",
    icon: Frown,
    description: "Melancholic and reflective",
  },
  Calm: {
    color: "bg-gradient-to-br from-green-400 to-teal-500",
    icon: Wind,
    description: "Peaceful and relaxing",
  },
  Energetic: {
    color: "bg-gradient-to-br from-red-500 to-pink-600",
    icon: Zap,
    description: "Dynamic and powerful",
  },
};

export const EmotionResults = ({ result }: EmotionResultsProps) => {
  const config = emotionConfig[result.emotion];
  const Icon = config.icon;
  const confidencePercent = (result.confidence * 100).toFixed(1);

  return (
    <Card className="p-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary via-secondary to-accent" />
      
      <div className="relative space-y-6">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            Prediction Result
          </Badge>
          
          <div className="flex justify-center">
            <div className={`${config.color} p-6 rounded-2xl shadow-lg`}>
              <Icon className="h-16 w-16 text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-2">{result.emotion}</h2>
            <p className="text-muted-foreground text-lg">{config.description}</p>
          </div>

          <div className="flex justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{confidencePercent}%</p>
              <p className="text-sm text-muted-foreground">Confidence</p>
            </div>
          </div>
        </div>

        {result.features && (
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border">
            {result.features.tempo && (
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{result.features.tempo.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">BPM</p>
              </div>
            )}
            {result.features.energy !== undefined && (
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{(result.features.energy * 100).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Energy</p>
              </div>
            )}
            {result.features.valence !== undefined && (
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{(result.features.valence * 100).toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Valence</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
