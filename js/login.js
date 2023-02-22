function loginUser() {
  var settings = {
    url: 'http://localhost:8080/api/auth/login',
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      userId: $('#userName').val(),
      password: $('#userPassword').val(),
    }),
  };
  $.ajax(settings).done(function (response, status, request) {
    console.log(request.getResponseHeader('Authorization'));
    console.log(request);
    window.localStorage.setItem(
      'accesstoken',
      request.getResponseHeader('Authorization')
    );

    alert('로그인이 완료되었습니다.');
    window.location.href = 'index.html';
  });
}

function kakaoLogin() {
  const code = window.localStorage.getItem('code');
  $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/api/auth/kakao-login',
    data: {
      code,
    },
    success: function (response) {
      console.log(response);
      window.localStorage.setItem(
        'accesstoken',
        response
      );

      //   console.log(response);
      //   setCookie('accessToken', response.atk);
      //   setCookie('refreshToken', response.rtk);
      //   clearCookie('code');
      //   location.href = './home.html';
    },
    error: function (response) {
      if (response.responseJSON) {
        alert('로그인 실패! : ' + response.responseJSON.message + '😭');
      } else {
        alert('로그인 실패! 서버의 응답이 없습니다😭');
      }
      //   clearCookie('code');
      location.href = 'http://' + window.location.hostname + ':5500/index.html';
    },
  });
}
