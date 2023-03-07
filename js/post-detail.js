let TOTAL_DATA = 0; // 데이터 총개수
const VIEW_DATA = 5; // 화면에 출력 개수
let TOTAL_PAGE = 0; // 총페이지

const VIEW_SECTION = 5; // 화면 출려개수(페이지 버튼 출력개수)
let TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION); // 총구역(총페이지)

var page = 1; // 페이지가 1부터 시작할때

const postId = window.location.href.split('?id=')[1];

document.addEventListener('DOMContentLoaded', function () {
  const postSettings = {
    url: `http://localhost:8080/api/posts/${postId}`,
    method: 'GET',
    timeout: 0,
  };

  $.ajax(postSettings).done(function (response) {
    const titleArea = document.getElementById('post-detail-title');
    titleArea.innerText = response.title;

    const userProfileImageArea = document.getElementById(
      'post-detail-user-profile'
    );
    const imageSrc = response.userInfo.profileImage
      ? response.userInfo.profileImage
      : '/images/logo.png';
    userProfileImageArea.setAttribute('src', imageSrc);
    userProfileImageArea.setAttribute('width', '20px');
    userProfileImageArea.setAttribute('height', '20px');

    const userIdArea = document.getElementById('post-detail-user-id');
    userIdArea.innerText = response.userInfo.userId;

    const createdAtArea = document.getElementById('post-detail-createdAt');
    createdAtArea.innerText = response.createdAt.slice(0, 10);

    const contentArea = document.querySelector('.ql-editor');
    contentArea.innerHTML = response.content;

    if (
      localStorage.getItem('accesstoken') &&
      response.userInfo.userId ===
        parseJwt(localStorage.getItem('accesstoken')).sub
    ) {
      const editBtn = document.getElementById('post-edit');
      const deleteBtn = document.getElementById('post-delete');

      editBtn.style.display = 'inline-block';
      deleteBtn.style.display = 'inline-block';
    }
  });

  getComments(0);

  // 좋아요 여부 확인
  if (window.localStorage.getItem('accesstoken')) {
    var settings = {
      url: `http://localhost:8080/api/likes/${postId}/check`,
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: window.localStorage.getItem('accesstoken'),
      },
    };

    $.ajax(settings).done(function (response) {
      if (response) {
        showLikeBtn();
      } else {
        showUnLikeBtn();
      }
    });
  } else {
    showUnLikeBtn();
  }

  // 좋아요 갯수
  getLikeCnt();
});

const getLikeCnt = () => {
  var likeCntSettings = {
    url: `http://localhost:8080/api/likes/${postId}`,
    method: 'GET',
    timeout: 0,
  };

  $.ajax(likeCntSettings).done(function (response) {
    const likeCntSpan = document.getElementById('like-cnt');
    likeCntSpan.innerText = response;
  });
};

// 페이징 버튼
$('.comment-pagination').on('click', 'a', function (e) {
  page = parseInt($(this).data('page'));

  getComments(page - 1);

  return false;
});

const getComments = (page) => {
  const commentSettings = {
    url: `http://localhost:8080/api/post-comments/${postId}`,
    method: 'GET',
    timeout: 0,
    data: {
      page: page,
      size: VIEW_DATA,
    },
  };

  $.ajax(commentSettings).done(function (response) {
    const data = response.content;
    TOTAL_DATA = response.totalElements;
    TOTAL_PAGE = response.totalPages;
    TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION);
    comment_list(data);
  });
};

// 댓글 페이징 목록
function pageing_list() {
  var setion_page = Math.ceil(page / VIEW_SECTION); // 구역의 현재페이지
  var start = setion_page * VIEW_SECTION - (VIEW_SECTION - 1); // 시작 1 6 11
  var end = setion_page * VIEW_SECTION + VIEW_SECTION - (VIEW_SECTION - 1); // 마지막 6 11 17
  var prev = start - 1 < 1 ? 1 : start - 1; // 이전 페이지
  var next = (end = setion_page == TOTAL_SECTION ? TOTAL_PAGE + 1 : end); // 다음페이지
  var first = 1; // 처음 페이지
  var last = TOTAL_PAGE; // 마지막 페이지
  var pageNums = [];

  $('.comment-pagination').empty();
  if (TOTAL_DATA != 0) {
    if (page != 1) {
      pageNums.push(
        "<a href='#' class='first' data-page=" + first + '>처음</a>'
      );
    }

    if (setion_page != 1) {
      pageNums.push("<a href='#' class='prev' data-page=" + prev + '>이전</a>');
    }

    // 페이징 번호 출력
    for (var i = start; i < end; i++) {
      if (page == i) {
        pageNums.push(
          '<a href="#" class="on" data-page=' + i + '>' + i + '</a>'
        );
        continue;
      }

      pageNums.push('<a href="#" data-page=' + i + '>' + i + '</a>');
    }

    if (setion_page != TOTAL_SECTION) {
      pageNums.push("<a href='#' class='next' data-page=" + next + '>다음</a>');
    }

    if (page != last) {
      pageNums.push(
        "<a href='#' class='last' data-page=" + last + '>마지막</a>'
      );
    }
  }

  $('.comment-pagination').append(pageNums);
}

