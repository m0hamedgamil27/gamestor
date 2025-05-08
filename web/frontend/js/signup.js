document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const { username, password, email } = e.target;

  fetch('http://localhost:2005/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      email: email.value,
      id: Date.now(),
      role: "user"
    }),
  })
  .then(response => response.json())
  .then(data => {
    alert(`User "${username.value}" created successfully.`);
    window.location.href = 'login.html';
  })
  .catch(error => {
    console.error('Error signing up user:', error);
  });
});
