let TOTAL_DATA = 0; // 데이터 총개수
const VIEW_DATA = 5; // 화면에 출력 개수
let TOTAL_PAGE = 0; // 총페이지

const VIEW_SECTION = 5; // 화면 출려개수(페이지 버튼 출력개수)
let TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION); // 총구역(총페이지)

var page = 1; // 페이지가 1부터 시작할때

const recruitmentId = window.location.href.split('?id=')[1];

document.addEventListener('DOMContentLoaded', function () {
  const recruitmentSettings = {
    url: `http://13.209.25.67:8080/api/recruitments/${recruitmentId}`,
    method: 'GET',
    timeout: 0,
  };

  $.ajax(recruitmentSettings).done(function (response) {
    const titleArea = document.getElementById('recruitment-detail-title');
    titleArea.innerText = response.title;

    const userIdArea = document.getElementById('recruitment-detail-user-id');
    userIdArea.innerText = response.subTitle;

    const createdAtArea = document.getElementById(
      'recruitment-detail-createdAt'
    );
    createdAtArea.innerText = response.createdAt.slice(0, 10);

    const hrefAtArea = document.getElementById('recruitment-detail-href');
    hrefAtArea.innerText = response.href;
    hrefAtArea.href = response.href;

    const contentArea = document.getElementById('recruitment-detail-content');
    contentArea.innerHTML = response.content;
  });

  const commentSettings = {
    url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentId}`,
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

  if (window.localStorage.getItem('accesstoken')) {
    var settings = {
      url: `http://13.209.25.67:8080/api/bookmarks/${recruitmentId}/check`,
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: window.localStorage.getItem('accesstoken'),
      },
    };
  
    $.ajax(settings).done(function (response) {
      if (response) {
        showBookmarkBtn();
      } else {
        showUnBookmarkBtn();
      }
    });
  } else {
    showUnBookmarkBtn();
  }
});


// 페이징 버튼
$('.comment-pagination').on('click', 'a', function (e) {
  page = parseInt($(this).data('page'));

  var commentSettings = {
    url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentId}`,
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

  return false;
});

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
    console.log(comment.user.userId);
    console.log(parseJwt(localStorage.getItem('accesstoken')).sub);
    str += '<li>';
    str += `<p class="comment-list-item" id="recruitment-comment-${comment.recruitmentCommentId}">`;
    str += `<span class="commnet">${comment.user.userId}</span>`;
    str += `<span>${comment.content}</span>`;
    str += `<span>${comment.createdAt.slice(0, 10)}</span>`;
    if (
      comment.user.userId === parseJwt(localStorage.getItem('accesstoken')).sub
    ) {
      str += `<span onclick="handleEditComment(${comment.recruitmentCommentId})">수정</span>`;
      str += `<a onclick="deleteComment(${comment.recruitmentCommentId})">삭제</a>`;
    }
    str += '</p>';
    str += `<p class="comment-list-item" id="recruitment-comment-edit-${comment.recruitmentCommentId}" style="display: none;">`;
    str += `<input value="${comment.content}" id="update-comment-${comment.recruitmentCommentId}"}>`;
    str += `<button onclick="updateComment(${comment.recruitmentCommentId})">수정 완료</button>`;
    str += `<button onclick="cancelEditcomment(${comment.recruitmentCommentId})">취소</button>`;
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
    url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentId}`,
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
      url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentId}`,
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
  }else{
    alert("로그인이 필요합니다.")
  }
};

const showBookmarkBtn = () => {
  const unbookmark = document.getElementById('post-unbookmark-btn');
  const bookmark = document.getElementById('post-bookmark-btn');

  unbookmark.style.display = 'none';
  bookmark.style.display = 'block';
};

const showUnBookmarkBtn = () => {
  const unbookmark = document.getElementById('post-unbookmark-btn');
  const bookmark = document.getElementById('post-bookmark-btn');

  unbookmark.style.display = 'block';
  bookmark.style.display = 'none';
};

  const bookmark = () => {
    if (window.localStorage.getItem('accesstoken')) {
      var settings = {
        url: `http://13.209.25.67:8080/api/bookmarks/${recruitmentId}/bookmark`,
        method: 'POST',
        timeout: 0,
        headers: {
          Authorization: window.localStorage.getItem('accesstoken'),
        },
      };
  
      $.ajax(settings).done(function (response) {
        showBookmarkBtn();
      });
    } else {
      alert('로그인 후 사용 가능합니다.');
    }
  };
  
  const unbookmark = () => {
    if (window.localStorage.getItem('accesstoken')) {
      var settings = {
        url: `http://13.209.25.67:8080/api/bookmarks/${recruitmentId}/bookmark`,
        method: 'DELETE',
        timeout: 0,
        headers: {
          Authorization: window.localStorage.getItem('accesstoken'),
        },
      };
  
      $.ajax(settings).done(function (response) {
        showUnBookmarkBtn();
      });
    } else {
      alert('로그인 후 사용 가능합니다.');
    }
  };

  const auth = () => {
    if (window.localStorage.getItem('accesstoken')) {
      location.href='/mypage.html';
    }else{
      alert("로그인이 필요합니다.");
    }
  }
  
  const handleEditComment = (recruitmentCommentId) => {
    const commentPTag = document.getElementById(`recruitment-comment-${recruitmentCommentId}`);
    commentPTag.style.display = 'none';
    const commentInput = document.getElementById(
      `recruitment-comment-edit-${recruitmentCommentId}`
    );
    commentInput.style.display = 'flex';
  };
  
  const cancelEditcomment = (recruitmentCommentId) => {
    const commentPTag = document.getElementById(`recruitment-comment-${recruitmentCommentId}`);
    commentPTag.style.display = 'flex';
    const commentInput = document.getElementById(
      `recruitment-comment-edit-${recruitmentCommentId}`
    );
    commentInput.style.display = 'none';
  };
  
  const updateComment = (recruitmentCommentId) => {
    const comment = document.getElementById(
      `update-comment-${recruitmentCommentId}`
    ).value;
  
    var settings = {
      url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentCommentId}`,
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
  
  const deleteComment = (recruitmentCommentId) => {
    var settings = {
      url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentCommentId}`,
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
  
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };


  const getComments = (page) => {
    const commentSettings = {
      url: `http://13.209.25.67:8080/api/recruitment-comments/${recruitmentId}`,
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