import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import createMemoryHistory from 'history/createMemoryHistory';
import createStore from 'reducers/index';
import { parse as parseUrl } from 'url';
import { ReduxAsyncConnect, loadOnServer } from 'components/redux-connect/modules';
import routes from 'RouterContainer';
import { Client } from 'api/client';
import { Provider } from 'react-redux';
import html from 'server/htmlTemplate';
import proxy from 'server/proxy';
import devStatic from 'server/dev';
import dnscache from 'dnscache';

// @todo move to jamiebuilds/react-loadable after implement webpack4 support
// @todo https://github.com/jamiebuilds/react-loadable/pull/110
import Loadable from '@7rulnik/react-loadable';
import { getBundles } from '@7rulnik/react-loadable/webpack';

const stats = require('../public/dist/react-loadable.json');
const webpackAssets = require('../public/dist/assets.json');

// Enable Dns caching
// Configure Dns cache
dnscache({
  enabled: true,
  ttl: 500,
  cachesize: 1000
});

const isDev = process.env.ENV === 'dev';

const outputErrors = (err) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
  }
};

const assets = isDev ?
  {
    css: 'http://localhost:3000/css/main.css',
    js: 'http://localhost:3000/dist/main.js',
    host: 'http://localhost:3000/dist/'
  }
  : {
    css: '/css/main.css',
    js: webpackAssets.main.js,
    host: '/dist/'
  };


console.log('Initializing server application...');
console.log('Compiling bundle...');

const app = express();

const server = new http.Server(app);
app.use(cookieParser());
proxy(app);

if (isDev) {
  devStatic(app);
}

app.get('*', async (req, res) => {
  const history = createMemoryHistory(req.originalUrl);
  const store = createStore(history);
  const url = req.originalUrl || req.url;
  const location = parseUrl(url);

  // await init(store, req.cookies);
  const client = new Client();
  const helpers = {
    client
  };

  loadOnServer({
    store, location, routes, helpers
  })
    .then(() => {
      const modules = [];
      const context = {};
      const appWithRouter = (
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <Provider store={store}>
            <StaticRouter location={location} context={context}>
              <ReduxAsyncConnect routes={routes} helper={helpers} />
            </StaticRouter>
          </Provider>
        </Loadable.Capture>
      );
      if (context.url) {
        req.header('Location', context.url);
        return res.send(302);
      }
      const content = ReactDOMServer.renderToString(appWithRouter);
      const bundles = getBundles(stats, modules);

      // @todo implement css
      assets.styles = bundles.filter(bundle => bundle.file.endsWith('.css'));
      assets.scripts = bundles.filter(bundle => bundle.file.endsWith('.js'));

      const template = html({
        store,
        content,
        assets
      });

      return res.send(template);
    });
});

Loadable.preloadAll().then(() => {
  server.listen(3000, (err) => {
    if (err) {
      outputErrors(err);
    }
    console.info('==> 💻  Open localhost:%s in a browser to view the app.', 3000);
  });
});
