
document.addEventListener('DOMContentLoaded', function () {
  var settings = {
    url: `http://localhost:8080/api/users/my-page`,
    method: 'GET',
    timeout: 0,
    "headers": {
      "Authorization": window.localStorage.getItem('accesstoken')
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