const renderStatus = (status, language) => {
  const form = document.querySelector('#url-input');
  const errorText = document.querySelector('.errorText');
  switch (status) {
    case true:
      form.classList.remove('is-invalid');
      errorText.textContent = '';
      break;
    case false:
      form.classList.add('is-invalid');
      errorText.textContent = language.t('url');
      break;
    case 'already exist':
      form.classList.add('is-invalid');
      errorText.textContent = language.t('notOneOf');
      break;
    default:
      throw new Error(`${language.t('wrongStatus')}: ${status}`);
  }
};

const renderSelector = (path, value, language) => {
  switch (path) {
    case 'formState.feedList':
      break;
    case 'formState.isValid':
      renderStatus(value, language);
      break;
    default:
      throw new Error(`Unknown process State: ${path}`);
  }
};

export default renderSelector;
