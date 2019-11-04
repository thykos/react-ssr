import { createStore as _createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'components/redux-connect/modules';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise';
import intl from 'reducers/intl';

export default function createStore(history, preloadedState) {
  const middleware = routerMiddleware(history);
  return _createStore(
    combineReducers({
      intl,
      router: routerReducer,
      reduxAsyncConnect
    }),
    preloadedState,
    composeWithDevTools(applyMiddleware(middleware, promiseMiddleware, thunk))
  );
}