// 댓글 목록
function comment_list(data) {
  var str = '';

  data.forEach((comment) => {
    str += '<li>';
    str += `<p class="comment-list-item" id="post-comment-${comment.postCommentId}">`;
    str += `<span class="commnet">${comment.user.userId}</span>`;
    str += `<span id="comment-content-${comment.postCommentId}" class="comment-content">${comment.content}</span>`;
    str += `<span>${comment.createdAt.slice(0, 10)}</span>`;
    if (
      localStorage.getItem('accesstoken') &&
      comment.user.userId === parseJwt(localStorage.getItem('accesstoken')).sub
    ) {
      str += `<span onclick="handleEditComment(${comment.postCommentId})">수정</span>`;
      str += `<a onclick="deleteComment(${comment.postCommentId})">삭제</a>`;
    }
    str += '</p>';
    str += `<p class="comment-list-item" id="post-comment-edit-${comment.postCommentId}" style="display: none;">`;
    str += `<input value="${comment.content}" id="update-comment-${comment.postCommentId}"}>`;
    str += `<button onclick="updateComment(${comment.postCommentId})">수정 완료</button>`;
    str += `<button onclick="cancelEditcomment(${comment.postCommentId})">취소</button>`;
    str += '</p>';
    str += '</li>';
  });

  $('.comment-list').empty();
  $('.comment-list').append(str);

  pageing_list();
}

// 코멘트 달기
const addComment = () => {
  if (window.localStorage.getItem('accesstoken')) {
    const content = document.getElementById('content').value;

    var createCommentSettings = {
      url: `http://localhost:8080/api/post-comments/${postId}`,
      method: 'POST',
      timeout: 0,
      data: JSON.stringify({
        content,
      }),
      headers: {
        Authorization: window.localStorage.getItem('accesstoken'),
        'Content-Type': 'application/json',
      },
    };

    $.ajax(createCommentSettings).done(function (response) {
      document.getElementById('content').value = null;

      var commentSettings = {
        url: `http://localhost:8080/api/post-comments/${postId}`,
        method: 'GET',
        timeout: 0,
        data: {
          page: page - 1,
          size: VIEW_DATA,
        },
      };

      $.ajax(commentSettings).done(function (response) {
        const data = response.content;

        TOTAL_DATA = response.totalElements;
        TOTAL_PAGE = response.totalPages;
        TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION);
        comment_list(data);
      });
    });
  } else {
    alert('로그인이 필요합니다.');
  }
};

const moveToWritePage = () => {
  window.location.href = `/post-update.html?id=${postId}`;
};

const deletePost = () => {
  const deletePostSettings = {
    url: `http://localhost:8080/api/posts/${postId}`,
    method: 'DELETE',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
    },
  };

  $.ajax(deletePostSettings).done(function (response) {
    alert('게시글이 삭제되었습니다.');
    window.location.href = '/posts.html';
  });
};

const showLikeBtn = () => {
  const unlike = document.getElementById('post-unlike-btn');
  const like = document.getElementById('post-like-btn');

  unlike.style.display = 'none';
  like.style.display = 'block';
};

const showUnLikeBtn = () => {
  const unlike = document.getElementById('post-unlike-btn');
  const like = document.getElementById('post-like-btn');

  unlike.style.display = 'block';
  like.style.display = 'none';
};

const like = () => {
  if (window.localStorage.getItem('accesstoken')) {
    var settings = {
      url: `http://localhost:8080/api/likes/${postId}/like`,
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: window.localStorage.getItem('accesstoken'),
      },
    };

    $.ajax(settings).done(function (response) {
      showLikeBtn();
      getLikeCnt();
    });
  } else {
    alert('로그인 후 사용 가능합니다.');
  }
};

const unlike = () => {
  if (window.localStorage.getItem('accesstoken')) {
    var settings = {
      url: `http://localhost:8080/api/likes/${postId}/unlike`,
      method: 'DELETE',
      timeout: 0,
      headers: {
        Authorization: window.localStorage.getItem('accesstoken'),
      },
    };

    $.ajax(settings).done(function (response) {
      showUnLikeBtn();
      getLikeCnt();
    });
  } else {
    alert('로그인 후 사용 가능합니다.');
  }
};

const auth = () => {
  if (window.localStorage.getItem('accesstoken')) {
    location.href = '/mypage.html';
  } else {
    alert('로그인이 필요합니다.');
  }
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const handleEditComment = (postCommentId) => {
  const commentPTag = document.getElementById(`post-comment-${postCommentId}`);
  commentPTag.style.display = 'none';
  const commentInput = document.getElementById(
    `post-comment-edit-${postCommentId}`
  );
  commentInput.style.display = 'flex';
};

const cancelEditcomment = (postCommentId) => {
  const commentPTag = document.getElementById(`post-comment-${postCommentId}`);
  commentPTag.style.display = 'flex';
  const commentInput = document.getElementById(
    `post-comment-edit-${postCommentId}`
  );
  commentInput.style.display = 'none';
};

const updateComment = (postCommentId) => {
  const comment = document.getElementById(
    `update-comment-${postCommentId}`
  ).value;

  var settings = {
    url: `http://localhost:8080/api/post-comments/${postCommentId}`,
    method: 'PUT',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      content: comment,
    }),
  };

  $.ajax(settings).done(function (response) {
    getComments(page - 1);
  });
};

const deleteComment = (postCommentId) => {
  var settings = {
    url: `http://localhost:8080/api/post-comments/${postCommentId}`,
    method: 'DELETE',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
    },
  };

  $.ajax(settings).done(function (response) {
    page = 1;
    getComments(0);
  });
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
  window.location.reload();
};

showHeader();
