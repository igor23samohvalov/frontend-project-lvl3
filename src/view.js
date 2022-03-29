 import onChange from "on-change";
 import _ from 'lodash';

 function renderPost(item) {
  if (document.querySelector('.posts .card-body') === null) {
    const div = document.createElement('div');
    div.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Посты';

    div.append(h2);
    document.querySelector('.posts').prepend(div);
  }

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'justify-content-between', 'align-items-start', 'border-0', 'd-flex');

  const a = document.createElement('a');
  a.href = item.querySelector('link').textContent;
  a.textContent = item.querySelector('title').textContent;
  a.classList.add('fw-bold');

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.textContent = 'Просмотр';

  li.append(a);
  li.append(button);
  document.querySelector('.posts .list-group').append(li);
}

function renderFeed(item) {
  if (document.querySelector('.feeds .card-body') === null) {
    const div = document.createElement('div');
    div.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Фиды';

    div.append(h2);
    document.querySelector('.feeds').prepend(div);
  }

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'justify-content-between', 'border-0');

  const h3 = document.createElement('h3');
  h3.classList.add('h6');
  h3.textContent = item.querySelector('title').textContent;

  const p = document.createElement('p');
  p.classList.add('small', 'text-black-50');
  p.textContent = item.querySelector('description').textContent;

  li.append(h3);
  li.append(p);
  document.querySelector('.feeds .list-group').append(li);
}

function view(state, validate) {
  const form = document.querySelector('form');
  const rssInput = document.querySelector('#rssInput');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssInput':
        if (state.usedUrls.includes(value)) {
          onChange.target(watchedState).error = 'RSS уже существует';
          watchedState.isValid = false;
        } else if (_.isEmpty(validate({url: value}))) {
          watchedState.isValid = true;
        } else {
          onChange.target(watchedState).error = validate({url: value})[0].message
          watchedState.isValid = false;
        }
        break;
      case 'isValid':
        if (value) {
          getData(state.rssInput);
        } else {
          rssInput.classList.add('is-invalid');
          feedback.classList.remove('text-success');
          feedback.classList.add('text-danger');
          feedback.textContent = state.error;
        }
        break;
      case 'filling':
        break;
      default:
        console.log('undefined option');
        break;
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onChange.target(watchedState).rssInput = '';
    onChange.target(watchedState).isValid = '';

    watchedState.rssInput = rssInput.value;
  })

  const getData = (url) => {
    fetch(url)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.text();
        } else {
          console.log('fk')
        }
      })
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        renderFeed(data.querySelector('channel'));
  
        const items = data.querySelectorAll('item');
        items.forEach((item) => {
          renderPost(item)
        });

        rssInput.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = 'RSS успешно загружен';
        rssInput.value = '';
        rssInput.focus();
        onChange.target(watchedState).usedUrls.push(state.rssInput);
      })
      .catch(error => {
        console.log(error);
        onChange.target(watchedState).isValid = '';
        onChange.target(watchedState).error = 'Неизвестная ошибка. Что-то пошло не так.';

        watchedState.isValid = false;
      })
  }
}

export default view;