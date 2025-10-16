const API_URL = "http://localhost:8000/api";

const request = (url, options = {}, errorMsg = "Erreur" ) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}${url}`, options)
    .then(res => res.ok ? res.json() : reject[errorMsg])
    .then(resolve)
    .then(reject);
  });
};

export const createGame = (gameName) => 
  request("/game/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: gameName }),
  }, "Impossible de créer la partie");


export const addPlayer = (gameId, playerName) =>
  request(`/game/${gameId}/player/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: playerName }),
  }, "Impossible d'ajouter le joueur");


export const getGame = (gameId) =>
  request(`/game/${gameId}/`, {}, "Partie non trouvée");

export const roll = (playerId) =>
  request(`/player/${playerId}/roll/`, { method: "POST" }, "Impossible de lancer le dé");

export const stand = (playerId) =>
  request(`/player/${playerId}/stand/`, { method: "POST" }, "Impossible de passer");

export const getWinner = (gameId) =>
  request(`/game/${gameId}/winner/`, {}, "Impossible de récupérer le gagnant");