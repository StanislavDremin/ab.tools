// import configBase from './base.conf';
import Component from './BXConfigComponent';
import env from './nodeEnv';

const config = [];
let BComponent = new Component();

BComponent
	.addComponent('form_iblock', {
		name: 'ab:form.iblock',
		build: ['js','build']
	})
;

let configBase = BComponent.mergeConfig([]);

configBase.entry = Object.assign({}, configBase.entry, {
//	'src/js/adminCheckProduct.min.js':'../src/js/adminCheckProduct.js'
});
if(!configBase.output.hasOwnProperty('path')){
	if(env === 'production'){
		configBase.output = {
			path: path.resolve(__dirname, '..'),
			filename: "[name].min.js"
		};
	} else {
		configBase.output = {
			path: path.resolve(__dirname, '..'),
			filename: "[name].js"
		};
	}

}

config.push(configBase);

export default configBase;