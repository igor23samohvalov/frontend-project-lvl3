import 'bootstrap';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import rssDiff from './rssDiff.js';
import { renderContent, renderFeedback } from './render.js'

function view(state, validate, i18n) {
  const form = document.querySelector('form');
  const rssInput = document.querySelector('#rssInput');
  const addButton = document.querySelector('button[type="submit"]');
  
  function loopUpdate() {
    if (state.contents.length === 0) {
      return setTimeout(loopUpdate, 5000);
    }
    setTimeout(() => {
      state.tempContents = [];
      const urls = state.contents.map((item) => item.url);
      fetchData(urls, state.tempContents, 'update');

      return loopUpdate();
    }, 5000)
  }

  loopUpdate()

  const watchedState = onChange(state, (path, value) => {
    console.log(path)
    console.log(value)
    console.log(state.contents.map((item) => item.url))
    switch (value.state) {
      case 'failed':
        renderFeedback('failed', value.errorMessage);
        rssInput.classList.add('is-invalid');
        rssInput.removeAttribute('readonly');
        addButton.disabled = false;
        break;
      case 'sending':
        addButton.disabled = true;
        
        fetchData([rssInput.value], state.contents, 'loaded');
        break;
      case 'loaded':
        renderFeedback('success', i18n.t('feedbackSuccess'));
        renderContent(state.contents, i18n)

        watchedState.formState = { state: 'ready', errorMessage: ''};
        break;
      case 'update':
        state.tempContents.forEach((tempContent) => rssDiff(state.contents, tempContent))
        renderContent(state.contents, i18n);
        break;
      case 'ready':
      default:
        rssInput.classList.remove('is-invalid');
        rssInput.removeAttribute('readonly');
        addButton.disabled = false;
        rssInput.value = '';
        rssInput.focus();
        break;
    }
  }, { ignoredKeys: ['contents', 'tempContents']})


  function fetchData(urls, container, operation) {
    const requests = urls.map(url => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then(res => {
        return {
          data: new window.DOMParser().parseFromString(res.data.contents, "text/xml"),
          url: _.last(res.request.responseURL.split('&url='))
        }
      }))
        
    Promise.all(requests)
      .then((datas) => datas.forEach(({data, url}) => {
          container.unshift({
            feed: {
              title: data.querySelector('channel title').textContent,
              description: data.querySelector('channel description').textContent,
            },
            posts: Array.from(data.querySelectorAll('item')).map((post) => {
                return {
                  link: post.querySelector('link').textContent,
                  title: post.querySelector('title').textContent,
                  description: post.querySelector('description').textContent,
                  clicked: false,
                };
              }),
            url: url,
          });
      }))
      .then(() => {
        watchedState.formState = { state: operation, errorMessage: ''};
      })
      .catch((error) => {
        if (operation === 'update') {
          return;
        } 
        if (error.response) {
          watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackOnloadProb')};
        } else if (error.request) {
          watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackNoInternet')};
        } else {       
          watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackBadResponse')};
        }
      })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    rssInput.setAttribute('readonly', 'readonly');
    addButton.disabled = true;
    if (state.contents.map((item) => item.url).includes(rssInput.value)) {
      watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackRssExists')};
    } else if (_.isEmpty(validate({url: rssInput.value}))) {
      watchedState.formState = { state: 'sending', errorMessage: ''};
    } else if (rssInput.value === '') {
      watchedState.formState = { state: 'failed', errorMessage: i18n.t('shouldNotBeEmpty')};
    } else {
      watchedState.formState = { state: 'failed', errorMessage: validate({url: rssInput.value})[0].message};
    }
  })

  document.querySelector('.modal-footer .btn-primary').addEventListener('click', (e) => {
    Array.from(document.querySelectorAll('.posts ul li')).forEach((li) => {
      const a = li.querySelector('a')
      if (e.target.href === a.href) {
        for (const { posts } of state.contents) {
          for (const post of posts) {
            if (post.link === e.target.href) {
              a.className = 'fw-normal';
              post.clicked =  true;
            }
          }
        }
      }
    })

  })
}

export default view;