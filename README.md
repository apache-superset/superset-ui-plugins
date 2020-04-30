# @superset-ui/plugins 🔌💡

### UPDATE: The code in this repository has been migrated and merged into [@superset-ui](https://github.com/apache-superset/superset-ui).

[![Codecov branch](https://img.shields.io/codecov/c/github/apache-superset/superset-ui-plugins/master.svg?style=flat-square)](https://codecov.io/gh/apache-superset/superset-ui-plugins/branch/master)
[![Build Status](https://img.shields.io/travis/com/apache-superset/superset-ui-plugins/master.svg?style=flat-square)](https://travis-ci.com/apache-superset/superset-ui-plugins)
[![David](https://img.shields.io/david/dev/apache-superset/superset-ui-plugins.svg?style=flat-square)](https://david-dm.org/apache-superset/superset-ui-plugins?type=dev)
[![Netlify Status](https://api.netlify.com/api/v1/badges/cef8fedc-2938-4f20-9823-fcd3cd2f30b3/deploy-status)](https://app.netlify.com/sites/superset-ui-plugins/deploys)

`@superset-ui/legacy-*` packages are extracted from the classic
[Apache Superset](https://github.com/apache/incubator-superset) and converted into plugins. These
packages are extracted with minimal changes (almost as-is). They also depend on legacy API
(`viz.py`) to function.

`@superset-ui/plugin-*` packages are newer and higher quality in general. A key difference that they
do not depend on `viz.py` (which contain visualization-specific python code) and interface with
`/api/v1/query/` instead: a new generic endpoint instead meant to serve all visualizations. Also
should be written in Typescript.

We are not accepting pull requests for new community-contributed plugins to be merged into this
repository at the moment. We will keep it lean for now to improve the standard and reduce
operational load on maintenance. Bug fixes are welcome.

To setup your own plugin repository, we current have a template for new repository that you can copy
from. Go to
["superset-ui-plugins-template"](https://github.com/apache-superset/superset-ui-plugins-template)
and look for the green "Use this template" button.

## Demo (Storybook)

Most recent release: https://apache-superset.github.io/superset-ui-plugins/

Current master: https://superset-ui-plugins.netlify.com

## Packages

| Package                                                                                                                                                 | Version                                                                                                                                                                                        | Note         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [@superset-ui/plugin-chart-table](https://github.com/apache-superset/superset-ui-plugins/tree/master/packages/superset-ui-plugin-chart-table)           | [![Version](https://img.shields.io/npm/v/@superset-ui/plugin-chart-table.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-ui/plugin-chart-table.svg?style=flat-square)           |              |

| Package                                                                                                                                                                                   | Version                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@superset-ui/legacy-plugin-chart-event-flow](https://github.com/apache-superset/superset-ui-plugins/tree/master/packages/superset-ui-legacy-plugin-chart-event-flow)                     | [![Version](https://img.shields.io/npm/v/@superset-ui/legacy-plugin-chart-event-flow.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-ui/legacy-plugin-chart-event-flow.svg?style=flat-square)                     |
| [@superset-ui/legacy-plugin-chart-word-cloud](https://github.com/apache-superset/superset-ui-plugins/tree/master/packages/superset-ui-legacy-plugin-chart-word-cloud)                     | [![Version](https://img.shields.io/npm/v/@superset-ui/legacy-plugin-chart-word-cloud.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-ui/legacy-plugin-chart-word-cloud.svg?style=flat-square)                     |


## Contribution and development guide

Please read the
[contributing guidelines](https://github.com/apache-superset/superset-ui/blob/master/CONTRIBUTING.md)
which include development environment setup and other things you should know about coding in this
repo.

To build only selected plugins,

```bash
node scripts/build.js "*legacy-plugin-chart-table"
```

### License

Apache-2.0
