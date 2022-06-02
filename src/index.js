var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);

Highcharts.chart('container', { /*Highcharts options*/ });