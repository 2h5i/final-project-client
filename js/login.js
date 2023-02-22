function loginUser(){
    var settings = {
      url: 'http://localhost:8080/api/auth/login',
      method: 'POST',
      timeout: 0,
      "headers": {
        'Content-Type': 'application/json'
      },
      "data":JSON.stringify({
        "userId":$('#userName').val(),
        "password":$('#userPassword').val(),
      }),
    }
    $.ajax(settings).done(function (response, status, request) {
        console.log(request.getResponseHeader('Authorization'));
        console.log(request);
        window.localStorage.setItem("accesstoken",request.getResponseHeader('Authorization'));

        
        alert("로그인이 완료되었습니다.");
        window.location.href="index.html"; 
    });
    
};
