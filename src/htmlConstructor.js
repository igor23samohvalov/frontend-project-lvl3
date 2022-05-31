export const createHeader = (text) => {
  const div = document.createElement('div');
  div.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = text;

  div.append(h2);

  return div;
};

export const createPost = (post, i18n) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'justify-content-between', 'align-items-start', 'border-0', 'd-flex');

  const a = document.createElement('a');
  a.className = post.clicked ? 'fw-normal' : 'fw-bold';
  a.href = post.link;
  a.textContent = post.title;
  a.setAttribute('target', '_blank');
  a.addEventListener('click', () => {
    a.className = 'fw-normal';
    post.clicked = true;
  });

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = i18n.t('showButton');
  button.addEventListener('click', () => {
    document.querySelector('.modal-title').textContent = post.title;
    document.querySelector('.modal-body p').textContent = post.description;
    document.querySelector('.modal-footer .btn-primary').setAttribute('href', post.link);

    a.className = 'fw-normal';
    post.clicked = true;
  });

  li.append(a);
  li.append(button);

  return li;
};

export const createFeed = (feed) => {
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

  return li;
};
