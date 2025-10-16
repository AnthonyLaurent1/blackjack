import { useState, useEffect } from "react";
import * as api from "../services/apiService";

export const useGame = (gameId) => {
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null);

  const updateGame = async () => {
    try {
      const g = await api.getGame(gameId);
      setGame(g);
      if (g.ended) {
        const winnerData = await api.getWinner(gameId);
        setWinner(winnerData);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du jeu :", err);
    }
  };

  useEffect(() => {
    updateGame(); 
    const interval = setInterval(updateGame, 1500);
    return () => clearInterval(interval);
  }, [gameId]);

  const action = async (action, playerId) => {
    try {
      await action(playerId);
      await updateGame();
    } catch (err) {
      console.error("Erreur lors de l'action :", err);
    }
  };

  const roll = (playerId) => action(api.roll, playerId);
  const stand = (playerId) => action(api.stand, playerId);

  const isPlayerActive = (player) => !player.stand && player.score <= 21 && !game?.ended;

  return { 
    game, 
    winner,
    roll, 
    stand,
    isPlayerActive
  };

};