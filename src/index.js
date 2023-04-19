/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import renderSelector from './renders.js';
import parseRSS from './parser.js';

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

const getDomain = (url) => {
  const newUrl = new URL(url);
  const domain = newUrl.hostname;
  return domain;
};

const refreshRSS = (state, url, language) => {
  axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((responce) => {
      if (responce.status === 200) {
        const [feed, posts] = parseRSS(responce.data.contents, language);
        const allPosts = state.formState.posts.flat();
        const findFeed = allPosts.find((item) => getDomain(item.link) === getDomain(feed.link));
        const relatedFeedId = findFeed.feedId;
        const relatedPosts = allPosts.filter((post) => post.feedId === relatedFeedId);
        const newPosts = _.differenceBy(posts, relatedPosts, 'link');

        newPosts.forEach((post) => {
          post.id = _.uniqueId();
          post.feedId = relatedFeedId;
        });
        state.formState.posts.push(newPosts);
      }
    })
    .catch(() => {
      state.formState.errors = language.t('networkError');
    });
  setTimeout(refreshRSS, 5000, state, url, language);
};

const getContent = (parsedFeed, state, url, language) => {
  const [feed, posts] = parsedFeed;
  const feedId = _.uniqueId();

  posts.forEach((post) => {
    post.id = _.uniqueId();
    post.feedId = feedId;
  });
  state.formState.posts.push(posts);

  feed.id = feedId;
  state.formState.feeds.push(feed);

  state.formState.isValid = true;

  const buttons = document.querySelectorAll(`[data-feed='${feedId}']`);
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const buttonId = button.dataset.id;
      const relatedPost = posts.find((post) => post.id === buttonId);
      state.formState.currentModal = relatedPost;
    });
  });

  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.formState.currentModal = 'none';
    });
  });

  refreshRSS(state, url, language);
};

const getRSS = (url, language, state) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`).then((responce) => {
    if (responce.status === 200) {
      const parsedData = parseRSS(responce.data.contents, language);
      state.formState.allUrls.push(url);
      getContent(parsedData, state, url, language);
    } else {
      state.formState.errors = language.t('networkError');
      setTimeout(getRSS, 5000, url, language, state);
    }
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
        getRSS(input.value, language, watchedState);
        inputForm.reset();
        input.focus();
      } else {
        const errorType = currentUrls.includes(input.value) ? 'already exist' : false;
        watchedState.formState.isValid = errorType;
      }
    });
  });
};
