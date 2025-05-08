 let games = [{
  id: 1,
  name: "Feeding Frenzy",
  description: "Game about feeding fish",
  price: 999999999,
  category: "Gold Games",
  users: []
}];

const { users } = require("./users.js");

function testGameEndpoint(req, res) {
  res.send("Test Game endpoint");
}

function addGame(req, res) {
  const { id, name, description, price, category } = req.body;
  if (!id || !name || !description || !price || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const game = { id, name, description, price, category, users: [] };
  games.push(game);
  res.status(201).json(game);
}

function getAllGames(req, res) {
  res.json(games);
}

function getGameById(req, res) {
  const id = parseInt(req.params.id);
  const game = games.find(game => game.id === id);
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }
  res.json(game);
}

function deleteGame(req, res) {
  console.log("deleting game")
  const name = req.params.name;
  games = games.filter(game => game.name !== name); // false conditions gets removed 
  res.status(204).send();
}

function buyGame(req, res) {
  const userId = parseInt(req.params.id);
  const gameName = req.body.gameName;

  const user = users.find(u => u.id === userId);
  const game = games.find(g => g.name === gameName);

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!game) return res.status(404).json({ message: 'Game not found' });

  if (!user.games) user.games = [];
  if (!user.games.includes(gameName)) {
    user.games.push(gameName);
  }

  res.json({ message: 'Game added to user', user });
}

// Export the functions
module.exports = {
  testGameEndpoint,
  addGame,
  getAllGames,
  getGameById,
  deleteGame,
  buyGame,
  games
};
