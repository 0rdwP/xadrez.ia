import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import type { InsertAnalysis } from "@shared/schema";

interface MoveEvaluation {
  moveNumber: number;
  move: string;
  evaluation: number;
  bestAlternatives: string[];
  tacticalIdea: string;
  arrows: {
    from: string;
    to: string;
    color: string;
  }[];
  quality: {
    type: "brilliant" | "great" | "good" | "inaccuracy" | "mistake" | "blunder";
    emoji: string;
    color: string;
  };
}

const getMoveQuality = (evaluation: number, isCheckmate: boolean = false) => {
  if (isCheckmate) return { type: "brilliant", emoji: "👑", color: "rgba(94, 234, 212, 0.9)" };
  if (evaluation >= 0.9) return { type: "brilliant", emoji: "💫", color: "rgba(94, 234, 212, 0.9)" };
  if (evaluation >= 0.7) return { type: "great", emoji: "⭐", color: "rgba(56, 189, 248, 0.9)" };
  if (evaluation >= 0.5) return { type: "good", emoji: "✨", color: "rgba(52, 211, 153, 0.9)" };
  if (evaluation >= 0.3) return { type: "inaccuracy", emoji: "⚠️", color: "rgba(250, 204, 21, 0.9)" };
  if (evaluation >= 0.1) return { type: "mistake", emoji: "❌", color: "rgba(251, 146, 60, 0.9)" };
  return { type: "blunder", emoji: "💀", color: "rgba(239, 68, 68, 0.9)" };
};

export function useGameAnalysis() {
  const [currentAnalysis, setCurrentAnalysis] = useState<InsertAnalysis | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const analyzeGame = useCallback((moves: string[]) => {
    const game = new Chess();
    const movesAnalysis: MoveEvaluation[] = [];
    let playerScore = 0;
    const bestMoves: {
      moveNumber: number;
      playerMove: string;
      bestMove: string;
      evaluation: number;
    }[] = [];

    moves.forEach((move, index) => {
      // Verificar se é o último movimento e resultou em xeque-mate
      const isLastMove = index === moves.length - 1;
      const moveObj = game.move(move);
      const isCheckmate = game.isCheckmate();

      // Simular avaliação da jogada (em um cenário real, isso seria feito por uma engine de xadrez)
      const evaluation = isCheckmate ? 1 : Math.random() * 2 - 1; // Xeque-mate sempre recebe avaliação máxima

      let tacticalIdea = "";
      let arrows = [];

      if (isCheckmate) {
        tacticalIdea = "Xeque-mate! - Vitória decisiva";
        arrows = [{
          from: moveObj.from,
          to: moveObj.to,
          color: "rgba(255, 215, 0, 0.7)" // Dourado para xeque-mate
        }];
      } else if (moveObj.captured) {
        tacticalIdea = "Captura material - ganho de vantagem material";
        arrows = [{
          from: moveObj.from,
          to: moveObj.to,
          color: "rgba(255, 0, 0, 0.5)"
        }];
      } else if (moveObj.san.includes("+")) {
        tacticalIdea = "Xeque - pressão sobre o rei adversário";
        arrows = [{
          from: moveObj.from,
          to: moveObj.to,
          color: "rgba(255, 165, 0, 0.5)"
        }];
      } else if (moveObj.piece === 'p' && (moveObj.to[1] === '7' || moveObj.to[1] === '2')) {
        tacticalIdea = "Avanço de peão - criando ameaças de promoção";
        arrows = [{
          from: moveObj.from,
          to: moveObj.to,
          color: "rgba(0, 255, 0, 0.5)"
        }];
      } else {
        tacticalIdea = "Movimento posicional - melhorando a posição das peças";
        arrows = [{
          from: moveObj.from,
          to: moveObj.to,
          color: "rgba(0, 0, 255, 0.5)"
        }];
      }

      // Encontrar alternativas melhores (exceto para xeque-mate)
      let bestAlternatives: string[] = [];
      if (!isCheckmate) {
        game.undo();
        const alternatives = game.moves({ verbose: true });
        bestAlternatives = alternatives
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(alt => alt.san);
        game.move(move);
      }

      // Calcular qualidade do movimento
      const quality = getMoveQuality(Math.abs(evaluation), isCheckmate);

      movesAnalysis.push({
        moveNumber: Math.floor(index / 2) + 1,
        move: moveObj.san,
        evaluation,
        bestAlternatives,
        tacticalIdea,
        arrows,
        quality,
      });

      // Atualizar pontuação do jogador
      if (evaluation > 0.5) playerScore += 1;

      // Registrar se foi uma das melhores jogadas
      if (evaluation > 0.7 || isCheckmate) {
        bestMoves.push({
          moveNumber: Math.floor(index / 2) + 1,
          playerMove: moveObj.san,
          bestMove: moveObj.san,
          evaluation,
        });
      }
    });

    // Normalizar a pontuação final (0-100)
    const normalizedScore = (playerScore / moves.length) * 100;

    const analysis: InsertAnalysis = {
      gameId: 1, // Será definido quando integrado com o backend
      playerScore: normalizedScore,
      bestMoves,
      movesAnalysis,
    };

    setCurrentAnalysis(analysis);
    setCurrentMoveIndex(0);
    return analysis;
  }, []);

  return {
    currentAnalysis,
    currentMoveIndex,
    setCurrentMoveIndex,
    analyzeGame,
  };
}