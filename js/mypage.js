document.addEventListener('DOMContentLoaded', function () {
  var settings = {
    url: 'http://localhost:8080/api/users/23/my-page',
    method: 'GET',
    timeout: 0,
    "headers": {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyYWEiLCJhdXRoIjoiVVNFUiIsImV4cCI6MTY3Njc3NzMwNywiaWF0IjoxNjc2NzczNzA3fQ.5D4wK-8QkzIv17v4jSfsXj4UO3R2dFZ3NDMSObAAngw"
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response)
    $('#userId').empty();
    $('#userId').append('아이디 : '+ response.userId);
    $('#userEmail').empty();
    $('#userEmail').append('이메일 : '+ response.email);
    
   });
});