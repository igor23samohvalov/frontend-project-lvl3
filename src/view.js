import onChange from "on-change";
import _ from 'lodash';
import axios from "axios";
import bootstrap from "bootstrap";

function renderPosts(posts, i18n, state) {
  if (document.querySelector('.posts .card-body') === null) {
    const div = document.createElement('div');
    div.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('postsHeader');

    div.append(h2);
    document.querySelector('.posts').prepend(div);
  }

  document.querySelector('.posts .list-group').innerHTML = '';

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'justify-content-between', 'align-items-start', 'border-0', 'd-flex');
  
    
    const a = document.createElement('a');
    if (state.clickedPostsIds.includes(post.id)) {
      a.className = 'fw-normal';
    } else {
      a.className = 'fw-bold'
    }
    a.href = post.link;
    a.textContent = post.title;
    a.setAttribute('target', '_blank');
    a.setAttribute('data-id', post.id);
    a.addEventListener('click', () => {
      a.className = 'fw-normal';
      if (!state.clickedPostsIds.includes(post.id)) {
        state.clickedPostsIds.push(post.id);
      }
    });

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal')
    button.textContent = i18n.t('showButton');
    button.addEventListener('click', () => {
      document.querySelector('.modal-title').textContent = post.title;
      document.querySelector('.modal-body p').textContent = post.description;
      document.querySelector('.modal-footer .btn-primary').setAttribute('href', post.link);
    })

    li.append(a);
    li.append(button);
    document.querySelector('.posts .list-group').append(li);
  })
}

function renderFeeds(feeds, i18n) {
  if (document.querySelector('.feeds .card-body') === null) {
    const div = document.createElement('div');
    div.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('feedsHeader');

    div.append(h2);
    document.querySelector('.feeds').prepend(div);
  }

  document.querySelector('.feeds .list-group').innerHTML = '';

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'justify-content-between', 'border-0');
  
    const h3 = document.createElement('h3');
    h3.classList.add('h6');
    h3.textContent = feed.title;
  
    const p = document.createElement('p');
    p.classList.add('small', 'text-black-50');
    p.textContent = feed.description;
  
    li.append(h3);
    li.append(p);
    document.querySelector('.feeds .list-group').prepend(li);
  })
}

function view(state, validate, i18n) {
  const form = document.querySelector('form');
  const rssInput = document.querySelector('#rssInput');
  const feedback = document.querySelector('.feedback');

  function loopUpdate() {
    if (state.usedUrls.length === 0) {

      return setTimeout(loopUpdate, 5000);
    }
    setTimeout(() => {
      fetchData(false);

      return loopUpdate();
    }, 5000)
  }

  loopUpdate()

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssInput':
        if (state.usedUrls.includes(value)) {
          onChange.target(watchedState).error = i18n.t('feedbackRssExists');
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
          onChange.target(watchedState).usedUrls.push(state.rssInput);
          fetchData();
        } else {
          rssInput.classList.add('is-invalid');
          feedback.classList.remove('text-success');
          feedback.classList.add('text-danger');
          feedback.textContent = state.error;
        }
        break;
      case 'filling':
        break;
      case 'posts':
        renderPosts(value, i18n, state);
        break;
      case 'feeds':
        renderFeeds(value, i18n);
        break;
      default:
        console.log('undefined option');
        break;
    }
  })

  const fetchData = (updateFeed = true) => {
    let currentPosts = [];

    let requests = state.usedUrls.map(url => {       
      return axios.get(url).then((res) => new window.DOMParser().parseFromString(res.data, "text/xml"))
    });

    Promise.all(requests)
      .then(responses => {
        let id = 0;

        responses.forEach((data) => {
          if (updateFeed) {
            watchedState.feeds.push({
              title: data.querySelector('channel title').textContent,
              description: data.querySelector('channel description').textContent,
            })
          }
          
          const posts = Array.from(data.querySelectorAll('item')).map((post) => {
            id += 1;

            return {
              link: post.querySelector('link').textContent,
              title: post.querySelector('title').textContent,
              description: post.querySelector('description').textContent,
              id: id,
            };
          });

        currentPosts.unshift(...posts)
      })})
      .then(() => {
        watchedState.posts = [...currentPosts];

        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('feedbackSuccess');

        rssInput.classList.remove('is-invalid');
        rssInput.value = '';
        rssInput.focus();
      })
      .catch((error) => {
        console.log(error)
        onChange.target(watchedState).usedUrls.pop();
        onChange.target(watchedState).isValid = '';
        onChange.target(watchedState).error = i18n.t('feedbackOnloadProb');

        watchedState.isValid = false;
      })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onChange.target(watchedState).rssInput = '';
    onChange.target(watchedState).isValid = '';

    watchedState.rssInput = rssInput.value;
  })

  document.querySelector('.modal-footer .btn-primary').addEventListener('click', (e) => {

    Array.from(document.querySelectorAll('.posts ul li')).forEach((li) => {
      const a = li.querySelector('a')

      if (a.href === e.target.href) {
        a.className = 'fw-normal';
        if (!state.clickedPostsIds.includes(Number(a.dataset.id))) {
          state.clickedPostsIds.push(Number(a.dataset.id));
        }
      }
    })

  })
}

export default view;