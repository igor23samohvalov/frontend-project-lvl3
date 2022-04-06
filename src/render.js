function renderContent(contents, i18n) {
  document.querySelector('.feeds .list-group').innerHTML = '';
  document.querySelector('.posts .list-group').innerHTML = '';
  contents.forEach((rss) => {
    renderFeed(rss.feed, i18n);
    renderPosts(rss.posts, i18n);
  })
}

function renderFeed(feed, i18n) {
  if (document.querySelector('.feeds .card-body') === null) {
    const div = document.createElement('div');
    div.classList.add('card-body');

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('feedsHeader');

    div.append(h2);
    document.querySelector('.feeds').prepend(div);
  }

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
  document.querySelector('.feeds .list-group').append(li);

}

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

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'justify-content-between', 'align-items-start', 'border-0', 'd-flex');
  
    
    const a = document.createElement('a');
    a.className = post.clicked ? 'fw-normal' : 'fw-bold';
    a.href = post.link;
    a.textContent = post.title;
    a.setAttribute('target', '_blank');
    // a.setAttribute('data-id', post.id);
    a.addEventListener('click', () => {
      a.className = 'fw-normal';
      post.clicked = true;
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