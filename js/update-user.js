  function updateUser(){
    var settings = {
      url: 'http://localhost:8080/api/users/23',
      method: 'PUT',
      timeout: 0,
      "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyYWEiLCJhdXRoIjoiVVNFUiIsImV4cCI6MTY3Njc3NzMwNywiaWF0IjoxNjc2NzczNzA3fQ.5D4wK-8QkzIv17v4jSfsXj4UO3R2dFZ3NDMSObAAngw"
      },
      "data":JSON.stringify({
        "userId":$('#userId').val(),
        "userPassword":$('#userPassword').val(),
        "userEmail":$('#userEmail').val()
      }),
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        alert("변경되었습니다");
        window.location.href="mypage.html";
    });
};
