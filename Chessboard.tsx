import { useEffect, useState } from "react";
import { Chessboard as ChessboardComponent } from "react-chessboard";
import { Card } from "@/components/ui/card";
import { Square } from "chess.js";

interface ChessboardProps {
  position: string;
  possibleMoves: Square[];
  onPieceDrop: (source: string, target: string) => boolean;
  onPieceClick?: (square: Square) => void;
}

export function Chessboard({ position, possibleMoves, onPieceDrop, onPieceClick }: ChessboardProps) {
  const [boardSize, setBoardSize] = useState(480);

  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 32, 480);
      setBoardSize(width);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Card className="p-2 bg-card">
      <ChessboardComponent
        position={position}
        onPieceDrop={onPieceDrop}
        onSquareClick={onPieceClick}
        boardWidth={boardSize}
        customBoardStyle={{
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
        customDarkSquareStyle={{ backgroundColor: "hsl(var(--primary))" }}
        customLightSquareStyle={{ backgroundColor: "hsl(var(--card))" }}
        customSquareStyles={{
          ...Object.fromEntries(
            possibleMoves.map(square => [
              square,
              {
                background: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                borderRadius: "50%",
              },
            ])
          ),
        }}
      />
    </Card>
  );
}