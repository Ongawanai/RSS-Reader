/* eslint-disable import/extensions */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import renderSelector from './renders.js';

export default (state) => {
  const watchedState = onChange(state, (path, value) => renderSelector(path, value));
  const inputForm = document.querySelector('.rss-form');
  const input = document.querySelector('#url-input');

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentRSS = state.formState.feedList;
    const schema = yup.object({
      rssInput: yup.string().url().nullable().notOneOf(currentRSS),
    });
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
