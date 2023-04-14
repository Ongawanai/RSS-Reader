/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

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

const renderFeed = (feedData, language) => {
  // Проверяем, добавлены ли уже какие-либо фиды
  const feedContainer = document.querySelector('.feeds');
  const postContrainer = document.querySelector('.posts');

  if (feedContainer.childElementCount === 0) {
    firstRenderFeed(language);
  }

  const items = feedData.querySelectorAll('item');

  // Создаём контейнер для постов

  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0');
  postContrainer.append(postList);

  // Создаём контейнер для фидов
  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0');
  feedContainer.append(feedList);

  // Создаём фид
  const feed = document.createElement('li');
  feed.classList.add('list-group-item', 'border-0');
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = feedData.querySelector('title').textContent;
  feed.append(feedTitle);
  const feedDescription = document.createElement('p');
  feedDescription.textContent = feedData.querySelector('description').textContent;
  feed.append(feedDescription);
  feedList.append(feed);

  // Создаём посты
  items.forEach((item) => {
    const post = document.createElement('li');
    post.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    postList.append(post);
    const id = document.querySelectorAll('[data-id]').length / 2;
    const a = document.createElement('a');
    post.append(a);
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('title').textContent;
    a.outerHTML = `<a href="${link}" class="fw-bold border-0" data-id="${id}">${description}</a>`;

    const button = document.createElement('button');
    post.append(button);
    button.outerHTML = `<button type="button" data-id="${id}" 
    class="btn btn-outline-primary btn-sm data-bs-toggle="modal" data-bs-target="#modal">
    ${language.t('view')}</button>`;
  });
};

const getFeed = (url, language) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`).then((responce) => {
    if (responce.status === 200) {
      const parser = new DOMParser();
      const parsedFeed = parser.parseFromString(responce.data.contents, 'application/xml');
      const errorNode = parsedFeed.querySelector('parsererror');
      const errorText = document.querySelector('.errorText');
      if (errorNode) {
        errorText.textContent = language.t('parsingError');
        throw new Error(language.t('parsingError'));
      } else {
        errorText.textContent = '';
        return renderFeed(parsedFeed, language);
      }
    }
    throw new Error(language.t('networkError'));
  });
};

const renderSelector = (path, value, language) => {
  switch (path) {
    case 'formState.currentUrl':
      getFeed(value, language);
      break;
    case 'formState.isValid':
      renderStatus(value, language);
      break;
    default:
      throw new Error(`Unknown process State: ${path}`);
  }
};

export default renderSelector;
