import serialize from 'serialize-javascript';

const html = ({
  store, content, assets
}) => (
  `
    <html>
      <head>
        <link href="/css/base.layout.css" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width">
        <!--</link href="${assets.css}" rel="stylesheet"/>-->
        <script>window.__data=${serialize(store.getState())};</script>
        <title>SSR</title>
      </head>
      <body>
        <div id="root">${content}</div>
        ${assets.scripts.map(script => `<script src="${assets.host}${script.file}"></script>`).join('\n')}
        <script type="text/javascript" src="${assets.js}"></script>
      </body>
    </html>
  `
);

export default html;
