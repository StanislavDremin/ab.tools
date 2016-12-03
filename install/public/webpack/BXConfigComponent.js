var path = require('path');

var BXConfigComponent = function (componentName, templateName, dopParams) {

	this.componentName = componentName;

	if(!templateName || templateName == undefined || templateName === null){
		templateName = path.join('.default');
	}

	this.templateName = templateName;

	if (!dopParams || dopParams == undefined) {
		dopParams = {};
	}

	this.systemTemplate = true;
	if (dopParams.hasOwnProperty('system') && dopParams.system !== true)
		this.systemTemplate = dopParams.system;

	this.pathIn = '';
	this.pathOut = '';

	this.dopParams = dopParams;

	this.arComponent = this.componentName.trim().split(':');

	if (this.arComponent.length <= 1) {
		throw new Error('Укажи имя компонента в виде folder:componentName');
	}

	var pathToComponent = path.join(__dirname, '..', 'components',this.arComponent[0], this.arComponent[1]);

	if (this.systemTemplate === true) {
		if (this.dopParams.hasOwnProperty('in')) {
			if (typeof(this.dopParams.in) !== 'object') {
				this.dopParams.in = {}
			}
			if (this.dopParams.in.hasOwnProperty('folder')) {
				this.pathIn = path.join(pathToComponent, this.dopParams.in.in.folder);
			}
		} else {
			this.pathIn = path.join(pathToComponent, 'app', 'app.js');
		}
	}

	this.pathOut = path.join(pathToComponent, 'templates', this.templateName);

	this.getConfig = function (mainConfig, dir) {

		if(!dir || dir == undefined){
			dir = '';
		}

		if(!mainConfig || mainConfig == undefined || typeof(mainConfig) !== 'object'){
			throw new Error('Основной конфиг не является объектом');
		}
		var conf = mainConfig;
		var n = this.arComponent[1].split('.');
		var newName = '';

		n.forEach(function (item, i) {
			newName += item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
		});

		conf.entry = {};
		conf.entry[newName] = this.pathIn;
		conf.output = {
			path: this.pathOut,
			filename: "script.js"
		};

		return conf;
	};
};

module.exports = BXConfigComponent;