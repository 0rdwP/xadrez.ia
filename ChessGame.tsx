import { Card } from "@/components/ui/card";
import { Chessboard } from "@/components/Chessboard";
import { GameControls } from "@/components/GameControls";
import { GameModeSelect } from "@/components/GameModeSelect";
import { GameAnalysis } from "@/components/GameAnalysis";
import { useChessGame } from "@/hooks/useChessGame";

export default function ChessGame() {
  const {
    game,
    mode,
    position,
    turn,
    isCheck,
    isCheckmate,
    isGameOver,
    possibleMoves,
    currentAnalysis,
    currentMoveIndex,
    setCurrentMoveIndex,
    onPieceClick,
    onDrop,
    resetGame,
    changeMode
  } = useChessGame();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Xadrez Online
        </h1>

        {isGameOver && currentAnalysis ? (
          <GameAnalysis 
            analysis={currentAnalysis}
            currentMoveIndex={currentMoveIndex}
            onMoveChange={setCurrentMoveIndex}
            onNewGame={resetGame}
          />
        ) : (
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 flex flex-col gap-4 order-2 lg:order-1">
                <GameModeSelect 
                  currentMode={mode}
                  onModeChange={changeMode}
                />
                <GameControls
                  turn={turn}
                  isCheck={isCheck}
                  isCheckmate={isCheckmate}
                  isGameOver={isGameOver}
                  onReset={resetGame}
                />
              </div>

              <div className="w-full max-w-xl mx-auto order-1 lg:order-2">
                <Chessboard 
                  position={position} 
                  possibleMoves={possibleMoves}
                  onPieceDrop={onDrop}
                  onPieceClick={onPieceClick}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}