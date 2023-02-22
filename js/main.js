// 에러 메세지 객체
const errMsg = {
    id: { 
      invalid: "최소 4자 이상, 10자 이하이며 a-z, 0-9 만 입력하세요.",
      success: "사용 가능한 아이디입니다",
      fail: "사용할 수 없는 아이디입니다"
    },
    pw: "최소 8자 이상, 15자 이하이며 a-z, A-Z, 0-9 만 입력하세요",
    pwRe: {
      success: "비밀번호가 일치합니다",
      fail: "비밀번호가 일치하지 않습니다"
    }
  }
  
  // 계정 정보 객체
  const account = {
    id: null,
    pw: null,
    email: null
  
  }
  
  /*** SECTION - ID ***/
  const idInputEl = document.querySelector('#info__id input')
  const idErrorMsgEl = document.querySelector('#info__id .error-msg')
  const idCheckBtn = document.querySelector('#id-check')
  idInputEl.addEventListener('change', () => {
    const idRegExp = /^[a-zA-Z0-9]{6,20}$/
    if(idRegExp.test(idInputEl.value)) { // 정규식 조건 만족 O
      idErrorMsgEl.textContent = ""
      account.id = idInputEl.value
    } else { // 정규식 조건 만족 X
      idErrorMsgEl.style.color = "red"
      idErrorMsgEl.textContent = errMsg.id.invalid
      account.id = null
    }
    console.log(account)
  });
  
  idCheckBtn.addEventListener('click', () => {
    const randVal = Math.floor(Math.random() * 10)
    if(account.id !== null) {
      if(randVal < 7) {
        idErrorMsgEl.style.color = "green"
        idErrorMsgEl.textContent = errMsg.id.success
      }
      else {
        idErrorMsgEl.style.color = "red"
        idErrorMsgEl.textContent = errMsg.id.fail
      }
    }
  })
  
  /*** SECTION - PASSWORD ***/
  // pwVal: 패스워드, pwReVal: 패스워드 재입력, isPwValid: 패스워드 유효 여부
  let pwVal = "", pwReVal = "", isPwValid = false
  // 비밀번호와 재입력 값 일치 여부
  function checkPwValid() {
    account.pw = null
    if(pwReVal === "") { // 미입력
      pwReErrorMsgEl.textContent = ""
    }
    else if(pwVal === pwReVal) { // 비밀번호 재입력 일치
      if(isPwValid)
        account.pw = pwVal
      pwReErrorMsgEl.style.color = "green"
      pwReErrorMsgEl.textContent = errMsg.pwRe.success
    }
    else { // 비밀번호 재입력 불일치
      pwReErrorMsgEl.style.color = "red"
      pwReErrorMsgEl.textContent = errMsg.pwRe.fail
    }
  }
  
  const pwInputEl = document.querySelector('#info__pw input')
  const pwErrorMsgEl = document.querySelector('#info__pw .error-msg')
  pwInputEl.addEventListener('change', () => {
    const pwRegExp = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/
    pwVal = pwInputEl.value
    if(pwRegExp.test(pwVal)) { // 유효성 검사 성공
      isPwValid = true
      pwErrorMsgEl.textContent = ""
    } 
    else { // 유효성 검사 실패
      isPwValid = false
      pwErrorMsgEl.textContent = errMsg.pw
    }
    checkPwValid()
    console.log(pwVal, pwReVal, isPwValid, account)
  });
  
  /*** SECTION - PASSWORD RECHECK ***/
  const pwReInputEl = document.querySelector('#info__pwRe input')
  const pwReErrorMsgEl = document.querySelector('#info__pwRe .error-msg')
  pwReInputEl.addEventListener('change', () => {
    pwReVal = pwReInputEl.value
    checkPwValid()
    console.log(pwVal, pwReVal, isPwValid, account)
  });
  
  /*** SECTION - EMAIL ***/
  emailList = ["", ""]
  function checkEmailValid() {
    if(emailList[0] !== "" && emailList[1] !== "") {
      account.email = emailList.join('@')
    }
    else
    account.email = null
  }
  
  const emailInputEl = document.querySelector('#email-txt')
  emailInputEl.addEventListener('change', () => {
    emailList[0] = emailInputEl.value
    checkEmailValid()
    console.log(account, emailList)
  })
  
  const domainInputEl = document.querySelector('#domain-txt')
  domainInputEl.addEventListener('change', () => {
    emailList[1] = domainInputEl.value
    checkEmailValid()
    console.log(account, emailList)
  })
  
  // 도메인 직접 입력 or domain option 선택
  const domainListEl = document.querySelector('#domain-list')
  domainListEl.addEventListener('change', () => {
    // option에 있는 도메인 선택 시
    const domainSelected = domainListEl.value
    if(domainSelected !== "type") {
      // 선택한 도메인을 input에 입력하고 disabled
      domainInputEl.value = domainSelected
      domainInputEl.disabled = true
      emailList[1] = domainSelected
    } else { // 직접 입력
      // input 내용 초기화 & 입력 가능하도록 변경
      domainInputEl.value = ""
      domainInputEl.disabled = false
      emailList[1] = ""
    }
    checkEmailValid()
    console.log(account, emailList)
  })
  
  /*** SUBMIT ***/
  const submitBtn = document.querySelector('#submit')
  const resultFailEl = document.querySelector('#result-fail')
  submitBtn.addEventListener('click', function() {
    let isAllFilled = true
    const word = {  
      id: "아이디를",
      pw: "비밀번호를",
      email: "이메일을",
      birth: "생년월일을",
      mobile: "휴대폰 번호를"
    }
    for(element in account) {
      if(account[element] === null) {
        resultFailEl.textContent = word[element] + " 다시 한번 확인해주세요"
        isAllFilled = false
        break
      }
    }
    if (isAllFilled === true) {
      resultFailEl.textContent = ""
      setTimeout(function() {
        alert("서버 전송 데이터 : " + JSON.stringify(account))
      }, 300)
    }
  })