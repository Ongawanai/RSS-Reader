/* eslint-disable import/extensions */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
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

export default (state, language) => {
  const watchedState = onChange(state, (path, value) => renderSelector(path, value, language));
  const inputForm = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentRSS = state.formState.feedList;
    const schema = makeSchema(language, currentRSS);
    schema.isValid({ rssInput: input.value }).then((result) => {
      if (result === true) {
        watchedState.formState.feedList.push(input.value);
        watchedState.formState.isValid = true;
        inputForm.reset();
        input.focus();
      } else {
        const errorType = currentRSS.includes(input.value) ? 'already exist' : false;
        watchedState.formState.isValid = errorType;
      }
    });
  });
};
