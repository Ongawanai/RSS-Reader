/* eslint-disable import/extensions */
import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import renderSelector from './renders.js';

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
        console.log(watchedState.formState.feedList);
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
