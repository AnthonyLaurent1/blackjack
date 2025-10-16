import React from "react";

const PlayerList = ({ players, removePlayer }) => (
  <ul>
    {players.map((p, i) => (
      <li key={i}>
        {p} <button onClick={() => removePlayer(i)}>X</button>
      </li>
    ))}
  </ul>
);

export default PlayerList;
