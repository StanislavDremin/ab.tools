// import configBase from './base.conf';
import Component from './BXConfigComponent';

const config = [];
let BComponent = new Component();

BComponent
	.addComponent('form_iblock', {
		name: 'ab:form.iblock',
		build: ['js','build']
	})
;

let configBase = BComponent.mergeConfig([
	'form_iblock',
]);

config.push(configBase);

export default configBase;