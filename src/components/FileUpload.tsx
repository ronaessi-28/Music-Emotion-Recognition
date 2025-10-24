import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload = ({ onFileSelect, isLoading }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .mp3 or .wav file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "File uploaded",
      description: `Analyzing ${file.name}...`,
    });

    onFileSelect(file);
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Your Music</h2>
        <p className="text-muted-foreground">
          Choose an audio file (.mp3 or .wav) to analyze its emotional content
        </p>
      </div>

      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-12 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="text-lg font-medium">Analyzing audio...</p>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">MP3 or WAV (max 20MB)</p>
              </div>
              <Button size="lg" className="mt-2">
                Select File
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
