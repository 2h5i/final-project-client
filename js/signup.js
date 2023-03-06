// 에러 메세지 객체
const errMsg = {
  id: {
    invalid: '최소 4자 이상, 10자 이하이며 a-z, 0-9 만 입력하세요.',
    success: '사용 가능한 아이디입니다',
    fail: '사용할 수 없는 아이디입니다',
  },
  pw: '최소 8자 이상, 15자 이하이며 a-z, A-Z, 0-9 만 입력하세요',
  pwRe: {
    success: '비밀번호가 일치합니다',
    fail: '비밀번호가 일치하지 않습니다',
  },
};

// 계정 정보 객체
const account = {
  id: null,
  pw: null,
  email: null,
};

/*** SECTION - ID ***/
const idInputEl = document.querySelector('#info__id input');
const idErrorMsgEl = document.querySelector('#info__id .error-msg');
const idCheckBtn = document.querySelector('#id-check');
idInputEl.addEventListener('change', () => {
  const idRegExp = /^[a-zA-Z0-9]{4,10}$/;
  if (idRegExp.test(idInputEl.value)) {
    // 정규식 조건 만족 O
    idErrorMsgEl.textContent = '';
    account.id = idInputEl.value;
  } else {
    // 정규식 조건 만족 X
    idErrorMsgEl.style.color = 'red';
    idErrorMsgEl.textContent = errMsg.id.invalid;
    account.id = null;
  }
});

/*** SECTION - PASSWORD ***/
// pwVal: 패스워드, pwReVal: 패스워드 재입력, isPwValid: 패스워드 유효 여부
let pwVal = '',
  pwReVal = '',
  isPwValid = false;
// 비밀번호와 재입력 값 일치 여부
function checkPwValid() {
  account.pw = null;
  if (pwReVal === '') {
    // 미입력
    pwReErrorMsgEl.textContent = '';
  } else if (pwVal === pwReVal) {
    // 비밀번호 재입력 일치
    if (isPwValid) account.pw = pwVal;
    pwReErrorMsgEl.style.color = 'green';
    pwReErrorMsgEl.textContent = errMsg.pwRe.success;
  } else {
    // 비밀번호 재입력 불일치
    pwReErrorMsgEl.style.color = 'red';
    pwReErrorMsgEl.textContent = errMsg.pwRe.fail;
  }
}

const pwInputEl = document.querySelector('#info__pw input');
const pwErrorMsgEl = document.querySelector('#info__pw .error-msg');
pwInputEl.addEventListener('change', () => {
  const pwRegExp = /^[A-Za-z0-9]{8,15}$/;
  pwVal = pwInputEl.value;
  if (pwRegExp.test(pwVal)) {
    // 유효성 검사 성공
    isPwValid = true;
    pwErrorMsgEl.textContent = '';
  } else {
    // 유효성 검사 실패
    isPwValid = false;
    pwErrorMsgEl.textContent = errMsg.pw;
  }
  checkPwValid();
});

/*** SECTION - PASSWORD RECHECK ***/
const pwReInputEl = document.querySelector('#info__pwRe input');
const pwReErrorMsgEl = document.querySelector('#info__pwRe .error-msg');
pwReInputEl.addEventListener('change', () => {
  pwReVal = pwReInputEl.value;
  checkPwValid();
});

function signupUser() {
  var settings = {
    url: 'http://3.35.0.88:8080/api/auth/signup',
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      userId: $('#userName').val(),
      password: $('#userPassword').val(),
      email: $('#email-txt').val(),
    }),
  };
  $.ajax(settings).done(function (response) {
    alert('회원가입이 완료되었습니다.');
    window.location.href = 'login.html';
  });
}
