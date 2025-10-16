import { useState, useEffect } from "react";
import * as api from "../services/apiService";

export const useGame = (gameId) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const g = await api.getGame(gameId);
        setGame(g);

        if (g.ended) {
          const winnerData = await api.getWinner(gameId);
          setWinner(winnerData);
        }
      } catch (err) {
        console.error("Erreur de chargement du jeu :", err);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
    const interval = setInterval(loadGame, 1500);
    return () => clearInterval(interval);
  }, [gameId]);

  const handleRoll = async (playerId) => {
    try {
      await api.roll(playerId);
      const updatedGame = await api.getGame(gameId);
      setGame(updatedGame);

      if (updatedGame.ended) {
        const winnerData = await api.getWinner(gameId);
        setWinner(winnerData);
      }
    } catch (err) {
      console.error("Erreur lors du lancer :", err);
    }
  };

  const handleStand = async (playerId) => {
    try {
      await api.stand(playerId);
      const updatedGame = await api.getGame(gameId);
      setGame(updatedGame);

      if (updatedGame.ended) {
        const winnerData = await api.getWinner(gameId);
        setWinner(winnerData);
      }
    } catch (err) {
      console.error("Erreur lors du stand :", err);
    }
  };

  const isPlayerActive = (player) => {
    return !player.stand && player.score <= 21 && !game?.ended;
  };

  return {
    game,
    loading,
    winner,
    handleRoll,
    handleStand,
    isPlayerActive,
  };
};
