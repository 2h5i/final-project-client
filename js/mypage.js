document.addEventListener('DOMContentLoaded', function () {
  var settings = {
    url: `http://localhost:8080/api/users/my-page`,
    method: 'GET',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
    },
  };

  $.ajax(settings).done(function (response) {
    $('#userId').empty();
    $('#userId').append('아이디 : ' + response.userId);
    $('#userEmail').empty();
    $('#userEmail').append('이메일 : ' + response.email);
    $('#profile-image').attr(
      'src',
      response.profileImage
        ? response.profileImage
        : '/images/default-profile.jpeg'
    );
  });
});

function modal(className) {
  var zIndex = 9999;
  var modal = document.querySelector('.' + className);

  // 모달 div 뒤에 희끄무레한 레이어
  var bg = document.createElement('div');
  bg.classList.add('back-ground');
  bg.setStyle({
    position: 'fixed',
    zIndex: zIndex,
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    // 레이어 색갈은 여기서 바꾸면 됨
    backgroundColor: 'rgba(0,0,0,0.4)',
  });
  document.body.append(bg);

  // 닫기 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
  modal
    .querySelector('.modal_close_btn')
    .addEventListener('click', function () {
      const file = document.getElementById('profile-file');
      const filePreview = document.getElementById('preview-image');

      file.value = '';
      filePreview.src = '';

      bg.remove();
      modal.style.display = 'none';
    });

  modal.setStyle({
    position: 'fixed',
    display: 'block',
    boxShadow:
      '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

    // 시꺼먼 레이어 보다 한칸 위에 보이기
    zIndex: zIndex + 1,

    // div center 정렬
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    msTransform: 'translate(-50%, -50%)',
    webkitTransform: 'translate(-50%, -50%)',
  });
}

// Element 에 style 한번에 오브젝트로 설정하는 함수 추가
Element.prototype.setStyle = function (styles) {
  for (var k in styles) this.style[k] = styles[k];
  return this;
};

const makePreview = (input) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('preview-image').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById('preview-image').src = '';
  }
};

const updateImage = () => {
  const file = document.getElementById('profile-file');

  if (!file.files[0]) {
    alert('이미지를 선택해주세요.');
    return;
  }

  var form = new FormData();
  form.append('profileImage', file.files[0], file.files[0].name);

  var settings = {
    url: 'http://localhost:8080/api/users/image',
    method: 'POST',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
    },
    processData: false,
    mimeType: 'multipart/form-data',
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    const profileImg = document.getElementById('profile-image');

    profileImg.src = response;
  });

  // 닫을때 모달 지우기 / 파일 이름, 파일 프리뷰 지우기
  const filePreview = document.getElementById('preview-image');
  file.value = '';
  filePreview.src = '';

  const background = document.querySelector('.back-ground');
  const modal = document.querySelector('.modal');

  background.remove();
  modal.style.display = 'none';
};
