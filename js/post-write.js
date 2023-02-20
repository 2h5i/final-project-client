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

const writePost = () => {
  const title = document.getElementById('post-title').value;
  const content = quill.root.innerHTML;

  var settings = {
    url: 'http://localhost:8080/api/posts',
    method: 'POST',
    timeout: 0,
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWFhIiwiYXV0aCI6IkFETUlOIiwiZXhwIjoxNjc2ODEwMDczLCJpYXQiOjE2NzY4MDY0NzN9.4yFtwfCnZIswYGHuiTSFZM_-ml28YGJWm22rdfMVv2I',
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
