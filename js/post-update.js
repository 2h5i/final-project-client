var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  //   ['clean'], // remove formatting button
];

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: 'snow',
});

const postId = window.location.href.split('?id=')[1];

document.addEventListener('DOMContentLoaded', function () {
  const postSettings = {
    url: `http://localhost:8080/api/posts/${postId}`,
    method: 'GET',
    timeout: 0,
  };

  $.ajax(postSettings).done(function (response) {
    const titleInput = document.getElementById('post-title');
    titleInput.value = response.title;

    quill.root.innerHTML = response.content;
  });
});

const updatePost = () => {
  const title = document.getElementById('post-title').value;
  const content = quill.root.innerHTML;

  var settings = {
    url: `http://localhost:8080/api/posts/${postId}`,
    method: 'PUT',
    timeout: 0,
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWFhIiwiYXV0aCI6IkFETUlOIiwiZXhwIjoxNjc2ODgyMDQ4LCJpYXQiOjE2NzY4Nzg0NDh9.kFeTRU7MALKWc-KzciiiQrsTdeOe_g-ySOSZyyzucLg',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      title,
      content,
    }),
  };

  $.ajax(settings).done(function (response) {
    window.location.href = `/post-detail.html?id=${response}`;
  });
};
