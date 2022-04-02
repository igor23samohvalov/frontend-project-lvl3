export default (post, i18n) => {
  return `
    <div class="modal" tabindex="-1" id="exampleModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${post.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${post.description}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('modalCloseButton')}</button>
            <button type="button" class="btn btn-primary">${i18n.t('modalFollowLinkButton')}</button>
          </div>
        </div>
      </div>
    </div>
  `
}