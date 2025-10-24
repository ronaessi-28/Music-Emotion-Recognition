import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash2 } from "lucide-react";
import type { PredictionResult } from "@/pages/Index";

interface HistoryItem {
  id: string;
  fileName: string;
  result: PredictionResult;
  timestamp: number;
}

interface AnalysisHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const AnalysisHistory = ({ history, onSelect, onClear }: AnalysisHistoryProps) => {
  if (history.length === 0) return null;

  const emotionColors = {
    Happy: "from-yellow-400 to-orange-500",
    Sad: "from-blue-400 to-indigo-600",
    Calm: "from-green-400 to-teal-500",
    Energetic: "from-red-500 to-pink-600",
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Recent Analysis</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium truncate flex-1">{item.fileName}</p>
                <Badge className={`bg-gradient-to-r ${emotionColors[item.result.emotion]} text-white border-0`}>
                  {item.result.emotion}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{(item.result.confidence * 100).toFixed(1)}% confidence</span>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
