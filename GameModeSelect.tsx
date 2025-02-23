import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Cpu, 
  Brain,
  Zap,
  Wifi 
} from "lucide-react";
import type { GameMode } from "@/hooks/useChessGame";

interface GameModeSelectProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function GameModeSelect({ currentMode, onModeChange }: GameModeSelectProps) {
  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Modo de Jogo</h2>
      
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={currentMode === "local" ? "default" : "outline"}
          className="justify-start"
          onClick={() => onModeChange("local")}
        >
          <Users className="h-4 w-4 mr-2" />
          Local (2 Jogadores)
        </Button>

        <Button
          variant={currentMode === "ai-easy" ? "default" : "outline"}
          className="justify-start"
          onClick={() => onModeChange("ai-easy")}
        >
          <Cpu className="h-4 w-4 mr-2" />
          IA (Fácil)
        </Button>

        <Button
          variant={currentMode === "ai-medium" ? "default" : "outline"}
          className="justify-start"
          onClick={() => onModeChange("ai-medium")}
        >
          <Brain className="h-4 w-4 mr-2" />
          IA (Médio)
        </Button>

        <Button
          variant={currentMode === "ai-hard" ? "default" : "outline"}
          className="justify-start"
          onClick={() => onModeChange("ai-hard")}
        >
          <Zap className="h-4 w-4 mr-2" />
          IA (Difícil)
        </Button>

        <Button
          variant={currentMode === "online" ? "default" : "outline"}
          className="justify-start"
          onClick={() => onModeChange("online")}
          disabled
        >
          <Wifi className="h-4 w-4 mr-2" />
          Online (Em breve)
        </Button>
      </div>
    </Card>
  );
}
