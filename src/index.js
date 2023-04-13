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
  const rssList = [];

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const schema = makeSchema(language, rssList);
    schema.isValid({ rssInput: input.value }).then((result) => {
      if (result === true) {
        rssList.push(input.value);
        watchedState.formState.currentUrl = input.value;
        watchedState.formState.isValid = true;
        inputForm.reset();
        input.focus();
      } else {
        const errorType = rssList.includes(input.value) ? 'already exist' : false;
        watchedState.formState.isValid = errorType;
      }
    });
  });
};
