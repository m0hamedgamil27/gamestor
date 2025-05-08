document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:2005/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Allows cookies to be sent/received
    body: JSON.stringify({ username, password }),
  })
    .then(response => { return response.json() })
  .then(data => {
    console.log('Login successful! Token:', data.token);
     window.location.href = 'dashboard.html';
  })
  .catch(error => {
    alert(error.message);
    console.error('Error logging in:', error);
  });
});
