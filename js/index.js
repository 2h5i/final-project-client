function signup() {
  const userId = document.getElementById("userId").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  var settings = {
    url: "http://localhost:8080/api/auth/signup",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      userId,
      password,
      email,
    }),
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}
