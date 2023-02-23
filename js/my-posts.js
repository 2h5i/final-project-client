let TOTAL_DATA = 0; // 데이터 총개수
const VIEW_DATA = 10; // 화면에 출력 개수
let TOTAL_PAGE = 0; // 총페이지

const VIEW_SECTION = 5; // 화면 출려개수(페이지 버튼 출력개수)
let TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION); // 총구역(총페이지)

var page = 1; // 페이지가 1부터 시작할때

document.addEventListener('DOMContentLoaded', function () {
  var settings = {
    url: 'http://localhost:8080/api/posts/my-page',
    method: 'GET',
    timeout: 0,
    data: {
      page: 0,
      size: VIEW_DATA,
    },
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
    },
  };

  $.ajax(settings).done(function (response) {
    data = response.content;

    TOTAL_DATA = response.totalElements;
    TOTAL_PAGE = response.totalPages;
    TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION);
    board_list(data);
  });
});

// 페이징 버튼
$('.posts-content-area').on('click', 'a', function (e) {
  page = parseInt($(this).data('page'));

  var settings = {
    url: 'http://localhost:8080/api/posts/my-page',
    method: 'GET',
    timeout: 0,
    headers: {
      Authorization: window.localStorage.getItem('accesstoken'),
    },
    data: {
      page: page - 1,
      size: VIEW_DATA,
    },
  };

  $.ajax(settings).done(function (response) {
    data = response.content;

    TOTAL_DATA = response.totalElements;
    TOTAL_PAGE = response.totalPages;
    TOTAL_SECTION = Math.ceil(TOTAL_PAGE / VIEW_SECTION);
    board_list(data);
  });

  return false;
});

// 페이징 목록
function pageing_list() {
  var setion_page = Math.ceil(page / VIEW_SECTION); // 구역의 현재페이지
  var start = setion_page * VIEW_SECTION - (VIEW_SECTION - 1); // 시작 1 6 11
  var end = setion_page * VIEW_SECTION + VIEW_SECTION - (VIEW_SECTION - 1); // 마지막 6 11 17
  var prev = start - 1 < 1 ? 1 : start - 1; // 이전 페이지
  var next = (end = setion_page == TOTAL_SECTION ? TOTAL_PAGE + 1 : end); // 다음페이지
  var first = 1; // 처음 페이지
  var last = TOTAL_PAGE; // 마지막 페이지
  var pageNums = [];

  $('#pagination-buttons').empty();
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
  $('#pagination-buttons').append(pageNums);
}

// 게시물 목록
function board_list(data) {
  var str = '';
  data.forEach((post) => {
    str += `<tr onclick="location.href='/post-detail.html?id=${post.postId}'">`;
    str += `<td>${post.title}</td>`;
    str += '</tr>';
  });

  $('.table tbody').empty();
  $('.table tbody').append(str);

  pageing_list();
}
const auth = () => {
  if (window.localStorage.getItem('accesstoken')) {
    location.href='/mypage.html';
  }else{
    alert("로그인이 필요합니다.");
  }
}
