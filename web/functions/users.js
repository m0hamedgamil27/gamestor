const { generateToken } = require('../JWT/jwt'); // Correct path to the file where generateToken is defined

let users = [{ id: 1, username: "gamil", email: "gamil@gmail.com", password: "123", role: "user", games: [] }];

function getUsers(req, res) {
  res.json(users);
}

function getUserById(req, res) {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}

function deleteUser(req, res) {
  const id = parseInt(req.params.id);
  users = users.filter(user => user.id !== id);
  res.status(204).send();
}

async function register(req, res) {
  const { username, password, email, role } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password)) {
  throw new Error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
}

  if (typeof password !== 'string' || typeof email !== 'string' || typeof username !== 'string' ) {
    return res.status(400).send('Invalid data types!');
  }

  if (!username || !password || !email) {
    return res.status(400).send('Username, password, and email are required.');
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).send('User already exists.');
  }

  const user = { id: Date.now(), username, password, email, role };

  users.push(user);

  const token = await generateToken(user);
  console.log(token);
  res.cookie('auth', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 1000,
  });

  res.status(201).json({message:'User registered successfully', token: token});
}

// async function oldRegister(req, res) {
//   const { username, password, email, role } = req.body;

//   if (!username || !password || !email) {
//     return res.status(400).send('Username, password, and email are required.');
//   }

//   const userExists = users.find(user => user.username === username);
//   if (userExists) {
//     return res.status(400).send('User already exists.');
//   }

//   const user = { id: Date.now(), username, password, email, role };

//   users.push(user);

//   const token = await generateToken(user);
//   console.log(token);
//   res.cookie('auth', token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: 'Lax',
//     maxAge: 60 * 60 * 1000,
//   });

//   res.status(201).json({message:'User registered successfully', token: token});
// }

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = await generateToken(user);
  res.cookie('auth', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax' ,
    maxAge: 60 * 60 * 1000,
  }); 
  res.status(200).json({ message: 'Login successful', token: token });
}

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  deleteUser,
  users
};
