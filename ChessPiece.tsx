import { useCallback } from "react";
import { CustomPiece } from "react-chessboard";
import { Card } from "@/components/ui/card";

interface ChessPieceProps {
  piece: string;
  squareWidth: number;
}

const pieceSymbols: Record<string, string> = {
  'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
  'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
};

export function ChessPiece({ piece, squareWidth }: ChessPieceProps) {
  const renderPiece = useCallback(
    ({ squareWidth }: { squareWidth: number }) => (
      <div
        style={{
          width: squareWidth,
          height: squareWidth,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: squareWidth * 0.7,
          cursor: 'grab',
          userSelect: 'none',
          color: piece.charAt(0) === 'w' ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
          textShadow: piece.charAt(0) === 'w' 
            ? '0 2px 4px rgba(0,0,0,0.1)' 
            : '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease',
        }}
        className="hover:scale-110"
      >
        {pieceSymbols[piece]}
      </div>
    ),
    [piece]
  );

  return (
    <CustomPiece
      piece={piece}
      squareWidth={squareWidth}
    >
      {renderPiece}
    </CustomPiece>
  );
}
