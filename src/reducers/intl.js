import languages, { defaultLanguage } from 'constants/languages';

const CHANGE_LANG = 'intl/CHANGE_LANG';

const initialState = {
  lang: defaultLanguage
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_LANG:
      return {
        ...state,
        lang: action.payload
      };

    default:
      return state;
  }
}

export function changeLang(lang) {
  const langToChange = languages.includes(lang) ? lang : defaultLanguage;

  return {
    type: CHANGE_LANG,
    payload: langToChange
  };
}
