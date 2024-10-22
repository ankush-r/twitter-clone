document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send login credentials to the server
    fetch("http://localhost:3500/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Invalid username or password');
            window.location.href ='http://localhost:3500/api/user/login'
        }
    })
    .then(data => {
      console.log(JSON.stringify(data));
        sessionStorage.setItem('loggedInUser', JSON.stringify(data));
        window.location.href = 'http://localhost:3500/';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
  });
});
