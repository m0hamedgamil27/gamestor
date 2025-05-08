function getCurrentUserDetails() {
  return fetch('http://localhost:2005/me', {
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to fetch current user');
    return response.json();
  })
    .then(user => { console.log(user); return user}); // Ensure the token payload includes user ID
}

let Id = 1

document.getElementById('addGameForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const { name, price, description, category } = e.target;
  Id += 1;
  fetch('http://localhost:2005/game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: Id,
      name: name.value,
      price: price.value,
      description: description.value,
      category: category.value
    }),
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    alert(`Game "${name.value}" added successfully.`);
  })
  .catch(error => {
    console.error('Error adding game:', error);
  });
});

document.getElementById('viewAllGamesBtn').addEventListener('click', function() {
  fetch('http://localhost:2005/games', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(games => {
      const gamesList = document.getElementById('gamesList');
      gamesList.innerHTML = '';
      games.forEach(game => {
        const listItem = document.createElement('li');
        listItem.textContent = `${game.name} - $${game.price} - ${game.category} - ${game.description}`;
        gamesList.appendChild(listItem);
      });
    });
});

document.getElementById('viewAccountBtn').addEventListener('click', async function () {
  try {
    const user = await getCurrentUserDetails();
    fetch(`http://localhost:2005/users/${user.id}`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(user => {
        const accountDetails = document.getElementById('accountDetails');
        accountDetails.innerHTML = `
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
        `;
      });
  } catch (error) {
    console.error(error);
  }
});

document.getElementById('deleteGameForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const user = await getCurrentUserDetails();
  if (user.role !== "admin") {
    const gameDetails = document.getElementById('GameDetails');
    gameDetails.innerHTML = `<p>Role not authorized to delete game!</p>`;
    return
  }
  const gamename = document.getElementById('gamename');
  fetch(`http://localhost:2005/game/${gamename.value}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete game');
    }
  })
  .then(result => {
    console.log('Game deleted:', result);
    const gameDetails = document.getElementById('GameDetails');
    gameDetails.innerHTML = `<p>Game deleted successfully!</p>`;
  })
  .catch(error => {
    console.error('Error deleting game:', error);
  });
});

document.getElementById('deleteAccountBtn').addEventListener('click', async function (e) {
  e.preventDefault();
  try {
    const user = await getCurrentUserDetails();
    fetch(`http://localhost:2005/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete user');
      })
      .then(result => {
        console.log('User deleted:', result);
        alert('User deleted successfully! Redirecting to signup page...');
        window.location.href = 'signup.html';
      });
  } catch (error) {
    console.error('Error deleting user:', error);
  }
});

document.getElementById('patchUserForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const gameName = document.getElementById('patchGameName').value;

  try {
    const userId = await getCurrentUserId();
    fetch(`http://localhost:2005/users/${userId}/games`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ gameName })
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to patch user');
        return response.json();
      })
      .then(result => {
        alert(`Game "${gameName}" successfully added to your list.`);
      });
  } catch (error) {
    console.error('Error patching user:', error);
  }
});
