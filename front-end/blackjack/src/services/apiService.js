const API_URL = "http://localhost:8000/api";


export const createGame = (gameName) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/game/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: gameName }),
    })
      .then((res) => (res.ok ? res.json() : reject("Impossible de créer la partie")))
      .then(resolve)
      .catch(reject);
  });
};


export const addPlayer = (gameId, playerName) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/game/${gameId}/player/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName }),
    })
      .then((res) => (res.ok ? res.json() : reject("Impossible d'ajouter le joueur")))
      .then(resolve)
      .catch(reject);
  });
};


export const getGame = (gameId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/game/${gameId}/`)
      .then((res) => (res.ok ? res.json() : reject("Partie non trouvée")))
      .then(resolve)
      .catch(reject);
  });
};

export const roll = (playerId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/player/${playerId}/roll/`, { method: "POST" })
      .then((res) => {
        if (!res.ok) return reject("Impossible de lancer le dé");
        return res.json();
      })
      .then(resolve)
      .catch(reject);
  });
};


export const stand = (playerId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/player/${playerId}/stand/`, { method: "POST" })
      .then((res) => {
        if (!res.ok) return reject("Impossible de passer");
        return res.json();
      })
      .then(resolve)
      .catch(reject);
  });
};


export const getWinner = (gameId) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/game/${gameId}/winner/`)
      .then((res) => {
        if (!res.ok) return reject("Impossible de récupérer le gagnant");
        return res.json();
      })
      .then(resolve)
      .catch(reject);
  });
};
