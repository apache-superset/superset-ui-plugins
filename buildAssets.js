/* eslint-disable import/no-extraneous-dependencies, no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');
const concatenate = require('concatenate');

const packages = fg.sync(['packages/*'], {
  onlyDirectories: true,
});

packages.forEach(pkg => {
  // Copy images, geojsons, and raw css
  const assets = fg.sync([`${pkg}/src/**/*.{png,gif,jpg,css,geojson}`]);
  assets.forEach(filePath => {
    const newPaths = ['lib', 'esm'].map(dir => filePath.replace(`${pkg}/src`, `${pkg}/${dir}`));
    newPaths.forEach(p => {
      fs.copy(filePath, p, err => {
        if (err) {
          console.error(err);
        }
        console.log(`Copy ${filePath}`);
        console.log(`=> to ${p}`);
      });
    });
  });

  const cssFiles = fg.sync([`${pkg}/src/**/*.css`]);
  if (cssFiles.length > 0) {
    // Concatenate all css into one file
    concatenate.sync(cssFiles, `${pkg}/esm/style.css`);
    fs.copyFile(`${pkg}/esm/style.css`, `${pkg}/lib/style.css`);
  }
});
