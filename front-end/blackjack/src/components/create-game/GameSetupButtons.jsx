import React from "react";

const GameSetupButtons = ({ createGame, playersLength }) => {
  if (playersLength === 0) return null;

  return (
    <button
      onClick={createGame}
      className="btn launch-btn"
    >
      {"Lancer la partie"}
    </button>
  );
};

export default GameSetupButtons;
