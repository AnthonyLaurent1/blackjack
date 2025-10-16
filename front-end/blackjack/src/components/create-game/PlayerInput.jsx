import React from "react";

const PlayerInput = ({ playerInput, setPlayerInput, addPlayer, disabled }) => (
  <div className="player-input">
    <input
      placeholder="Nom du joueur"
      value={playerInput}
      onChange={(e) => setPlayerInput(e.target.value)}
      className="input-field"
    />
    <button onClick={addPlayer} className="btn" disabled={disabled}>
      Ajouter joueur
    </button>
  </div>
);

export default PlayerInput;
