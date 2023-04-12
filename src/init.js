/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import i18next from 'i18next';
import app from './index.js';
import resources from './locales/ru.js';

const init = () => {
  const state = {
    formState: {
      isValid: true,
      errors: [],
      inputText: '',
      feedList: [],
    },
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
