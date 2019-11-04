import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider as LocaleProvider, addLocaleData } from 'react-intl';
import { connect } from 'react-redux';
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';
import { defaultLanguage } from 'constants/languages';
import ruMessages from 'i18n/ru';
import ukMessages from 'i18n/uk';
import moment from 'moment';

addLocaleData([...ru, ...uk]);

const messages = {
  ru: ruMessages,
  uk: ukMessages
};

const IntlProvider = ({ children, lang }) => {
  moment.locale(lang);
  return (
    <LocaleProvider locale={lang} messages={messages[lang]} textComponent={Fragment}>
      {children}
    </LocaleProvider>
  );
};

IntlProvider.propTypes = {
  children: PropTypes.node.isRequired,
  lang: PropTypes.string
};

IntlProvider.defaultProps = {
  lang: defaultLanguage
};

const mapStateToProps = state => ({
  lang: state.intl.lang
});

export default connect(mapStateToProps)(IntlProvider);
