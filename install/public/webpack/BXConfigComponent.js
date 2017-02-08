import path from 'path';
import is from 'is_js';
import NODE_ENV from './nodeEnv';
import fs from 'fs';

const mainFolder = path.join('..');
import MainConfig from './base.conf';

/**
 * var BComponent = new BXComponent();
 * BComponent.addComponent('subscribe.list', {
		name: 'local:esd:subscribe.list' or 'bitrix:esd:subscribe.list',
		template: '.default' or {site: 'bitrix:1c-interes_v2.0'},
		app: ['main','src.js'],
		build: ['public', 'build.js']
	})
 */
class component {
	constructor() {
		if (MainConfig === null) {
			throw new Error('Main configuration webpack is null');
		}

		this.entry = {dev: {}, prod: ''};
		this.out = {dev: '', prod: ''};
		this.components = {};
	}

	addComponent(cName, params) {
		if (!cName) {
			throw new Error('Name parameters is empty');
		}

		if (is.undefined(params.name) || is.empty(params.name)) {
			throw new Error('Component name is empty');
		}

		let name = params.name.trim().split(':');
		let folder = '', namespace = '', nameComponent = '', templateComponent = '', pathToComponent = '';

		templateComponent = name[2] != undefined ? name[2] : '.default';

		nameComponent = name[1];

		switch (name[0]) {
			case 'bitrix':
				folder = 'bitrix';
				break;
			default:
				folder = 'local';
				break;
		}

		if (name.length < 2) {
			throw new Error('Component name is not valid! For example must be "bitrix:news.list:.default"');
		}

		if (!is.propertyDefined(params, 'app')) {
			params.app = path.join('app', 'app');
		} else {
			let app = params.app;
			params.app = '';
			app.forEach(function (item, i) {
				params.app = path.join(params.app, item);
			});
		}

		if (!is.propertyDefined(params, 'build')) {
			params.build = path.join('script');
		} else {
			let build = params.build;
			params.build = '';
			build.forEach(function (item, i) {
				params.build = path.join(params.build, item);
			});
		}

		let pathToComponentApp = '';
		if (folder == 'bitrix') {
			if (params.site == undefined) {
				params.site = '.default';
			}

			pathToComponent = path.join(
				'local',
				'templates',
				params.site,
				'components',
				'bitrix',
				nameComponent,
				templateComponent
			);
			pathToComponentApp = pathToComponent;
		} else if (params.site != undefined) {
			pathToComponent = path.join(
				'local',
				'templates',
				params.site,
				'components',
				name[0],
				nameComponent,
				templateComponent
			);
			pathToComponentApp = pathToComponent;
		} else {
			pathToComponent = path.join(
				'local',
				'components',
				name[0],
				nameComponent,
			);

			if(params.build === 'script'){
				pathToComponent = path.join(pathToComponent, 'templates', templateComponent);
			}
			pathToComponentApp = path.join(
				'local',
				'components',
				name[0],
				nameComponent
			);
		}

		let fileApp = path.resolve(mainFolder, pathToComponentApp, params.app);

		this.entry.dev = {
			[path.join(pathToComponent, params.build)]: fileApp
		};
		this.entry.prod = this.entry.dev;

		this.createFile(this.entry.dev);

		this.components[cName] = {
			entry: this.entry.dev,
			output: {
				path: path.resolve(__dirname, '..'),
				filename: "[name].js"
			}
		};

		if (NODE_ENV == 'production') {
			this.components[cName] = {
				entry: this.entry.prod,
				output: {
					path: path.resolve(mainFolder),
					filename: "[name].min.js"
				}
			};
		}

		return this;
	};

	mergeConfig(items = []) {

		if (items.length == 0) {
			// throw new Error('Array of components is empty');
			return MainConfig;
		}

		if (is.undefined(MainConfig)) {
			throw new Error('Main configuration for webpack is undefined');
		}

		items.forEach((name, i) => {

			if (!is.undefined(this.components[name])) {

				if (is.undefined(MainConfig.entry)) {
					MainConfig.entry = {};
				}
				if (is.undefined(MainConfig.output)) {
					MainConfig.output = {};
				}

				MainConfig.entry = Object.assign(MainConfig.entry, this.components[name]['entry']);
				MainConfig.output = Object.assign(MainConfig.output, this.components[name]['output']);
			}
		});

		return MainConfig;
	}

	createFile(fileName) {
		try {
			let openSync = fs.openSync(fileName, "w+",);
		} catch (err) {
			try {
				if (err.code == 'ENOENT') {
					let dir = fileName.match(/^(.*)\/.*.js$/);
					try {
						let dirData = fs.mkdirSync(dir[1], '755');
					} catch (e) {
						console.info(e);
					}

					fs.writeSync(fileName, '');
				}
			} catch (errFile) {
				console.warn('File ' + fileName + ' was not created by');
			}
		}
	}
}

export default component;
