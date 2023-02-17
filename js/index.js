document.addEventListener('DOMContentLoaded', function () {
  var settings = {
    url: 'http://localhost:8080/api/recruitments/main',
    method: 'GET',
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    const recruitmentUl = document.getElementById('main-recruitment-list');

    response.forEach((recruitment) => {
      const li = document.createElement('li');
      const liDiv = document.createElement('div');

      liDiv.innerHTML = `<div class="recruitment-title">${recruitment.title}</div> 
                        <div class="recruitment-subtitle"> ${recruitment.sub_title}</div>`;

      li.setAttribute('id', recruitment.id);
      liDiv.setAttribute('class', 'recruitment-div');

      li.appendChild(liDiv);

      li.addEventListener('click', () => {
        window.location.href = '/recruitment-detail.html?id=' + recruitment.id;
      });

      recruitmentUl.appendChild(li);
    });
  });
});