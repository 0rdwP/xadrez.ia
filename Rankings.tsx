import { PlayerRankings } from "@/components/PlayerRankings";
import { PlayerProfile } from "@/components/PlayerProfile";
import { useState } from "react";

export default function Rankings() {
  // TODO: Implementar sistema de autenticação para pegar o username real
  const [username] = useState("Jogador");

  return (
    <div className="min-h-screen w-full bg-background p-4">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Classificação
        </h1>

        <PlayerProfile username={username} />
        <PlayerRankings />
      </div>
    </div>
  );
}
