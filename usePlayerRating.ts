import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { PlayerRating, PlayerPerformance } from '@shared/schema';

interface RatingCalculationResult {
  ratingChange: number;
  newRating: number;
}

export function usePlayerRating(username: string) {
  const [currentRating, setCurrentRating] = useState<PlayerRating | null>(null);

  // Buscar classificação do jogador
  const { data: playerRating } = useQuery<PlayerRating>({
    queryKey: [`/api/players/${username}/rating`],
  });

  // Calcular mudança de rating baseado na performance
  const calculateRatingChange = (accuracy: number, isWin: boolean): RatingCalculationResult => {
    const baseChange = isWin ? 32 : -16;
    const accuracyBonus = Math.floor((accuracy - 50) / 10);
    const ratingChange = Math.max(-32, Math.min(48, baseChange + accuracyBonus));
    
    const currentRatingValue = currentRating?.rating || 1200;
    const newRating = currentRatingValue + ratingChange;

    return {
      ratingChange,
      newRating,
    };
  };

  // Mutation para atualizar o rating após uma partida
  const updateRatingMutation = useMutation({
    mutationFn: async (performance: {
      accuracy: number;
      isWin: boolean;
      gameId: number;
    }) => {
      const { ratingChange, newRating } = calculateRatingChange(
        performance.accuracy,
        performance.isWin
      );

      await apiRequest('POST', `/api/players/${username}/performance`, {
        ...performance,
        ratingChange,
      });

      return { ratingChange, newRating };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/players/${username}/rating`] });
    },
  });

  const updateRating = useCallback(
    async (accuracy: number, isWin: boolean, gameId: number) => {
      return updateRatingMutation.mutate({ accuracy, isWin, gameId });
    },
    [updateRatingMutation]
  );

  return {
    playerRating,
    updateRating,
    isLoading: updateRatingMutation.isPending,
  };
}
