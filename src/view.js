import 'bootstrap';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import rssDiff from './rssDiff.js';
import { renderContent, renderFeedback } from './render.js';

function view(state, validate, i18n) {
  const form = document.querySelector('form');
  const rssInput = document.querySelector('#rssInput');
  const addButton = document.querySelector('button[type="submit"]');

  const watchedState = onChange(state, (path, value) => {
    switch (value.state) {
      case 'failed':
        renderFeedback('failed', value.errorMessage);
        rssInput.classList.add('is-invalid');
        rssInput.removeAttribute('readonly');
        addButton.disabled = false;
        break;
      case 'loaded':
        renderFeedback('success', i18n.t('feedbackSuccess'));
        renderContent(state.contents, i18n);

        watchedState.formState = { state: 'ready', errorMessage: '' };
        break;
      case 'update':
        state.tempContents.forEach((tempContent) => rssDiff(state.contents, tempContent));
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
  }, { ignoredKeys: ['contents', 'tempContents'] });

  function fetchData(urls, container, operation) {
    const requests = urls.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then((res) => new window.DOMParser().parseFromString(res.data.contents, 'text/xml')));

    Promise.all(requests)
      .then((datas) => datas.forEach((data, i) => {
        container.unshift({
          feed: {
            title: data.querySelector('channel title').textContent,
            description: data.querySelector('channel description').textContent,
          },
          posts: Array.from(data.querySelectorAll('item')).map((post) => ({
            link: post.querySelector('link').textContent,
            title: post.querySelector('title').textContent,
            description: post.querySelector('description').textContent,
            clicked: false,
          })),
          url: operation === 'loaded' ? rssInput.value : urls[i],
        });
      }))
      .then(() => {
        watchedState.formState = { state: operation, errorMessage: '' };
      })
      .catch((error) => {
        if (operation === 'update') {
          return;
        }
        if (error.response) {
          watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackOnloadProb') };
        } else if (error.request) {
          watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackNoInternet') };
        } else {
          watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackBadResponse') };
        }
      });
  }

  function loopUpdate() {
    if (state.contents.length === 0) {
      return setTimeout(loopUpdate, 5000);
    }
    return setTimeout(() => {
      state.tempContents = [];
      const urls = state.contents.map((item) => item.url);
      fetchData(urls, state.tempContents, 'update');

      return loopUpdate();
    }, 5000);
  }

  loopUpdate();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    rssInput.setAttribute('readonly', 'readonly');
    addButton.disabled = true;
    if (state.contents.map((item) => item.url).includes(rssInput.value)) {
      watchedState.formState = { state: 'failed', errorMessage: i18n.t('feedbackRssExists') };
    } else if (_.isEmpty(validate({ url: rssInput.value }))) {
      fetchData([rssInput.value], state.contents, 'loaded');
    } else if (rssInput.value === '') {
      watchedState.formState = { state: 'failed', errorMessage: i18n.t('shouldNotBeEmpty') };
    } else {
      watchedState.formState = { state: 'failed', errorMessage: validate({ url: rssInput.value })[0].message };
    }
  });
}

export default view;
