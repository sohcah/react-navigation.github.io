const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const writeFileAsync = promisify(fs.writeFile);

module.exports = function(context) {
  return {
    name: 'docusaurus-plugin-redirect-html',

    postBuild({ siteConfig = {}, routesPaths = [], outDir }) {
      routesPaths.forEach(async routesPath => {
        if (routesPath === '/' || routesPath.endsWith('.html')) {
          return;
        }

        const permalink = siteConfig.url.concat(routesPath.replace(/^\//, ''));

        const html = `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${permalink}">
    <link rel="canonical" href="${permalink}">
    <title>Redirecting to ${permalink}</title>
  </head>
  <body>
    If you are not redirected automatically, follow <a href="${permalink}">this link</a>.
  </body>
</html>
        `;

        const dirCommon = path.join(outDir, `${routesPath}.html`);
        const dirEn = path.join(
          outDir,
          `${routesPath.replace('/docs/', '/docs/en/')}.html`
        );

        await mkdirp(dirCommon);
        await mkdirp(dirEn);

        await writeFileAsync(path.join(dirCommon, 'index.html'), html);
        await writeFileAsync(path.join(dirEn, 'index.html'), html);
      });
    },
  };
};
