import * as yup from 'yup';
import i18next from 'i18next';
import view from './view.js';
import resources from './locales/index.js';
import translate from './translate.js';

export default () => {
  const defaultLanguage = 'ru';

  const state = {
    formState: {
      state: 'ready',
      errorMessage: '',
    },
    contents: [],
    tempContents: [],
    language: defaultLanguage,
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: state.language,
    debug: true,
    resources,
  });

  const schema = yup.object().shape({
    url: yup.string().url(i18n.t('feedbackIsInvalid')).required(i18n.t('shouldNotBeEmpty')),
  });

  const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return e.inner;
    }
  };

  translate(i18n);

  view(state, validate, i18n);
};
