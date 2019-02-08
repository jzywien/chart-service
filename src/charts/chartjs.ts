const path = require('path');
const fs = require('fs');

const chartJsPath = path.dirname(require.resolve('chart.js'));
export const chartJsSrc = fs.readFileSync(`${chartJsPath}/../dist/Chart.js`, 'utf-8');

const chartJsPluginPath = path.dirname(require.resolve('chartjs-plugin-datalabels'));
export const chartJsPluginSrc = fs.readFileSync(`${chartJsPluginPath}/../dist/chartjs-plugin-datalabels.js`, 'utf-8');
