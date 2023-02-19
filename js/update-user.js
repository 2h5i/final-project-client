  function updateUser(){
    var settings = {
      url: 'http://localhost:8080/api/users/25',
      method: 'PUT',
      timeout: 0,
      "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYTU2NzgiLCJhdXRoIjoiVVNFUiIsImV4cCI6MTY3Njc5MTAxMiwiaWF0IjoxNjc2Nzg3NDEyfQ._zJBdL1Hy0pkvuEXPEd6qKuPxn7RqUrrMoQxjJxHhR0",
        'Content-Type': 'application/json'
      },
      "data":JSON.stringify({
        "userId":$('#userId').val(),
        "password":$('#userPassword').val(),
        "email":$('#userEmail').val()
      }),
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        alert("변경되었습니다, 다시 로그인해주세요");
        window.location.href="login.html";
    });
};
