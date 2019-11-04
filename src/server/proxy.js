import httpProxy from 'http-proxy';
import params from 'constants/parameters';

const createProxy = (app) => {
  const proxy = httpProxy.createProxyServer({
    https: true,
    target: params.api_url,
    headers: {
      host: params.api_host
    }
  });

  proxy.on('error', (error, req, res) => {
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
    }

    const json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
  });

  app.use('/api', (req, res) => {
    proxy.web(req, res, { target: `${params.api_url}/api` });
  });
  return app;
};

export default createProxy;
