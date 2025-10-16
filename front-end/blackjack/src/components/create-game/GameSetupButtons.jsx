import React from "react";

const GameSetupButtons = ({ handleCreateGame, playersLength }) => {
  if (playersLength === 0) return null;

  return (
    <button
      onClick={handleCreateGame}
      className="btn launch-btn"
    >
      {"Lancer la partie"}
    </button>
  );
};

export default GameSetupButtons;
