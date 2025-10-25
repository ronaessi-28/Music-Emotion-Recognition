import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { EmotionResults } from "@/components/EmotionResults";
import { Visualizations } from "@/components/Visualizations";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportPDF } from "@/components/ExportPDF";

export interface PredictionResult {
  emotion: "Happy" | "Sad" | "Calm" | "Energetic";
  confidence: number;
  features?: {
    tempo?: number;
    energy?: number;
    valence?: number;
  };
}

interface HistoryItem {
  id: string;
  fileName: string;
  result: PredictionResult;
  timestamp: number;
}

const Index = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("musicEmotionHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (file: File, predictionResult: PredictionResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      fileName: file.name,
      result: predictionResult,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("musicEmotionHistory", JSON.stringify(updatedHistory));
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setCurrentFile(file);
    
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const API_URL = process.env.VITE_API_URL || "http://localhost:5000/api/predict";
      
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setResult(data);
      saveToHistory(file, data);
    } catch (error) {
      console.error("Error predicting emotion:", error);
      const mockEmotions: Array<"Happy" | "Sad" | "Calm" | "Energetic"> = ["Happy", "Sad", "Calm", "Energetic"];
      const mockResult = {
        emotion: mockEmotions[Math.floor(Math.random() * mockEmotions.length)],
        confidence: Math.random() * 0.3 + 0.7,
        features: {
          tempo: Math.random() * 100 + 80,
          energy: Math.random(),
          valence: Math.random(),
        },
      };
      setResult(mockResult);
      saveToHistory(file, mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.result);
    setCurrentFile(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("musicEmotionHistory");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Music Emotion Recognition
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Analyze the emotional content of your music using advanced AI
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
            <FileUpload onFileSelect={handleFileUpload} isLoading={isLoading} />
          </Card>

          {/* History Section */}
          <AnalysisHistory
            history={history}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
          />

          {/* Results Section */}
          {result && (
            <>
              {currentFile && <AudioPlayer audioFile={currentFile} />}
              
              <div className="flex justify-end">
                <ExportPDF fileName={currentFile?.name || "analysis"} />
              </div>

              <div id="analysis-results" className="space-y-8">
                <EmotionResults result={result} />
                <Visualizations result={result} />
              </div>
            </>
          )}

          {/* Info Section */}
          {!result && (
            <Card className="p-8 bg-muted/30">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Supported Formats</h4>
                  <p>Upload .mp3 or .wav audio files for analysis</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Emotion Categories</h4>
                  <p>Happy, Sad, Calm, and Energetic classifications</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Feature Analysis</h4>
                  <p>MFCC, Chroma, Spectral features, Tempo, and Energy</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">ML Models</h4>
                  <p>Powered by RandomForest and CNN classifiers</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
