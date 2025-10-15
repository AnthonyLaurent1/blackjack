const API_URL = "http://localhost:8000/api";

export const createGame = async (gameName) => {
  const res = await fetch(`${API_URL}/game/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: gameName }),
  });

  if (!res.ok) throw new Error("Impossible de créer la partie");
  return res.json();
};


export const addPlayer = async (gameId, playerName) => {
  const res = await fetch(`${API_URL}/game/${gameId}/player/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: playerName }),
  });

  if (!res.ok) throw new Error("Impossible d'ajouter le joueur");
  return res.json();
};

export const getGame = async (gameId) => {
  const res = await fetch(`${API_URL}/game/${gameId}/`);
  if (!res.ok) throw new Error("Partie non trouvée");
  return res.json();
};

