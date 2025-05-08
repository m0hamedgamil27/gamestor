const express = require('express');
const cookies = require('cookie-parser');
const cors = require('cors');
const { login, register, getUsers, getUserById, deleteUser} = require('./functions/users.js');
const { authenticateToken } = require('./JWT/jwt.js');

const {
  testGameEndpoint,
  addGame,
  getAllGames,
  getGameById,
  deleteGame,
  buyGame
} = require('./functions/games.js');
require('dotenv').config();
let games = [{ id: 1, name: "Feeding Frenzy", description: "Game about feeding fish", price: 999999999, category: "Gold Games", users: [] }];


const app = express();
const port = 2005;
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());
app.use(cookies());
// app.options('*', cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.get("/api/test", (req, res) => {
  res.send("API test endpoint");
});



// get routes
app.get("/users", getUsers);
app.get('/users/:id', getUserById);
app.get("/game/test", testGameEndpoint);
app.get("/games", getAllGames);
app.get("/game/:id", getGameById);
app.get('/me', authenticateToken, (req, res) => {
  console.log(req.user)
  res.json(req.user);
});


//post routes
app.post('/register', register);
// app.post('/register', oldRegister);
app.post('/login', login);
app.post("/game", addGame);

//patch routes
app.patch('/users/:id/games', buyGame);

//delete routes
app.delete('/users/:id', deleteUser);
app.delete("/game/:name", deleteGame);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
