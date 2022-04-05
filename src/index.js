import * as yup from 'yup';
import view from './view.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import resources from './locales/index.js';
import translate from './translate.js';

const defaultLanguage = 'ru';

const state = {
  formState: {
    state: 'ready',
    errorMessage: '',
  },
  contents: [],
  tempContents: [],
  language: defaultLanguage,
}

const i18n = i18next.createInstance()
i18n.init({
    lng: state.language, 
    debug: true,
    resources,
  });

const schema = yup.object().shape({
  url: yup.string().url(i18n.t('feedbackIsInvalid')).required()
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