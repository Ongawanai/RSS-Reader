import * as yup from 'yup';

export default (language, target) => {
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
