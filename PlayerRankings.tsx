import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { PlayerRating } from "@shared/schema";
import { Trophy, Users, Target, Award } from "lucide-react";

export function PlayerRankings() {
  const { data: rankings, isLoading } = useQuery<PlayerRating[]>({
    queryKey: ["/api/rankings"],
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-primary/10 rounded w-1/3" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-primary/5 rounded" />
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
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Ranking de Jogadores</h2>
        </div>

        <div className="space-y-4">
          {rankings?.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{player.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        Rating: {player.rating}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{player.gamesPlayed} jogos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{Math.round(player.averageAccuracy)}% precisão</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>
                        {Math.round((player.winCount / player.gamesPlayed) * 100)}% vitórias
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
}
