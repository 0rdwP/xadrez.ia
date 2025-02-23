import { useState, useCallback } from "react";
import { Chess, Square } from "chess.js";
import { useGameAnalysis } from "./useGameAnalysis";

export type GameMode = "local" | "ai-easy" | "ai-medium" | "ai-hard" | "online";

export function useChessGame(initialMode: GameMode = "local") {
  const [game, setGame] = useState(new Chess());
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const { analyzeGame, currentAnalysis, currentMoveIndex, setCurrentMoveIndex } = useGameAnalysis();

  const calculatePossibleMoves = useCallback((square: Square) => {
    const moves = game.moves({ square, verbose: true });
    setPossibleMoves(moves.map(move => move.to));
  }, [game]);

  const clearPossibleMoves = useCallback(() => {
    setPossibleMoves([]);
  }, []);

  const makeMove = useCallback((from: Square, to: Square) => {
    try {
      const result = game.move({ from, to, promotion: 'q' });
      if (result) {
        setGame(new Chess(game.fen()));
        clearPossibleMoves();
        setMoveHistory(prev => [...prev, result.san]);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [game, clearPossibleMoves]);

  const makeAIMove = useCallback(() => {
    const moves = game.moves();
    if (moves.length > 0) {
      const randomIndex = Math.floor(Math.random() * moves.length);
      const move = game.move(moves[randomIndex]);
      setGame(new Chess(game.fen()));
      setMoveHistory(prev => [...prev, move.san]);
    }
  }, [game]);

  const onPieceClick = useCallback((square: Square) => {
    if (game.get(square) && game.turn() === game.get(square)?.color) {
      calculatePossibleMoves(square);
    }
  }, [game, calculatePossibleMoves]);

  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square) => {
    const moveSuccess = makeMove(sourceSquare, targetSquare);

    if (moveSuccess) {
      if (mode.startsWith('ai-')) {
        setTimeout(makeAIMove, 300);
      }

      // Se o jogo acabou, analisar a partida
      if (game.isGameOver()) {
        analyzeGame(moveHistory);
      }
    }

    return moveSuccess;
  }, [makeMove, makeAIMove, mode, game, moveHistory, analyzeGame]);

  const resetGame = useCallback(() => {
    setGame(new Chess());
    clearPossibleMoves();
    setMoveHistory([]);
  }, [clearPossibleMoves]);

  const changeMode = useCallback((newMode: GameMode) => {
    setMode(newMode);
    resetGame();
  }, [resetGame]);

  return {
    game,
    mode,
    position: game.fen(),
    turn: game.turn(),
    isCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isGameOver: game.isGameOver(),
    possibleMoves,
    moveHistory,
    currentAnalysis,
    currentMoveIndex,
    setCurrentMoveIndex,
    onPieceClick,
    onDrop,
    resetGame,
    changeMode,
  };
}