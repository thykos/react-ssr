import Loadable from '@7rulnik/react-loadable';

export default Loadable({ //eslint-disable-line
  loader: () => import(/* webpackChunkName: 'MainPageContainer' */ './MainPageContainer'),
  loading: () => null
});
