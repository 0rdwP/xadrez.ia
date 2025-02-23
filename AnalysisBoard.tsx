import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chess } from "chess.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AnalysisBoardProps {
  moves: string[];
  arrows: {
    from: string;
    to: string;
    color: string;
  }[];
  currentMoveIndex: number;
  onMoveChange: (index: number) => void;
}

export function AnalysisBoard({ moves, arrows, currentMoveIndex, onMoveChange }: AnalysisBoardProps) {
  const [boardWidth, setBoardWidth] = useState(400);

  // Recria o jogo até o lance atual
  const game = new Chess();
  for (let i = 0; i <= currentMoveIndex && i < moves.length; i++) {
    try {
      game.move(moves[i]);
    } catch (e) {
      console.error(`Erro ao recriar movimento ${i}: ${moves[i]}`);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center gap-4">
        <Chessboard
          position={game.fen()}
          boardWidth={boardWidth}
          customBoardStyle={{
            borderRadius: "0.5rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          customDarkSquareStyle={{ backgroundColor: "hsl(var(--primary))" }}
          customLightSquareStyle={{ backgroundColor: "hsl(var(--card))" }}
          customArrows={arrows}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMoveChange && onMoveChange(Math.max(0, currentMoveIndex - 1))}
            disabled={currentMoveIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-[4rem] text-center">
            Lance {Math.floor(currentMoveIndex / 2) + 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onMoveChange && onMoveChange(Math.min(moves.length - 1, currentMoveIndex + 1))}
            disabled={currentMoveIndex === moves.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}