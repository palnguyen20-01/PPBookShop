// login.js
document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  fetch('/api/auth/admin/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emailOrUsername: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
  
        window.location = '/admin/book-management';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
