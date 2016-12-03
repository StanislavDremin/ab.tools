var webpack = require('webpack');
var path = require('path');
var mainConf = require('./MainConfig');

var BXConfigComponent = require('./BXConfigComponent');
var dir = path.join(__dirname, '..', 'components');

var config = [];
config.push(mainConf.getConfig());

// var PriceListConf = new BXConfigComponent('esd:catalog.price.list');
// config.push(PriceListConf.getConfig(mainConf.getConfig(), dir));

// var parserLogConf = new BXConfigComponent('ab:form.iblock');
// config.push(parserLogConf.getConfig(mainConf.getConfig(), dir));

module.exports = config;