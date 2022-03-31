
export default (i18n) => {
  const submitButton = document.querySelector('button[type="submit"]');
  const header = document.querySelector('h1.display-3');
  const headerSubtitle = header.nextElementSibling;
  const rssInput = document.querySelector('input');
  const inputLabel = document.querySelector('label');
  const exampleUrl = document.querySelector('p.text-muted');

  header.textContent = i18n.t('header');
  headerSubtitle.textContent = i18n.t('headerSubtitle');
  rssInput.setAttribute('placeholder', i18n.t('label'))
  inputLabel.textContent = i18n.t('label');
  submitButton.textContent = i18n.t('submitButton');
  exampleUrl.textContent = i18n.t('example');
}