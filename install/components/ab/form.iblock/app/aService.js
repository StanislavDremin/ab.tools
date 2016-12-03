import swal from 'sweetalert';
import is from 'is_js';

var htmlLoader = '' +
	'<div id="preLoader_service" class="hideLoader">' +
	'<div className="loader_wrap">' +
	'<div className="icon item_content"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"/></div>' +
	'<div className="message item_content">Загрузка...</div>' +
	'</div>' +
	'</div>';

if ($('#preLoader_service').length == 0) {
	$('body').append(htmlLoader);
}

var AjaxService = function (params) {
	this.params = {
		mainUrl: '/rest',
		loader: {}
	};

	var _self = this;

	$.each(params, function (k, val) {
		_self.params[k] = val;
	});

	this.ajaxParam = {
		url: this.params.mainUrl,
		dataType: 'json',
		processData: false,
		headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
		dataFilter: function (data, type) {
			if (type == 'json') {
				var result = JSON.parse(data);
				if (result.ERRORS != null && is.array(result.ERRORS)) {
					var error = result.ERRORS.join("\n");
					_self.errorView(false, error);
				}

				data = JSON.stringify(result);
			}

			return data;
		},
		beforeSend: function () {
			$('#preLoader_service').addClass('showLoader');
		},
		complete: function () {
			$('#preLoader_service').addClass('hideLoader');
		}
	};

	this.action = function (action) {
		this.ajaxParam.url = this.params.mainUrl + action;

		return this;
	};

	this.post = function (data) {
		this.ajaxParam.data = JSON.stringify(data);
		this.ajaxParam.type = 'post';

		return this.send();
	};

	this.get = function (data) {
		if (data) {
			this.ajaxParam.url = BX.util.add_url_param(this.ajaxParam.url, data);
		}
		this.ajaxParam.type = 'get';

		return this.send();
	};

	this.send = function () {
		return $.ajax(this.ajaxParam);
	};

	this.errorView = function (title, text) {
		if (!title) {
			title = 'Ошибка!';
		}
		swal({
			title: title,
			text: text,
		});
	};
};

module.exports = AjaxService;