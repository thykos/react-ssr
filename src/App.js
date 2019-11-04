import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import IntlProvider from 'containers/IntlProvider/IntlProvider';


class LocaledApp extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired
  };

  render() {
    return (
      <IntlProvider>
        <Fragment>
          <main>
            {renderRoutes(this.props.route.routes)}
          </main>
        </Fragment>
      </IntlProvider>
    );
  }
}


export default LocaledApp;
