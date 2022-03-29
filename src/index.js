import * as yup from 'yup';
import view from './view.js';
import '../main.css';

const schema = yup.object().shape({
  url: yup.string().url('Ссылка должна быть валидным URL').required()
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return e.inner;
  }
};

const state = {
  rssInput: '',
  isValid: '',
  filling: true,
  error: '',
  usedUrls: [],
}

view(state, validate);