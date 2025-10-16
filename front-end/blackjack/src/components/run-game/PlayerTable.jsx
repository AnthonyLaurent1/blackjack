import React from "react";
import { useNavigate } from "react-router-dom";

const PlayerTable = ({ game, winner, onRoll, onStand }) => {
  const navigate = useNavigate();

  const restart = () => {
    navigate("/"); 
  };

  if (!game) return null;

  return (
    <table className="player-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Score</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {game.players.map((p, i) => {
          const isTurn = game.turn === i && !game.ended && p.score <= 21;
          const isLoose = p.score > 21;
          const isWin = p.score === 21;

          return (
            <tr key={p.id} className={isTurn ? "active-turn" : ""}>
              <td>{p.name}</td>
              <td className={isLoose ? "score-loose" : isWin ? "score-win" : ""}>
                {p.score}
              </td>
              <td>
                {isTurn ? (
                  <>
                    <button onClick={() => onRoll(p.id)}>Roll</button>
                    <button onClick={() => onStand(p.id)}>Stand</button>
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      {game.ended && (
        <tfoot>
          <tr>
            <td colSpan={3}>
              {winner?.winners.length
                ? `Gagnant: ${winner.winners.join(", ")}`
                : "Personne n'a gagné"}
              <br />
              <button onClick={restart}>
                Nouvelle partie
              </button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default PlayerTable;