// document.addEventListener('DOMContentLoaded', function updateUser(){
const updateUser = () => {
  var settings = {
    url: `http://localhost:8080/api/users/my-page`,
    method: 'PUT',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      password: $('#userPassword').val(),
    }),
  };
  $.ajax(settings).done(function (response) {
    alert('변경되었습니다, 다시 로그인해주세요');
    window.location.href = 'login.html';
  });
};

function isSame() {
  let pw = document.getElementById('userPassword');
  let confirmPW = document.getElementById('userPassword2');
  if (pw.length < 8 || pw.length > 15) {
    window.alert('비밀번호는 6글자 이상, 16글자 이하만 이용 가능합니다.');
    pw.value = confirmPW.value = '';
    document.getElementById('same').innerHTML = '';
  }
  if (pw.value != '' && confirmPW.value != '') {
    if (pw.value == confirmPW.value) {
      document.getElementById('same').innerHTML = '비밀번호가 일치합니다.';
      document.getElementById('same').style.color = 'green';
      document.getElementById('submit-button').disabled = false;
    } else {
      document.getElementById('same').innerHTML =
        '비밀번호가 일치하지 않습니다.';
      document.getElementById('same').style.color = 'red';
      document.getElementById('submit-button').disabled = true;
    }
  }
}

const auth = () => {
  if (window.localStorage.getItem('accesstoken')) {
    location.href = '/mypage.html';
  } else {
    alert('로그인이 필요합니다.');
  }
};

// 헤더
const showHeader = () => {
  const token = window.localStorage.getItem('accesstoken');
  const logoutArea = document.querySelector('.logout-area');
  const loginArea = document.querySelector('.login-area');

  if (token) {
    logoutArea.style.display = 'block';
    loginArea.style.display = 'none';
  } else {
    logoutArea.style.display = 'none';
    loginArea.style.display = 'block';
  }
};

const logout = () => {
  window.localStorage.removeItem('accesstoken');
  window.localStorage.removeItem('refreshtoken');
  alert('로그아웃 되었습니다.');
  window.location.href = '/index.html';
};

showHeader();
