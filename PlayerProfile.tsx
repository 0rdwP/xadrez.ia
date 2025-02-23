import { Card } from "@/components/ui/card";
import { usePlayerRating } from "@/hooks/usePlayerRating";
import { motion } from "framer-motion";
import { Trophy, Target, Award, TrendingUp, User } from "lucide-react";

interface PlayerProfileProps {
  username: string;
}

export function PlayerProfile({ username }: PlayerProfileProps) {
  const { playerRating, isLoading } = usePlayerRating(username);

  if (isLoading || !playerRating) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-primary/10 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-primary/5 rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-muted-foreground">
              Membro desde {new Date(playerRating.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Rating</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {playerRating.rating}
            </p>
          </Card>

          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Precisão Média</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {Math.round(playerRating.averageAccuracy)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Melhor: {Math.round(playerRating.bestAccuracy)}%
            </p>
          </Card>

          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Taxa de Vitória</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {Math.round((playerRating.winCount / playerRating.gamesPlayed) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {playerRating.winCount} vitórias em {playerRating.gamesPlayed} jogos
            </p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Progresso</h3>
          </div>
          <div className="h-[200px] bg-primary/5 rounded flex items-center justify-center">
            <p className="text-muted-foreground">
              Histórico de partidas em breve
            </p>
          </div>
        </Card>
      </motion.div>
    </Card>
  );
}
