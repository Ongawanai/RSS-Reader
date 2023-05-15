import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import renderSelector from './renders.js';
import parseRSS from './parser.js';

const makeSchema = (language, target) => {
  const schema = yup.object({
    rssInput: yup.string().url().nullable().notOneOf(target),
  });

  return schema;
};

const makeUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const refreshRSS = (state, url, language) => {
  axios
    .get(makeUrl(url))
    .then((responce) => {
      const [feed, posts] = parseRSS(responce.data.contents);
      const allPosts = state.formState.posts.flat();
      const findFeed = allPosts.find((item) => {
        const itemHostname = new URL(item.link).hostname;
        const feedHostname = new URL(feed.link).hostname;
        return itemHostname === feedHostname;
      });
      const relatedFeedId = findFeed.feedId;
      const relatedPosts = allPosts.filter((post) => post.feedId === relatedFeedId);
      const newPosts = _.differenceBy(posts, relatedPosts, 'link');

      newPosts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = relatedFeedId;
      });
      state.formState.posts.push(newPosts);
    })
    .catch(() => {
      state.formState.errors = 'networkError';
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
  axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((responce) => {
      const parsedData = parseRSS(responce.data.contents);
      state.formState.allUrls.push(url);
      getContent(parsedData, state, url, language);
    })
    .catch((err) => {
      if (err.message === 'parsingError') {
        state.formState.errors = 'parsingError';
      } else {
        state.formState.errors = 'networkError';
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
        const errorType = currentUrls.includes(input.value) ? 'already exist' : 'not valid';
        watchedState.formState.isValid = errorType;
      }
    });
  });
};
