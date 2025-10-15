import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame, addPlayer } from "../services/apiService"; 
import "./home.css";

const Home = () => {
  const [gameName, setGameName] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerInput, setPlayerInput] = useState("");
  const navigate = useNavigate();

  const addPlayerToList = () => {
    if (!playerInput.trim()) return;
    setPlayers([...players, playerInput.trim()]);
    setPlayerInput("");
  };

  const handleCreateGame = async () => {
    if (!gameName.trim() || players.length === 0) {
      return alert("Nom de partie et au moins un joueur requis");
    }

    try {
      const gameData = await createGame(gameName);
      const gameId = gameData.id;

      for (const name of players) {
        await addPlayer(gameId, name);
      }

      navigate(`/game/${gameId}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Créer une partie</h1>

      <input
        placeholder="Nom de la partie"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        className="input-field"
      />

      <h2>Joueurs</h2>
      <ul>
        {players.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <input
        placeholder="Nom du joueur"
        value={playerInput}
        onChange={(e) => setPlayerInput(e.target.value)}
        className="input-field"
      />
      <button onClick={addPlayerToList} className="btn">
        Ajouter joueur
      </button>

      {players.length > 0 && (
        <button onClick={handleCreateGame} className="btn launch-btn">
          Lancer la partie
        </button>
      )}
    </div>
  );
};

export default Home;
