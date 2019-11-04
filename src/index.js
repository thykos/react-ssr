import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from '@7rulnik/react-loadable';
import { ConnectedRouter } from 'react-router-redux';
import { ReduxAsyncConnect } from 'components/redux-connect/modules';
import routes from 'RouterContainer';
import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import createStore from 'reducers';

const history = createHistory();
const store = createStore(history, window.__data);

Loadable.preloadReady().then(() => {
  ReactDOM.hydrate(
    (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ReduxAsyncConnect routes={routes} helpers={{ store }} />
        </ConnectedRouter>
      </Provider>
    ), document.getElementById('root')
  );
});

