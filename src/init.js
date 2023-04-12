/* eslint-disable import/extensions */
import app from './index.js';

const init = () => {
  const state = {
    formState: {
      isValid: true,
      errors: [],
      inputText: '',
      feedList: [],
    },
  };
  app(state);
};

init();
export default init;
