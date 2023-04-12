const renderStatus = (status) => {
  const form = document.querySelector('#url-input');
  const errorText = document.querySelector('.errorText');
  switch (status) {
    case true:
      form.classList.remove('is-invalid');
      errorText.textContent = '';
      break;
    case false:
      form.classList.add('is-invalid');
      errorText.textContent = 'Ссылка должна быть валидным URL';
      break;
    case 'already exist':
      form.classList.add('is-invalid');
      errorText.textContent = 'RSS уже существует';
      break;
    default:
      throw new Error(`invalid form status: ${status}`);
  }
};

const renderSelector = (path, value) => {
  switch (path) {
    case 'formState.feedList':
      break;
    case 'formState.isValid':
      renderStatus(value);
      break;
    default:
      throw new Error(`Unknown process State: ${path}`);
  }
};

export default renderSelector;
