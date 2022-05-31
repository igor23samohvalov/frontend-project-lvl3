import { createHeader, createPost, createFeed } from './htmlConstructor.js';

function renderFeed(feed, i18n) {
  if (document.querySelector('.feeds .card-body') === null) {
    const feedHeader = createHeader(i18n.t('feedsHeader'));
    document.querySelector('.feeds').prepend(feedHeader);
  }

  const feedElem = createFeed(feed);
  document.querySelector('.feeds .list-group').append(feedElem);
}

function renderPosts(posts, i18n) {
  if (document.querySelector('.posts .card-body') === null) {
    const postsHeader = createHeader(i18n.t('postsHeader'));
    document.querySelector('.posts').prepend(postsHeader);
  }

  posts.forEach((post) => {
    const postElem = createPost(post, i18n);
    document.querySelector('.posts .list-group').append(postElem);
  });
}

function renderContent(contents, i18n) {
  document.querySelector('.feeds .list-group').innerHTML = '';
  document.querySelector('.posts .list-group').innerHTML = '';

  contents.forEach((rss) => {
    renderFeed(rss.feed, i18n);
    renderPosts(rss.posts, i18n);
  });
}

function renderFeedback(state, message) {
  const feedback = document.querySelector('.feedback');

  switch (state) {
    case 'success':
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = message;
      break;
    case 'failed':
    default:
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = message;
      break;
  }
}
export { renderContent, renderFeedback };
