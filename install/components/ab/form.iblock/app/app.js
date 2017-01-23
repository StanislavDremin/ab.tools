/**
 * Created by dremin_s on 23.01.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";
import CAjax from 'AjaxService';

const Ajax = new CAjax({
	baseURL: '/rest/forms/iblock'
});

class AppForm {
	constructor(props) {
		this.props = Object.assign({}, this.props, props);

		this.$form = $('#' + this.props.formId);

		this.$form.on('submit', (ev) => {
			ev.preventDefault();

			this.sendForm();
		});

		this.$fields = this.$form.find('input');

		this.fields = {};
		this.validForm = true;

		this.setFields();
	}

	setFields() {
		let fields = {}, _thisFormApp = this;
		this.$fields.each(function () {
			let code = $(this).attr('name');
			fields[code] = {
				VALUE: $(this).val(),
				REQUIRED: $(this).attr('required') != undefined || false
			};
			// $(this).on('change', (ev) => {
			// 	_thisFormApp.setValue(code, ev.target.value);
			// });
			$(this).on('keypress', (ev) => {
				_thisFormApp.setValue(code, ev.target.value);
			});
			$(this).on('blur', (ev) => {
				_thisFormApp.setValue(code, ev.target.value);
			});
		});
		this.fields = fields;

		return this;
	}

	setValidField(name) {
		let resValid = true;
		if (this.fields[name] != undefined) {

			let field = this.fields[name];

			if (field.REQUIRED === true && (is.empty(field.VALUE) || field.VALUE == undefined || field.VALUE.length == 0)) {
				resValid = false;
			}

			this.fields[name]['VALID'] = resValid;
		}


		let $field = this.$form.find('[name=' + name + ']');
		if(resValid === false){
			$field.addClass('error_field');
		} else {
			$field.removeClass('error_field');
		}

		return resValid;
	}

	validAllFields(){
		let valid = 0;

		$.each(this.fields, (name, el) => {
			if(!this.setValidField(name)){
				valid++;
			}
		});

		return valid === 0 || false;
	}

	setValue(name, value){
		this.fields[name]['VALUE'] = value;
		this.setValidField(name);

		// console.info(this.fields[name]);
	}

	sendForm() {
		this.validForm = this.validAllFields();

		if(this.validForm === true) {
			Ajax.post('/saveForm', this.fields).then(res => {
				if(res.data.STATUS == 1){
					let text = '', title = this.props.goodTitle || '';
					if(this.props.goodMessage != undefined && this.props.goodMessage.length > 0){
						text = this.props.goodMessage;
					} else {
						text = 'Ваша зявка принята';
					}

					swal(title, text, 'success');
				}
			});
		}
	}
}

window.AppForm = AppForm;
export default AppForm;