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

const firstRenderFeed = (language) => {
  const feedContainer = document.querySelector('.feeds');
  const feedHeader = document.createElement('div');
  feedHeader.innerHTML = `<h2 class="card-title h4">${language.t('feeds')}</h2>`;
  feedContainer.append(feedHeader);

  const postContrainer = document.querySelector('.posts');
  const postHeader = document.createElement('div');
  postHeader.innerHTML = `<h2 class="card-title h4">${language.t('posts')}</h2>`;
  postContrainer.append(postHeader);
};

const renderPosts = (feedData, language) => {
  // Проверяем, добавлены ли уже какие-либо фиды
  const postContaainer = document.querySelector('.posts');

  if (postContaainer.childElementCount === 0) {
    firstRenderFeed(language);
  }

  // Создаём контейнер для постов

  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0');
  postContaainer.append(postList);

  // Создаём посты
  feedData[0].forEach((item) => {
    const post = document.createElement('li');
    post.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    postList.append(post);
    const { id, link, description } = item;
    const a = document.createElement('a');
    post.append(a);
    a.outerHTML = `<a href="${link}" class="fw-bold border-0" data-id="${id}">${description}</a>`;

    const button = document.createElement('button');
    post.append(button);
    button.outerHTML = `<button type="button" data-id="${id}" 
    class="btn btn-outline-primary btn-sm data-bs-toggle="modal" data-bs-target="#modal">
    ${language.t('view')}</button>`;
  });
};

const renderFeed = (feedData) => {
  const currentFeed = feedData[0];
  const feedContainer = document.querySelector('.feeds');
  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0');
  feedContainer.append(feedList);

  // Создаём фид
  const feed = document.createElement('li');
  feed.classList.add('list-group-item', 'border-0');
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = currentFeed.title;
  feed.append(feedTitle);
  const feedDescription = document.createElement('p');
  feedDescription.textContent = currentFeed.description;
  feed.append(feedDescription);
  feedList.append(feed);
};

const renderSelector = (path, value, language) => {
  switch (path) {
    case 'formState.allUrls':
      break;
    case 'formState.isValid':
      renderStatus(value, language);
      break;
    case 'formState.posts':
      renderPosts(value.slice(-1), language);
      break;
    case 'formState.feeds':
      renderFeed(value.slice(-1));
      break;
    default:
      throw new Error(`Unknown process State: ${path}`);
  }
};

export default renderSelector;
