import React from "react";
import { useParams } from "react-router-dom";
import { useGame } from "../hooks/useGame";
import PlayerTable from "../components/run-game/PlayerTable";
import "../styles/game.css";

const Game = () => {
  const { gameId } = useParams();
  const { game, loading, rollMessages, winner, handleRoll, handleStand } = useGame(gameId);

  if (loading) return <div className="game-loading">Chargement...</div>;
  if (!game) return <div className="game-error">Partie non trouvée</div>;

  return (
    <div className="game-container">
      <h1>{game.name}</h1>
      <PlayerTable
        game={game}
        rollMessages={rollMessages}
        winner={winner}
        onRoll={handleRoll}
        onStand={handleStand}
      />
    </div>
  );
};

export default Game;