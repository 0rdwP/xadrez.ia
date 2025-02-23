import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import type { InsertAnalysis } from "@shared/schema";
import { Brain, Lightbulb, Trophy, TrendingUp } from "lucide-react";
import { AnalysisBoard } from "./AnalysisBoard";

interface GameAnalysisProps {
  analysis: InsertAnalysis;
  currentMoveIndex: number;
  onMoveChange: (index: number) => void;
  onNewGame: () => void;
}

export function GameAnalysis({ 
  analysis, 
  currentMoveIndex,
  onMoveChange,
  onNewGame 
}: GameAnalysisProps) {
  const chartData = analysis.movesAnalysis.map((move: any) => ({
    name: `${Math.floor(move.moveNumber)}${move.move.includes('#') ? ' ♔' : ''}`,
    avaliação: move.evaluation,
  }));

  const currentMove: any = analysis.movesAnalysis[currentMoveIndex];

  return (
    <Card className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Análise do Jogo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Pontuação</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {Math.round(analysis.playerScore)}%
            </p>
          </Card>

          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Melhores Lances</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {analysis.bestMoves.length}
            </p>
          </Card>

          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Total de Lances</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {analysis.movesAnalysis.length}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Recapitulação da Partida</h3>
            <div className="relative">
              <AnalysisBoard
                moves={analysis.movesAnalysis.map((m: any) => m.move)}
                arrows={currentMove?.arrows || []}
                currentMoveIndex={currentMoveIndex}
                onMoveChange={onMoveChange}
              />

              {currentMove?.quality && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{ backgroundColor: currentMove.quality.color }}
                >
                  <span className="text-xl">{currentMove.quality.emoji}</span>
                  <span className="font-medium capitalize text-white">
                    {currentMove.quality.type}
                  </span>
                </motion.div>
              )}
            </div>

            <Card className="p-4 space-y-2">
              <h4 className="font-medium">Lance Atual: {currentMove?.move}</h4>
              <p className="text-sm text-muted-foreground">
                {currentMove?.tacticalIdea}
              </p>
              {currentMove?.bestAlternatives.length > 0 && (
                <div>
                  <p className="text-sm font-medium mt-2">Melhores Alternativas:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {currentMove.bestAlternatives.map((alt: string, i: number) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Qualidade das Jogadas</h3>
            <Card className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avaliação"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={(props) => {
                        const move = analysis.movesAnalysis[props.index];
                        return (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={move?.move.includes('#') ? 6 : 4}
                            fill={move?.quality.color || "hsl(var(--primary))"}
                          />
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        <Button onClick={onNewGame} className="w-full">
          Iniciar Nova Partida
        </Button>
      </motion.div>
    </Card>
  );
}