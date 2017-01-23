import CAjax from 'axios';
import Swal from 'sweetalert';

CAjax.defaults.headers.post['Content-Type'] = 'application/json';

class AjaxService {
	constructor(params = {}, option = {}){
		this.params = {
			headers: {'Accept': 'application/json', 'ContentType': 'application/json'},
			baseURL: '/rest',
			transformResponse: [function (data) {
				if(typeof data == 'string'){
					data = JSON.parse(data);
				}

				let text = 'Внутренняя ошибка сервера';
				if(data.STATUS == 0){
					if(data.ERRORS != null && data.ERRORS.length > 0){
						text = data.ERRORS.join("\n");
						if(option.SHOW_SYSTEM_MSG && data.SYSTEM_ERR != null && data.SYSTEM_ERR.length > 0){
							text = data.SYSTEM_ERR.join("\n");
						}
					}
					Swal({
						type: 'error',
						title: 'Ошибка!',
						text: text
					});
				}

				return data;
			}],
		};

		this.params = Object.assign(this.params, params);

		return CAjax.create(this.params);
	}
}

export default AjaxService;