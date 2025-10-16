import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/apiService";

export const useGameSetup = () => {
  const [gameName, setGameName] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerInput, setPlayerInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addPlayerToList = () => {
    const name = playerInput.trim();
    if (!name) return;
    setPlayers((prev) => [...prev, name]);
    setPlayerInput("");
  };

  const removePlayerFromList = (index) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateGame = () => {
    if (!gameName.trim() || players.length < 2) {
      alert("Nom de partie et au moins 2 joueurs requis");
      return;
    }

    setLoading(true);

    new Promise((resolve, reject) => {
      api.createGame(gameName)
        .then((gameData) => {
          const gameId = gameData.id;
          const playerPromises = players.map((p) => api.addPlayer(gameId, p));
          Promise.all(playerPromises)
            .then(() => resolve(gameId))
            .catch(reject);
        })
        .catch(reject);
    })
      .then((gameId) => {
        navigate(`/game/${gameId}`);
      })
      .catch((err) => {
        console.error("Erreur création partie:", err);
        alert("Impossible de créer la partie.");
      })
      .finally(() => setLoading(false));
  };

  return {
    gameName,
    setGameName,
    players,
    playerInput,
    setPlayerInput,
    addPlayerToList,
    removePlayerFromList,
    handleCreateGame,
    loading,
  };
};
