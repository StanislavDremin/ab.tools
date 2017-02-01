import Swal from 'sweetalert';
import axios from 'axios';

class Service {
	constructor(params) {
		const SHOW_SYSTEM_ERR = params.SHOW_SYSTEM_MESSAGE | false;
		this.axios = {};
		this.dispatch = false;

		this.params = {
			baseURL: '/service/ajax/',
			// responseType: 'json',
			headers: {'ContentType': 'application/json', 'Accept': 'application/json'},
			transformResponse: [function (data) {

				if (typeof data == 'string') {
					data = JSON.parse(data);
				}

				let errTxt = 'Внутренняя ошибка сервера';
				if (data == null) {
					data = {
						DATA: null,
						ERRORS: null,
						STATUS: 0,
						SYSTEM: null,
					};
					Swal({title: "", text: errTxt, type: "error"});
				} else if (data.STATUS == 0) {
					if (data.ERRORS != null && data.ERRORS.length > 0) {
						errTxt = data.ERRORS.join("\n");
						if (SHOW_SYSTEM_ERR === true && data.SYSTEM != null && data.SYSTEM.length > 0) {
							errTxt = data.SYSTEM.join("\n");
							data.SYSTEM = null;
						}
					}
					Swal({
						title: 'Ошибка',
						text: errTxt,
						type: 'error'
					});
				}

				return data;
			}]
		};

		if (typeof params == 'object') {
			// $.each(params, (k, val) => {
			// 	this.params[k] = val;
			// });
			this.params = Object.assign(this.params, params);
		}

		this.axios = axios.create(this.params);

		return this.axios;
	}

	create() {
		return axios.create(this.params);
	}

	setReduxLoader(dispatch = false, type = '') {
		if(type == ''){
			type = 'SWITCH_LOADER';
		}

		if(dispatch !== false && dispatch !== null && dispatch !== undefined){
			this.dispatch = dispatch;
		}
	}

	startLoader(text = 'Загрузка...'){
		if(this.dispatch !== false)
			this.dispatch({type: 'SWITCH_LOADER', show: true, text: text});
	}

	stopLoader(){
		if(this.dispatch !== false)
			this.dispatch({type: 'SWITCH_LOADER', show: false, text: false});
	}

}

export default Service;