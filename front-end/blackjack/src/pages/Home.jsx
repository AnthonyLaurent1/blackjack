import React from "react";
import { useGameSetup } from "../hooks/useGameSetup";
import PlayerList from "../components/create-game/PlayerList";
import PlayerInput from "../components/create-game/PlayerInput";
import GameSetupButtons from "../components/create-game/GameSetupButtons";
import "../styles/home.css";

const Home = () => {
  const {
    gameName,
    setGameName,
    players,
    playerInput,
    setPlayerInput,
    addPlayerToList,
    removePlayerFromList,
    createGame,
  } = useGameSetup();

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
      <PlayerList players={players} removePlayer={removePlayerFromList} />

      <PlayerInput
        playerInput={playerInput}
        setPlayerInput={setPlayerInput}
        addPlayer={addPlayerToList}
      />

      <GameSetupButtons
        createGame={createGame}
        playersLength={players.length}
      />
    </div>
  );
};

export default Home;
