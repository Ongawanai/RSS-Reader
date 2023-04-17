/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import renderSelector from './renders.js';

const makeSchema = (language, target) => {
  yup.setLocale({
    string: {
      default: `${language.t('string')}`,
      url: `${language.t('url')}`,
    },
    mixed: {
      notOneOf: `${language.t('notOneOf')}`,
    },
  });

  const schema = yup.object({
    rssInput: yup.string().url().nullable().notOneOf(target),
  });

  return schema;
};

/* const getPosts = () => {
  const allPosts = document.querySelectorAll('a');
  const postObjects = [];
  allPosts.forEach((post) => {
    const id = post.dataset.id;
    const description = post.textContent;
    const
  })
}
*/
const getContent = (parsedFeed, state) => {
  const items = parsedFeed.querySelectorAll('item');
  const postObjects = [];
  items.forEach((item) => {
    const id = _.uniqueId();
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('title').textContent;

    const post = { id, link, description };
    postObjects.push(post);
  });
  state.formState.posts.push(postObjects);
  const feed = {};
  feed.title = parsedFeed.querySelector('title').textContent;
  feed.description = parsedFeed.querySelector('description').textContent;
  state.formState.feeds.push(feed);
};

const parseFeed = (url, language, state) => {
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
        return getContent(parsedFeed, state);
      }
    }
    throw new Error(language.t('networkError'));
  });
};

export default (state, language) => {
  const watchedState = onChange(state, (path, value) => renderSelector(path, value, language));
  const inputForm = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');
  const currentUrls = watchedState.formState.allUrls;

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const schema = makeSchema(language, currentUrls);
    schema.isValid({ rssInput: input.value }).then((result) => {
      if (result === true) {
        watchedState.formState.allUrls.push(input.value);
        watchedState.formState.isValid = true;
        parseFeed(input.value, language, watchedState);
        inputForm.reset();
        input.focus();
      } else {
        const errorType = currentUrls.includes(input.value) ? 'already exist' : false;
        watchedState.formState.isValid = errorType;
      }
    });
  });
};
