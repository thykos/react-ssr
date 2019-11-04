import App from 'App';
import MainPageContainer from 'containers/MainPageContainer/Loadable';
import TestContainer from 'containers/test/Loadable';
import NotFoundContainer from 'containers/NotFoundContainer/Loadable';

export default [
  {
    key: 'app',
    component: App,
    routes: [
      {
        path: '/',
        key: 'main',
        exact: true,
        component: MainPageContainer
      },
      {
        path: '/test',
        key: 'test',
        exact: true,
        component: TestContainer
      },
      {
        path: '*',
        component: NotFoundContainer
      }
    ],
  }
];
