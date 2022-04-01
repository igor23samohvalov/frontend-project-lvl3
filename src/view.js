import onChange from "on-change";
import _ from 'lodash';
import axios from "axios";

function renderPosts(posts, i18n) {
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
    a.href = post.link;
    a.textContent = post.title;
    a.classList.add('fw-bold');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18n.t('showButton');

    li.append(a);
    li.append(button);
    document.querySelector('.posts .list-group').prepend(li);
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
      let currentPosts = [];
      let requests = state.usedUrls.map(url => {       
        return axios.get(url).then((res) => new window.DOMParser().parseFromString(res.data, "text/xml"))
      });

      Promise.all(requests)
        .then(responses => {
          responses.forEach((data) => {
          const items = Array.from(data.querySelectorAll('item')).map((item) => {
            return {
              link: item.querySelector('link').textContent,
              title: item.querySelector('title').textContent,
            };
          });

          currentPosts.push(...items)
        })})
        .then(() => {
          watchedState.posts = [...currentPosts];
        })
        .catch(console.log)
  
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
      case 'posts':
        renderPosts(value, i18n);
        break;
      case 'feeds':
        renderFeeds(value, i18n);
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
    axios.get(url)

      .then((res) => new window.DOMParser().parseFromString(res.data, "text/xml"))
      .then((data) => {
        // const currentFeed = {
        //   title: data.querySelector('channel title').textContent,
        //   description: data.querySelector('channel description').textContent,
        // }

        watchedState.feeds.push({
          title: data.querySelector('channel title').textContent,
          description: data.querySelector('channel description').textContent,
        })
        
        const items = Array.from(data.querySelectorAll('item')).map((item) => {
          return {
            link: item.querySelector('link').textContent,
            title: item.querySelector('title').textContent,
          };
        });
        watchedState.posts.push(...items)

        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('feedbackSuccess');

        rssInput.classList.remove('is-invalid');
        rssInput.value = '';
        rssInput.focus();

        onChange.target(watchedState).usedUrls.push(state.rssInput);

      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data + ' error response');
          console.log(error.response.status + ' error response');
          console.log(error.response.headers + ' error response');
        } else if (error.request) {
          console.log(error.request + ' error request');
        } else {
          console.log('Error', error.message + ' error message');
        }
        console.log(error.config);

        onChange.target(watchedState).isValid = '';
        onChange.target(watchedState).error = i18n.t('feedbackOnloadProb');

        watchedState.isValid = false;
      })
  }
}

export default view;