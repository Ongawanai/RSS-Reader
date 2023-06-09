import i18next from 'i18next';
import * as yup from 'yup';
import app from './index.js';
import resources from './locales/ru.js';

const init = () => {
  const state = {
    isValid: '',
    errors: '',
    inputText: '',
    allUrls: [],
    posts: [],
    feeds: [],
    currentModal: '',
  };
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });
  app(state, i18nextInstance);
};

init();
export default init;
