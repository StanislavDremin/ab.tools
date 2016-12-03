/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
		/******/
		/******/ 		// Check if module is in cache
		/******/ 		if(installedModules[moduleId])
		/******/ 			return installedModules[moduleId].exports;
		/******/
		/******/ 		// Create a new module (and put it into the cache)
		/******/ 		var module = installedModules[moduleId] = {
			/******/ 			exports: {},
			/******/ 			id: moduleId,
			/******/ 			loaded: false
			/******/ 		};
		/******/
		/******/ 		// Execute the module function
		/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		/******/
		/******/ 		// Flag the module as loaded
		/******/ 		module.loaded = true;
		/******/
		/******/ 		// Return the exports of the module
		/******/ 		return module.exports;
		/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
/************************************************************************/
/******/ ([
	/* 0 */
	/*!***********************************************!*\
	 !*** ../components/ab/form.iblock/app/app.js ***!
	 \***********************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		var _formMainForm = __webpack_require__(/*! ./form/MainForm */ 1);

		var _formMainForm2 = _interopRequireDefault(_formMainForm);

		BX(function () {
			var app = $('#ab_form_add'),
				params = app.data('enc');
			ReactDOM.render(React.createElement(_formMainForm2['default'], {
				formId: 'ab_feedback1',
				arParams: params
			}), app[0]);
		});

		/***/ },
	/* 1 */
	/*!*********************************************************!*\
	 !*** ../components/ab/form.iblock/app/form/MainForm.js ***!
	 \*********************************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		var _aService = __webpack_require__(/*! ../aService */ 2);

		var _aService2 = _interopRequireDefault(_aService);

		var _sweetalert = __webpack_require__(/*! sweetalert */ 3);

		var _sweetalert2 = _interopRequireDefault(_sweetalert);

		var Ajax = new _aService2['default']({
			mainUrl: '/rest/AB/Feedback'
		});

		var MainForm = React.createClass({
			displayName: 'MainForm',

			obForm: {},
			obFields: {},
			types: ['input', 'select', 'textarea'],

			validField: function validField(target) {
				if (target.required && (target.value === false || target.value == '' || target.value === undefined)) {
					this.obFields[target.name].addClass('ab_error_field');
					this.setValidForm(false);
				}
			},

			getInitialState: function getInitialState() {
				return {
					Fields: {},
					Form: {
						valid: true,
						pristine: true
					}
				};
			},

			setValidForm: function setValidForm(flag) {
				var form = this.state.Form;
				form.valid = flag;
				this.setState({ Form: form });
			},

			setPristineForm: function setPristineForm(flag) {
				var form = this.state.Form;
				form.pristine = flag;
				this.setState({ Form: form });
			},

			sendForm: function sendForm(ev) {
				ev.preventDefault();

				this.setValidForm(true);

				$('.ab_error_field').removeClass('ab_error_field');

				$.each(this.obFields, (function (name, field) {
					this.validField(field[0]);
				}).bind(this));

				if (this.state.Form.valid === true) {
					this.request();
				}
			},

			request: function request() {
				var post = { FIELDS: {} };
				$.each(this.state.Fields, function (k, target) {
					post['FIELDS'][target.name] = target.value;
				});

				if (this.props.arParams != undefined) {
					post['PARAMS'] = this.props.arParams;
				}
				Ajax.action('/save').post(post).then((function (result) {
					var title = 'Все гуд',
						message = 'Замечательно? Замечаааательно)) Елки зеленые, калаш мне в зад!!!';
					if (result.STATUS == 1) {
						if (typeof this.props.GoodText == 'object') {
							title = this.props.GoodText.title ? this.props.GoodText.title : 'Все гуд';
							message = this.props.GoodText.msg ? this.props.GoodText.msg : 'Замечательно? Замечаааательно)) Да!!!';
						}
						(0, _sweetalert2['default'])(title, message, "success");
						this.clearForm();
					}
				}).bind(this));
			},

			clearForm: function clearForm() {
				var Fields = this.state.Fields;
				$.each(this.obFields, (function (name, field) {
					this.obFields[name].val('');
					delete Fields[name];
				}).bind(this));

				this.setState({ Fields: Fields });
			},

			createFields: function createFields($obForm) {
				var obFields = {};
				this.types.map((function (type) {
					$obForm.find(type).each(function () {
						var field = $(this);
						field.$$data = {
							valid: false,
							pristine: true,
							dirty: false
						};
						obFields[field.attr('name')] = field;
					});
				}).bind(this));

				this.obFields = obFields;
			},

			watcher: function watcher(ev) {
				this.obFields[ev.target.name].removeClass('ab_error_field');

				var form = this.state.Form;
				form.pristine = false;
				this.setState({ Form: form });

				var Fields = this.state.Fields;
				Fields[ev.target.name] = ev.target;

				this.obFields[ev.target.name].$$data.pristine = false;
				this.obFields[ev.target.name].$$data.dirty = true;

				this.setState({ Fields: Fields });
			},

			componentDidMount: function componentDidMount() {
				this.obForm = $('#' + this.props.formId);
				this.createFields(this.obForm);
			},

			render: function render() {

				var colSmLeft = 'col-sm-' + 3,
					colSmRight = 'col-sm-' + 9,
					colSmLabel = colSmLeft + ' ' + 'control-label',
					colSmOffset = 'col-sm-offset-3 col-sm-9';

				return React.createElement(
					'div',
					{ className: 'ab_form_wrap' },
					React.createElement(
						'h3',
						{ className: colSmOffset },
						'Обратная связь'
					),
					React.createElement(
						'form',
						{ className: 'form-horizontal', noValidate: 'noValidate', autoComplete: 'off', action: '',
							method: 'POST', onSubmit: this.sendForm, id: this.props.formId },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'label',
								{ 'for': 'FIELD_EMAIL', className: colSmLabel },
								'Email'
							),
							React.createElement(
								'div',
								{ className: colSmRight },
								React.createElement('input', { id: 'FIELD_EMAIL', type: 'text', required: true, name: 'EMAIL', className: 'form-control', placeholder: 'Email',
									onChange: this.watcher })
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'label',
								{ 'for': 'FIELD_PHONE', className: colSmLabel },
								'Телефон'
							),
							React.createElement(
								'div',
								{ className: colSmRight },
								React.createElement('input', { id: 'FIELD_PHONE', type: 'text', name: 'PHONE', className: 'form-control', placeholder: 'Телефон',
									onChange: this.watcher })
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'label',
								{ 'for': 'FIELD_NAME', className: colSmLabel },
								'Имя'
							),
							React.createElement(
								'div',
								{ className: colSmRight },
								React.createElement('input', { id: 'FIELD_NAME', type: 'text', name: 'NAME',
									className: 'form-control', placeholder: 'Имя',
									onChange: this.watcher })
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'label',
								{ 'for': 'FIELD_PREVIEW_TEXT', className: colSmLabel },
								'Сообщение'
							),
							React.createElement(
								'div',
								{ className: colSmRight },
								React.createElement('textarea', { className: 'form-control', id: 'FIELD_PREVIEW_TEXT',
									name: 'PREVIEW_TEXT', rows: '5', onChange: this.watcher })
							)
						),
						React.createElement(
							'div',
							{ className: 'form-group ab_btn_group_form' },
							React.createElement(
								'div',
								{ className: colSmOffset },
								React.createElement(
									'button',
									{ type: 'submit', className: 'btn btn-success' },
									'Отправить'
								),
								React.createElement(
									'button',
									{ type: 'button', className: 'btn btn-danger' },
									'Отменить'
								)
							)
						)
					)
				);
			}
		});

		module.exports = MainForm;

		/***/ },
	/* 2 */
	/*!****************************************************!*\
	 !*** ../components/ab/form.iblock/app/aService.js ***!
	 \****************************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		var _sweetalert = __webpack_require__(/*! sweetalert */ 3);

		var _sweetalert2 = _interopRequireDefault(_sweetalert);

		var _is_js = __webpack_require__(/*! is_js */ 12);

		var _is_js2 = _interopRequireDefault(_is_js);

		var htmlLoader = '' + '<div id="preLoader_service" class="hideLoader">' + '<div className="loader_wrap">' + '<div className="icon item_content"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"/></div>' + '<div className="message item_content">Загрузка...</div>' + '</div>' + '</div>';

		if ($('#preLoader_service').length == 0) {
			$('body').append(htmlLoader);
		}

		var AjaxService = function AjaxService(params) {
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
				headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
				dataFilter: function dataFilter(data, type) {
					if (type == 'json') {
						var result = JSON.parse(data);
						if (result.ERRORS != null && _is_js2['default'].array(result.ERRORS)) {
							var error = result.ERRORS.join("\n");
							_self.errorView(false, error);
						}

						data = JSON.stringify(result);
					}

					return data;
				},
				beforeSend: function beforeSend() {
					$('#preLoader_service').addClass('showLoader');
				},
				complete: function complete() {
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
				(0, _sweetalert2['default'])({
					title: title,
					text: text
				});
			};
		};

		module.exports = AjaxService;

		/***/ },
	/* 3 */
	/*!****************************************!*\
	 !*** ./~/sweetalert/lib/sweetalert.js ***!
	 \****************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

		Object.defineProperty(exports, '__esModule', {
			value: true
		});
		// SweetAlert
		// 2014-2015 (c) - Tristan Edwards
		// github.com/t4t5/sweetalert

		/*
		 * jQuery-like functions for manipulating the DOM
		 */

		var _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation = __webpack_require__(/*! ./modules/handle-dom */ 4);

		/*
		 * Handy utilities
		 */

		var _extend$hexToRgb$isIE8$logStr$colorLuminance = __webpack_require__(/*! ./modules/utils */ 5);

		/*
		 *  Handle sweetAlert's DOM elements
		 */

		var _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition = __webpack_require__(/*! ./modules/handle-swal-dom */ 6);

		// Handle button events and keyboard events

		var _handleButton$handleConfirm$handleCancel = __webpack_require__(/*! ./modules/handle-click */ 9);

		var _handleKeyDown = __webpack_require__(/*! ./modules/handle-key */ 10);

		var _handleKeyDown2 = _interopRequireWildcard(_handleKeyDown);

		// Default values

		var _defaultParams = __webpack_require__(/*! ./modules/default-params */ 7);

		var _defaultParams2 = _interopRequireWildcard(_defaultParams);

		var _setParameters = __webpack_require__(/*! ./modules/set-params */ 11);

		var _setParameters2 = _interopRequireWildcard(_setParameters);

		/*
		 * Remember state in cases where opening and handling a modal will fiddle with it.
		 * (We also use window.previousActiveElement as a global variable)
		 */
		var previousWindowKeyDown;
		var lastFocusedButton;

		/*
		 * Global sweetAlert function
		 * (this is what the user calls)
		 */
		var sweetAlert, swal;

		exports['default'] = sweetAlert = swal = function () {
			var customizations = arguments[0];

			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.addClass(document.body, 'stop-scrolling');
			_sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.resetInput();

			/*
			 * Use argument if defined or default value from params object otherwise.
			 * Supports the case where a default value is boolean true and should be
			 * overridden by a corresponding explicit argument which is boolean false.
			 */
			function argumentOrDefault(key) {
				var args = customizations;
				return args[key] === undefined ? _defaultParams2['default'][key] : args[key];
			}

			if (customizations === undefined) {
				_extend$hexToRgb$isIE8$logStr$colorLuminance.logStr('SweetAlert expects at least 1 attribute!');
				return false;
			}

			var params = _extend$hexToRgb$isIE8$logStr$colorLuminance.extend({}, _defaultParams2['default']);

			switch (typeof customizations) {

				// Ex: swal("Hello", "Just testing", "info");
				case 'string':
					params.title = customizations;
					params.text = arguments[1] || '';
					params.type = arguments[2] || '';
					break;

				// Ex: swal({ title:"Hello", text: "Just testing", type: "info" });
				case 'object':
					if (customizations.title === undefined) {
						_extend$hexToRgb$isIE8$logStr$colorLuminance.logStr('Missing "title" argument!');
						return false;
					}

					params.title = customizations.title;

					for (var customName in _defaultParams2['default']) {
						params[customName] = argumentOrDefault(customName);
					}

					// Show "Confirm" instead of "OK" if cancel button is visible
					params.confirmButtonText = params.showCancelButton ? 'Confirm' : _defaultParams2['default'].confirmButtonText;
					params.confirmButtonText = argumentOrDefault('confirmButtonText');

					// Callback function when clicking on "OK"/"Cancel"
					params.doneFunction = arguments[1] || null;

					break;

				default:
					_extend$hexToRgb$isIE8$logStr$colorLuminance.logStr('Unexpected type of argument! Expected "string" or "object", got ' + typeof customizations);
					return false;

			}

			_setParameters2['default'](params);
			_sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.fixVerticalPosition();
			_sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.openModal(arguments[1]);

			// Modal interactions
			var modal = _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getModal();

			/*
			 * Make sure all modal buttons respond to all events
			 */
			var $buttons = modal.querySelectorAll('button');
			var buttonEvents = ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onfocus'];
			var onButtonEvent = function onButtonEvent(e) {
				return _handleButton$handleConfirm$handleCancel.handleButton(e, params, modal);
			};

			for (var btnIndex = 0; btnIndex < $buttons.length; btnIndex++) {
				for (var evtIndex = 0; evtIndex < buttonEvents.length; evtIndex++) {
					var btnEvt = buttonEvents[evtIndex];
					$buttons[btnIndex][btnEvt] = onButtonEvent;
				}
			}

			// Clicking outside the modal dismisses it (if allowed by user)
			_sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getOverlay().onclick = onButtonEvent;

			previousWindowKeyDown = window.onkeydown;

			var onKeyEvent = function onKeyEvent(e) {
				return _handleKeyDown2['default'](e, params, modal);
			};
			window.onkeydown = onKeyEvent;

			window.onfocus = function () {
				// When the user has focused away and focused back from the whole window.
				setTimeout(function () {
					// Put in a timeout to jump out of the event sequence.
					// Calling focus() in the event sequence confuses things.
					if (lastFocusedButton !== undefined) {
						lastFocusedButton.focus();
						lastFocusedButton = undefined;
					}
				}, 0);
			};

			// Show alert with enabled buttons always
			swal.enableButtons();
		};

		/*
		 * Set default params for each popup
		 * @param {Object} userParams
		 */
		sweetAlert.setDefaults = swal.setDefaults = function (userParams) {
			if (!userParams) {
				throw new Error('userParams is required');
			}
			if (typeof userParams !== 'object') {
				throw new Error('userParams has to be a object');
			}

			_extend$hexToRgb$isIE8$logStr$colorLuminance.extend(_defaultParams2['default'], userParams);
		};

		/*
		 * Animation when closing modal
		 */
		sweetAlert.close = swal.close = function () {
			var modal = _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getModal();

			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.fadeOut(_sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getOverlay(), 5);
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.fadeOut(modal, 5);
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass(modal, 'showSweetAlert');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.addClass(modal, 'hideSweetAlert');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass(modal, 'visible');

			/*
			 * Reset icon animations
			 */
			var $successIcon = modal.querySelector('.sa-icon.sa-success');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($successIcon, 'animate');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($successIcon.querySelector('.sa-tip'), 'animateSuccessTip');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($successIcon.querySelector('.sa-long'), 'animateSuccessLong');

			var $errorIcon = modal.querySelector('.sa-icon.sa-error');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($errorIcon, 'animateErrorIcon');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($errorIcon.querySelector('.sa-x-mark'), 'animateXMark');

			var $warningIcon = modal.querySelector('.sa-icon.sa-warning');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($warningIcon, 'pulseWarning');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($warningIcon.querySelector('.sa-body'), 'pulseWarningIns');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($warningIcon.querySelector('.sa-dot'), 'pulseWarningIns');

			// Reset custom class (delay so that UI changes aren't visible)
			setTimeout(function () {
				var customClass = modal.getAttribute('data-custom-class');
				_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass(modal, customClass);
			}, 300);

			// Make page scrollable again
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass(document.body, 'stop-scrolling');

			// Reset the page to its previous state
			window.onkeydown = previousWindowKeyDown;
			if (window.previousActiveElement) {
				window.previousActiveElement.focus();
			}
			lastFocusedButton = undefined;
			clearTimeout(modal.timeout);

			return true;
		};

		/*
		 * Validation of the input field is done by user
		 * If something is wrong => call showInputError with errorMessage
		 */
		sweetAlert.showInputError = swal.showInputError = function (errorMessage) {
			var modal = _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getModal();

			var $errorIcon = modal.querySelector('.sa-input-error');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.addClass($errorIcon, 'show');

			var $errorContainer = modal.querySelector('.sa-error-container');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.addClass($errorContainer, 'show');

			$errorContainer.querySelector('p').innerHTML = errorMessage;

			setTimeout(function () {
				sweetAlert.enableButtons();
			}, 1);

			modal.querySelector('input').focus();
		};

		/*
		 * Reset input error DOM elements
		 */
		sweetAlert.resetInputError = swal.resetInputError = function (event) {
			// If press enter => ignore
			if (event && event.keyCode === 13) {
				return false;
			}

			var $modal = _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getModal();

			var $errorIcon = $modal.querySelector('.sa-input-error');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($errorIcon, 'show');

			var $errorContainer = $modal.querySelector('.sa-error-container');
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide$isDescendant$getTopMargin$fadeIn$fadeOut$fireClick$stopEventPropagation.removeClass($errorContainer, 'show');
		};

		/*
		 * Disable confirm and cancel buttons
		 */
		sweetAlert.disableButtons = swal.disableButtons = function (event) {
			var modal = _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getModal();
			var $confirmButton = modal.querySelector('button.confirm');
			var $cancelButton = modal.querySelector('button.cancel');
			$confirmButton.disabled = true;
			$cancelButton.disabled = true;
		};

		/*
		 * Enable confirm and cancel buttons
		 */
		sweetAlert.enableButtons = swal.enableButtons = function (event) {
			var modal = _sweetAlertInitialize$getModal$getOverlay$getInput$setFocusStyle$openModal$resetInput$fixVerticalPosition.getModal();
			var $confirmButton = modal.querySelector('button.confirm');
			var $cancelButton = modal.querySelector('button.cancel');
			$confirmButton.disabled = false;
			$cancelButton.disabled = false;
		};

		if (typeof window !== 'undefined') {
			// The 'handle-click' module requires
			// that 'sweetAlert' was set as global.
			window.sweetAlert = window.swal = sweetAlert;
		} else {
			_extend$hexToRgb$isIE8$logStr$colorLuminance.logStr('SweetAlert is a frontend module!');
		}
		module.exports = exports['default'];

		/***/ },
	/* 4 */
	/*!************************************************!*\
	 !*** ./~/sweetalert/lib/modules/handle-dom.js ***!
	 \************************************************/
	/***/ function(module, exports) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});
		var hasClass = function hasClass(elem, className) {
			return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
		};

		var addClass = function addClass(elem, className) {
			if (!hasClass(elem, className)) {
				elem.className += ' ' + className;
			}
		};

		var removeClass = function removeClass(elem, className) {
			var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
			if (hasClass(elem, className)) {
				while (newClass.indexOf(' ' + className + ' ') >= 0) {
					newClass = newClass.replace(' ' + className + ' ', ' ');
				}
				elem.className = newClass.replace(/^\s+|\s+$/g, '');
			}
		};

		var escapeHtml = function escapeHtml(str) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(str));
			return div.innerHTML;
		};

		var _show = function _show(elem) {
			elem.style.opacity = '';
			elem.style.display = 'block';
		};

		var show = function show(elems) {
			if (elems && !elems.length) {
				return _show(elems);
			}
			for (var i = 0; i < elems.length; ++i) {
				_show(elems[i]);
			}
		};

		var _hide = function _hide(elem) {
			elem.style.opacity = '';
			elem.style.display = 'none';
		};

		var hide = function hide(elems) {
			if (elems && !elems.length) {
				return _hide(elems);
			}
			for (var i = 0; i < elems.length; ++i) {
				_hide(elems[i]);
			}
		};

		var isDescendant = function isDescendant(parent, child) {
			var node = child.parentNode;
			while (node !== null) {
				if (node === parent) {
					return true;
				}
				node = node.parentNode;
			}
			return false;
		};

		var getTopMargin = function getTopMargin(elem) {
			elem.style.left = '-9999px';
			elem.style.display = 'block';

			var height = elem.clientHeight,
				padding;
			if (typeof getComputedStyle !== 'undefined') {
				// IE 8
				padding = parseInt(getComputedStyle(elem).getPropertyValue('padding-top'), 10);
			} else {
				padding = parseInt(elem.currentStyle.padding);
			}

			elem.style.left = '';
			elem.style.display = 'none';
			return '-' + parseInt((height + padding) / 2) + 'px';
		};

		var fadeIn = function fadeIn(elem, interval) {
			if (+elem.style.opacity < 1) {
				interval = interval || 16;
				elem.style.opacity = 0;
				elem.style.display = 'block';
				var last = +new Date();
				var tick = (function (_tick) {
					function tick() {
						return _tick.apply(this, arguments);
					}

					tick.toString = function () {
						return _tick.toString();
					};

					return tick;
				})(function () {
					elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
					last = +new Date();

					if (+elem.style.opacity < 1) {
						setTimeout(tick, interval);
					}
				});
				tick();
			}
			elem.style.display = 'block'; //fallback IE8
		};

		var fadeOut = function fadeOut(elem, interval) {
			interval = interval || 16;
			elem.style.opacity = 1;
			var last = +new Date();
			var tick = (function (_tick2) {
				function tick() {
					return _tick2.apply(this, arguments);
				}

				tick.toString = function () {
					return _tick2.toString();
				};

				return tick;
			})(function () {
				elem.style.opacity = +elem.style.opacity - (new Date() - last) / 100;
				last = +new Date();

				if (+elem.style.opacity > 0) {
					setTimeout(tick, interval);
				} else {
					elem.style.display = 'none';
				}
			});
			tick();
		};

		var fireClick = function fireClick(node) {
			// Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
			// Then fixed for today's Chrome browser.
			if (typeof MouseEvent === 'function') {
				// Up-to-date approach
				var mevt = new MouseEvent('click', {
					view: window,
					bubbles: false,
					cancelable: true
				});
				node.dispatchEvent(mevt);
			} else if (document.createEvent) {
				// Fallback
				var evt = document.createEvent('MouseEvents');
				evt.initEvent('click', false, false);
				node.dispatchEvent(evt);
			} else if (document.createEventObject) {
				node.fireEvent('onclick');
			} else if (typeof node.onclick === 'function') {
				node.onclick();
			}
		};

		var stopEventPropagation = function stopEventPropagation(e) {
			// In particular, make sure the space bar doesn't scroll the main window.
			if (typeof e.stopPropagation === 'function') {
				e.stopPropagation();
				e.preventDefault();
			} else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
				window.event.cancelBubble = true;
			}
		};

		exports.hasClass = hasClass;
		exports.addClass = addClass;
		exports.removeClass = removeClass;
		exports.escapeHtml = escapeHtml;
		exports._show = _show;
		exports.show = show;
		exports._hide = _hide;
		exports.hide = hide;
		exports.isDescendant = isDescendant;
		exports.getTopMargin = getTopMargin;
		exports.fadeIn = fadeIn;
		exports.fadeOut = fadeOut;
		exports.fireClick = fireClick;
		exports.stopEventPropagation = stopEventPropagation;

		/***/ },
	/* 5 */
	/*!*******************************************!*\
	 !*** ./~/sweetalert/lib/modules/utils.js ***!
	 \*******************************************/
	/***/ function(module, exports) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});
		/*
		 * Allow user to pass their own params
		 */
		var extend = function extend(a, b) {
			for (var key in b) {
				if (b.hasOwnProperty(key)) {
					a[key] = b[key];
				}
			}
			return a;
		};

		/*
		 * Convert HEX codes to RGB values (#000000 -> rgb(0,0,0))
		 */
		var hexToRgb = function hexToRgb(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
		};

		/*
		 * Check if the user is using Internet Explorer 8 (for fallbacks)
		 */
		var isIE8 = function isIE8() {
			return window.attachEvent && !window.addEventListener;
		};

		/*
		 * IE compatible logging for developers
		 */
		var logStr = function logStr(string) {
			if (window.console) {
				// IE...
				window.console.log('SweetAlert: ' + string);
			}
		};

		/*
		 * Set hover, active and focus-states for buttons
		 * (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
		 */
		var colorLuminance = function colorLuminance(hex, lum) {
			// Validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}
			lum = lum || 0;

			// Convert to decimal and change luminosity
			var rgb = '#';
			var c;
			var i;

			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
				rgb += ('00' + c).substr(c.length);
			}

			return rgb;
		};

		exports.extend = extend;
		exports.hexToRgb = hexToRgb;
		exports.isIE8 = isIE8;
		exports.logStr = logStr;
		exports.colorLuminance = colorLuminance;

		/***/ },
	/* 6 */
	/*!*****************************************************!*\
	 !*** ./~/sweetalert/lib/modules/handle-swal-dom.js ***!
	 \*****************************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

		Object.defineProperty(exports, '__esModule', {
			value: true
		});

		var _hexToRgb = __webpack_require__(/*! ./utils */ 5);

		var _removeClass$getTopMargin$fadeIn$show$addClass = __webpack_require__(/*! ./handle-dom */ 4);

		var _defaultParams = __webpack_require__(/*! ./default-params */ 7);

		var _defaultParams2 = _interopRequireWildcard(_defaultParams);

		/*
		 * Add modal + overlay to DOM
		 */

		var _injectedHTML = __webpack_require__(/*! ./injected-html */ 8);

		var _injectedHTML2 = _interopRequireWildcard(_injectedHTML);

		var modalClass = '.sweet-alert';
		var overlayClass = '.sweet-overlay';

		var sweetAlertInitialize = function sweetAlertInitialize() {
			var sweetWrap = document.createElement('div');
			sweetWrap.innerHTML = _injectedHTML2['default'];

			// Append elements to body
			while (sweetWrap.firstChild) {
				document.body.appendChild(sweetWrap.firstChild);
			}
		};

		/*
		 * Get DOM element of modal
		 */
		var getModal = (function (_getModal) {
			function getModal() {
				return _getModal.apply(this, arguments);
			}

			getModal.toString = function () {
				return _getModal.toString();
			};

			return getModal;
		})(function () {
			var $modal = document.querySelector(modalClass);

			if (!$modal) {
				sweetAlertInitialize();
				$modal = getModal();
			}

			return $modal;
		});

		/*
		 * Get DOM element of input (in modal)
		 */
		var getInput = function getInput() {
			var $modal = getModal();
			if ($modal) {
				return $modal.querySelector('input');
			}
		};

		/*
		 * Get DOM element of overlay
		 */
		var getOverlay = function getOverlay() {
			return document.querySelector(overlayClass);
		};

		/*
		 * Add box-shadow style to button (depending on its chosen bg-color)
		 */
		var setFocusStyle = function setFocusStyle($button, bgColor) {
			var rgbColor = _hexToRgb.hexToRgb(bgColor);
			$button.style.boxShadow = '0 0 2px rgba(' + rgbColor + ', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';
		};

		/*
		 * Animation when opening modal
		 */
		var openModal = function openModal(callback) {
			var $modal = getModal();
			_removeClass$getTopMargin$fadeIn$show$addClass.fadeIn(getOverlay(), 10);
			_removeClass$getTopMargin$fadeIn$show$addClass.show($modal);
			_removeClass$getTopMargin$fadeIn$show$addClass.addClass($modal, 'showSweetAlert');
			_removeClass$getTopMargin$fadeIn$show$addClass.removeClass($modal, 'hideSweetAlert');

			window.previousActiveElement = document.activeElement;
			var $okButton = $modal.querySelector('button.confirm');
			$okButton.focus();

			setTimeout(function () {
				_removeClass$getTopMargin$fadeIn$show$addClass.addClass($modal, 'visible');
			}, 500);

			var timer = $modal.getAttribute('data-timer');

			if (timer !== 'null' && timer !== '') {
				var timerCallback = callback;
				$modal.timeout = setTimeout(function () {
					var doneFunctionExists = (timerCallback || null) && $modal.getAttribute('data-has-done-function') === 'true';
					if (doneFunctionExists) {
						timerCallback(null);
					} else {
						sweetAlert.close();
					}
				}, timer);
			}
		};

		/*
		 * Reset the styling of the input
		 * (for example if errors have been shown)
		 */
		var resetInput = function resetInput() {
			var $modal = getModal();
			var $input = getInput();

			_removeClass$getTopMargin$fadeIn$show$addClass.removeClass($modal, 'show-input');
			$input.value = _defaultParams2['default'].inputValue;
			$input.setAttribute('type', _defaultParams2['default'].inputType);
			$input.setAttribute('placeholder', _defaultParams2['default'].inputPlaceholder);

			resetInputError();
		};

		var resetInputError = function resetInputError(event) {
			// If press enter => ignore
			if (event && event.keyCode === 13) {
				return false;
			}

			var $modal = getModal();

			var $errorIcon = $modal.querySelector('.sa-input-error');
			_removeClass$getTopMargin$fadeIn$show$addClass.removeClass($errorIcon, 'show');

			var $errorContainer = $modal.querySelector('.sa-error-container');
			_removeClass$getTopMargin$fadeIn$show$addClass.removeClass($errorContainer, 'show');
		};

		/*
		 * Set "margin-top"-property on modal based on its computed height
		 */
		var fixVerticalPosition = function fixVerticalPosition() {
			var $modal = getModal();
			$modal.style.marginTop = _removeClass$getTopMargin$fadeIn$show$addClass.getTopMargin(getModal());
		};

		exports.sweetAlertInitialize = sweetAlertInitialize;
		exports.getModal = getModal;
		exports.getOverlay = getOverlay;
		exports.getInput = getInput;
		exports.setFocusStyle = setFocusStyle;
		exports.openModal = openModal;
		exports.resetInput = resetInput;
		exports.resetInputError = resetInputError;
		exports.fixVerticalPosition = fixVerticalPosition;

		/***/ },
	/* 7 */
	/*!****************************************************!*\
	 !*** ./~/sweetalert/lib/modules/default-params.js ***!
	 \****************************************************/
	/***/ function(module, exports) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});
		var defaultParams = {
			title: '',
			text: '',
			type: null,
			allowOutsideClick: false,
			showConfirmButton: true,
			showCancelButton: false,
			closeOnConfirm: true,
			closeOnCancel: true,
			confirmButtonText: 'OK',
			confirmButtonColor: '#8CD4F5',
			cancelButtonText: 'Cancel',
			imageUrl: null,
			imageSize: null,
			timer: null,
			customClass: '',
			html: false,
			animation: true,
			allowEscapeKey: true,
			inputType: 'text',
			inputPlaceholder: '',
			inputValue: '',
			showLoaderOnConfirm: false
		};

		exports['default'] = defaultParams;
		module.exports = exports['default'];

		/***/ },
	/* 8 */
	/*!***************************************************!*\
	 !*** ./~/sweetalert/lib/modules/injected-html.js ***!
	 \***************************************************/
	/***/ function(module, exports) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		var injectedHTML =

			// Dark overlay
			"<div class=\"sweet-overlay\" tabIndex=\"-1\"></div>" +

			// Modal
			"<div class=\"sweet-alert\">" +

			// Error icon
			"<div class=\"sa-icon sa-error\">\n      <span class=\"sa-x-mark\">\n        <span class=\"sa-line sa-left\"></span>\n        <span class=\"sa-line sa-right\"></span>\n      </span>\n    </div>" +

			// Warning icon
			"<div class=\"sa-icon sa-warning\">\n      <span class=\"sa-body\"></span>\n      <span class=\"sa-dot\"></span>\n    </div>" +

			// Info icon
			"<div class=\"sa-icon sa-info\"></div>" +

			// Success icon
			"<div class=\"sa-icon sa-success\">\n      <span class=\"sa-line sa-tip\"></span>\n      <span class=\"sa-line sa-long\"></span>\n\n      <div class=\"sa-placeholder\"></div>\n      <div class=\"sa-fix\"></div>\n    </div>" + "<div class=\"sa-icon sa-custom\"></div>" +

			// Title, text and input
			"<h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type=\"text\" tabIndex=\"3\" />\n      <div class=\"sa-input-error\"></div>\n    </fieldset>" +

			// Input errors
			"<div class=\"sa-error-container\">\n      <div class=\"icon\">!</div>\n      <p>Not valid!</p>\n    </div>" +

			// Cancel and confirm buttons
			"<div class=\"sa-button-container\">\n      <button class=\"cancel\" tabIndex=\"2\">Cancel</button>\n      <div class=\"sa-confirm-button-container\">\n        <button class=\"confirm\" tabIndex=\"1\">OK</button>" +

			// Loading animation
			"<div class=\"la-ball-fall\">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div>" +

			// End of modal
			"</div>";

		exports["default"] = injectedHTML;
		module.exports = exports["default"];

		/***/ },
	/* 9 */
	/*!**************************************************!*\
	 !*** ./~/sweetalert/lib/modules/handle-click.js ***!
	 \**************************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});

		var _colorLuminance = __webpack_require__(/*! ./utils */ 5);

		var _getModal = __webpack_require__(/*! ./handle-swal-dom */ 6);

		var _hasClass$isDescendant = __webpack_require__(/*! ./handle-dom */ 4);

		/*
		 * User clicked on "Confirm"/"OK" or "Cancel"
		 */
		var handleButton = function handleButton(event, params, modal) {
			var e = event || window.event;
			var target = e.target || e.srcElement;

			var targetedConfirm = target.className.indexOf('confirm') !== -1;
			var targetedOverlay = target.className.indexOf('sweet-overlay') !== -1;
			var modalIsVisible = _hasClass$isDescendant.hasClass(modal, 'visible');
			var doneFunctionExists = params.doneFunction && modal.getAttribute('data-has-done-function') === 'true';

			// Since the user can change the background-color of the confirm button programmatically,
			// we must calculate what the color should be on hover/active
			var normalColor, hoverColor, activeColor;
			if (targetedConfirm && params.confirmButtonColor) {
				normalColor = params.confirmButtonColor;
				hoverColor = _colorLuminance.colorLuminance(normalColor, -0.04);
				activeColor = _colorLuminance.colorLuminance(normalColor, -0.14);
			}

			function shouldSetConfirmButtonColor(color) {
				if (targetedConfirm && params.confirmButtonColor) {
					target.style.backgroundColor = color;
				}
			}

			switch (e.type) {
				case 'mouseover':
					shouldSetConfirmButtonColor(hoverColor);
					break;

				case 'mouseout':
					shouldSetConfirmButtonColor(normalColor);
					break;

				case 'mousedown':
					shouldSetConfirmButtonColor(activeColor);
					break;

				case 'mouseup':
					shouldSetConfirmButtonColor(hoverColor);
					break;

				case 'focus':
					var $confirmButton = modal.querySelector('button.confirm');
					var $cancelButton = modal.querySelector('button.cancel');

					if (targetedConfirm) {
						$cancelButton.style.boxShadow = 'none';
					} else {
						$confirmButton.style.boxShadow = 'none';
					}
					break;

				case 'click':
					var clickedOnModal = modal === target;
					var clickedOnModalChild = _hasClass$isDescendant.isDescendant(modal, target);

					// Ignore click outside if allowOutsideClick is false
					if (!clickedOnModal && !clickedOnModalChild && modalIsVisible && !params.allowOutsideClick) {
						break;
					}

					if (targetedConfirm && doneFunctionExists && modalIsVisible) {
						handleConfirm(modal, params);
					} else if (doneFunctionExists && modalIsVisible || targetedOverlay) {
						handleCancel(modal, params);
					} else if (_hasClass$isDescendant.isDescendant(modal, target) && target.tagName === 'BUTTON') {
						sweetAlert.close();
					}
					break;
			}
		};

		/*
		 *  User clicked on "Confirm"/"OK"
		 */
		var handleConfirm = function handleConfirm(modal, params) {
			var callbackValue = true;

			if (_hasClass$isDescendant.hasClass(modal, 'show-input')) {
				callbackValue = modal.querySelector('input').value;

				if (!callbackValue) {
					callbackValue = '';
				}
			}

			params.doneFunction(callbackValue);

			if (params.closeOnConfirm) {
				sweetAlert.close();
			}
			// Disable cancel and confirm button if the parameter is true
			if (params.showLoaderOnConfirm) {
				sweetAlert.disableButtons();
			}
		};

		/*
		 *  User clicked on "Cancel"
		 */
		var handleCancel = function handleCancel(modal, params) {
			// Check if callback function expects a parameter (to track cancel actions)
			var functionAsStr = String(params.doneFunction).replace(/\s/g, '');
			var functionHandlesCancel = functionAsStr.substring(0, 9) === 'function(' && functionAsStr.substring(9, 10) !== ')';

			if (functionHandlesCancel) {
				params.doneFunction(false);
			}

			if (params.closeOnCancel) {
				sweetAlert.close();
			}
		};

		exports['default'] = {
			handleButton: handleButton,
			handleConfirm: handleConfirm,
			handleCancel: handleCancel
		};
		module.exports = exports['default'];

		/***/ },
	/* 10 */
	/*!************************************************!*\
	 !*** ./~/sweetalert/lib/modules/handle-key.js ***!
	 \************************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});

		var _stopEventPropagation$fireClick = __webpack_require__(/*! ./handle-dom */ 4);

		var _setFocusStyle = __webpack_require__(/*! ./handle-swal-dom */ 6);

		var handleKeyDown = function handleKeyDown(event, params, modal) {
			var e = event || window.event;
			var keyCode = e.keyCode || e.which;

			var $okButton = modal.querySelector('button.confirm');
			var $cancelButton = modal.querySelector('button.cancel');
			var $modalButtons = modal.querySelectorAll('button[tabindex]');

			if ([9, 13, 32, 27].indexOf(keyCode) === -1) {
				// Don't do work on keys we don't care about.
				return;
			}

			var $targetElement = e.target || e.srcElement;

			var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
			for (var i = 0; i < $modalButtons.length; i++) {
				if ($targetElement === $modalButtons[i]) {
					btnIndex = i;
					break;
				}
			}

			if (keyCode === 9) {
				// TAB
				if (btnIndex === -1) {
					// No button focused. Jump to the confirm button.
					$targetElement = $okButton;
				} else {
					// Cycle to the next button
					if (btnIndex === $modalButtons.length - 1) {
						$targetElement = $modalButtons[0];
					} else {
						$targetElement = $modalButtons[btnIndex + 1];
					}
				}

				_stopEventPropagation$fireClick.stopEventPropagation(e);
				$targetElement.focus();

				if (params.confirmButtonColor) {
					_setFocusStyle.setFocusStyle($targetElement, params.confirmButtonColor);
				}
			} else {
				if (keyCode === 13) {
					if ($targetElement.tagName === 'INPUT') {
						$targetElement = $okButton;
						$okButton.focus();
					}

					if (btnIndex === -1) {
						// ENTER/SPACE clicked outside of a button.
						$targetElement = $okButton;
					} else {
						// Do nothing - let the browser handle it.
						$targetElement = undefined;
					}
				} else if (keyCode === 27 && params.allowEscapeKey === true) {
					$targetElement = $cancelButton;
					_stopEventPropagation$fireClick.fireClick($targetElement, e);
				} else {
					// Fallback - let the browser handle it.
					$targetElement = undefined;
				}
			}
		};

		exports['default'] = handleKeyDown;
		module.exports = exports['default'];

		/***/ },
	/* 11 */
	/*!************************************************!*\
	 !*** ./~/sweetalert/lib/modules/set-params.js ***!
	 \************************************************/
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		Object.defineProperty(exports, '__esModule', {
			value: true
		});

		var _isIE8 = __webpack_require__(/*! ./utils */ 5);

		var _getModal$getInput$setFocusStyle = __webpack_require__(/*! ./handle-swal-dom */ 6);

		var _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide = __webpack_require__(/*! ./handle-dom */ 4);

		var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];

		/*
		 * Set type, text and actions on modal
		 */
		var setParameters = function setParameters(params) {
			var modal = _getModal$getInput$setFocusStyle.getModal();

			var $title = modal.querySelector('h2');
			var $text = modal.querySelector('p');
			var $cancelBtn = modal.querySelector('button.cancel');
			var $confirmBtn = modal.querySelector('button.confirm');

			/*
			 * Title
			 */
			$title.innerHTML = params.html ? params.title : _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.escapeHtml(params.title).split('\n').join('<br>');

			/*
			 * Text
			 */
			$text.innerHTML = params.html ? params.text : _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.escapeHtml(params.text || '').split('\n').join('<br>');
			if (params.text) _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.show($text);

			/*
			 * Custom class
			 */
			if (params.customClass) {
				_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass(modal, params.customClass);
				modal.setAttribute('data-custom-class', params.customClass);
			} else {
				// Find previously set classes and remove them
				var customClass = modal.getAttribute('data-custom-class');
				_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.removeClass(modal, customClass);
				modal.setAttribute('data-custom-class', '');
			}

			/*
			 * Icon
			 */
			_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.hide(modal.querySelectorAll('.sa-icon'));

			if (params.type && !_isIE8.isIE8()) {
				var _ret = (function () {

					var validType = false;

					for (var i = 0; i < alertTypes.length; i++) {
						if (params.type === alertTypes[i]) {
							validType = true;
							break;
						}
					}

					if (!validType) {
						logStr('Unknown alert type: ' + params.type);
						return {
							v: false
						};
					}

					var typesWithIcons = ['success', 'error', 'warning', 'info'];
					var $icon = undefined;

					if (typesWithIcons.indexOf(params.type) !== -1) {
						$icon = modal.querySelector('.sa-icon.' + 'sa-' + params.type);
						_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.show($icon);
					}

					var $input = _getModal$getInput$setFocusStyle.getInput();

					// Animate icon
					switch (params.type) {

						case 'success':
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon, 'animate');
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon.querySelector('.sa-tip'), 'animateSuccessTip');
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon.querySelector('.sa-long'), 'animateSuccessLong');
							break;

						case 'error':
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon, 'animateErrorIcon');
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon.querySelector('.sa-x-mark'), 'animateXMark');
							break;

						case 'warning':
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon, 'pulseWarning');
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon.querySelector('.sa-body'), 'pulseWarningIns');
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass($icon.querySelector('.sa-dot'), 'pulseWarningIns');
							break;

						case 'input':
						case 'prompt':
							$input.setAttribute('type', params.inputType);
							$input.value = params.inputValue;
							$input.setAttribute('placeholder', params.inputPlaceholder);
							_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.addClass(modal, 'show-input');
							setTimeout(function () {
								$input.focus();
								$input.addEventListener('keyup', swal.resetInputError);
							}, 400);
							break;
					}
				})();

				if (typeof _ret === 'object') {
					return _ret.v;
				}
			}

			/*
			 * Custom image
			 */
			if (params.imageUrl) {
				var $customIcon = modal.querySelector('.sa-icon.sa-custom');

				$customIcon.style.backgroundImage = 'url(' + params.imageUrl + ')';
				_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.show($customIcon);

				var _imgWidth = 80;
				var _imgHeight = 80;

				if (params.imageSize) {
					var dimensions = params.imageSize.toString().split('x');
					var imgWidth = dimensions[0];
					var imgHeight = dimensions[1];

					if (!imgWidth || !imgHeight) {
						logStr('Parameter imageSize expects value with format WIDTHxHEIGHT, got ' + params.imageSize);
					} else {
						_imgWidth = imgWidth;
						_imgHeight = imgHeight;
					}
				}

				$customIcon.setAttribute('style', $customIcon.getAttribute('style') + 'width:' + _imgWidth + 'px; height:' + _imgHeight + 'px');
			}

			/*
			 * Show cancel button?
			 */
			modal.setAttribute('data-has-cancel-button', params.showCancelButton);
			if (params.showCancelButton) {
				$cancelBtn.style.display = 'inline-block';
			} else {
				_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.hide($cancelBtn);
			}

			/*
			 * Show confirm button?
			 */
			modal.setAttribute('data-has-confirm-button', params.showConfirmButton);
			if (params.showConfirmButton) {
				$confirmBtn.style.display = 'inline-block';
			} else {
				_hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.hide($confirmBtn);
			}

			/*
			 * Custom text on cancel/confirm buttons
			 */
			if (params.cancelButtonText) {
				$cancelBtn.innerHTML = _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.escapeHtml(params.cancelButtonText);
			}
			if (params.confirmButtonText) {
				$confirmBtn.innerHTML = _hasClass$addClass$removeClass$escapeHtml$_show$show$_hide$hide.escapeHtml(params.confirmButtonText);
			}

			/*
			 * Custom color on confirm button
			 */
			if (params.confirmButtonColor) {
				// Set confirm button to selected background color
				$confirmBtn.style.backgroundColor = params.confirmButtonColor;

				// Set the confirm button color to the loading ring
				$confirmBtn.style.borderLeftColor = params.confirmLoadingButtonColor;
				$confirmBtn.style.borderRightColor = params.confirmLoadingButtonColor;

				// Set box-shadow to default focused button
				_getModal$getInput$setFocusStyle.setFocusStyle($confirmBtn, params.confirmButtonColor);
			}

			/*
			 * Allow outside click
			 */
			modal.setAttribute('data-allow-outside-click', params.allowOutsideClick);

			/*
			 * Callback function
			 */
			var hasDoneFunction = params.doneFunction ? true : false;
			modal.setAttribute('data-has-done-function', hasDoneFunction);

			/*
			 * Animation
			 */
			if (!params.animation) {
				modal.setAttribute('data-animation', 'none');
			} else if (typeof params.animation === 'string') {
				modal.setAttribute('data-animation', params.animation); // Custom animation
			} else {
				modal.setAttribute('data-animation', 'pop');
			}

			/*
			 * Timer
			 */
			modal.setAttribute('data-timer', params.timer);
		};

		exports['default'] = setParameters;
		module.exports = exports['default'];

		/***/ },
	/* 12 */
	/*!***********************!*\
	 !*** ./~/is_js/is.js ***!
	 \***********************/
	/***/ function(module, exports, __webpack_require__) {

		var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {/*!
		 * is.js 0.8.0
		 * Author: Aras Atasaygin
		 */

			// AMD with global, Node, or global
			;(function(root, factory) {    // eslint-disable-line no-extra-semi
				if (true) {
					// AMD. Register as an anonymous module.
					!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
						// Also create a global in case some scripts
						// that are loaded still are looking for
						// a global even when an AMD loader is in use.
						return (root.is = factory());
					}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
				} else if (typeof exports === 'object') {
					// Node. Does not work with strict CommonJS, but
					// only CommonJS-like enviroments that support module.exports,
					// like Node.
					module.exports = factory();
				} else {
					// Browser globals (root is self)
					root.is = factory();
				}
			}(this, function() {

				// Baseline
				/* -------------------------------------------------------------------------- */

				// define 'is' object and current version
				var is = {};
				is.VERSION = '0.8.0';

				// define interfaces
				is.not = {};
				is.all = {};
				is.any = {};

				// cache some methods to call later on
				var toString = Object.prototype.toString;
				var slice = Array.prototype.slice;
				var hasOwnProperty = Object.prototype.hasOwnProperty;

				// helper function which reverses the sense of predicate result
				function not(func) {
					return function() {
						return !func.apply(null, slice.call(arguments));
					};
				}

				// helper function which call predicate function per parameter and return true if all pass
				function all(func) {
					return function() {
						var params = getParams(arguments);
						var length = params.length;
						for (var i = 0; i < length; i++) {
							if (!func.call(null, params[i])) {
								return false;
							}
						}
						return true;
					};
				}

				// helper function which call predicate function per parameter and return true if any pass
				function any(func) {
					return function() {
						var params = getParams(arguments);
						var length = params.length;
						for (var i = 0; i < length; i++) {
							if (func.call(null, params[i])) {
								return true;
							}
						}
						return false;
					};
				}

				// build a 'comparator' object for various comparison checks
				var comparator = {
					'<': function(a, b) { return a < b; },
					'<=': function(a, b) { return a <= b; },
					'>': function(a, b) { return a > b; },
					'>=': function(a, b) { return a >= b; }
				}

				// helper function which compares a version to a range
				function compareVersion(version, range) {
					var string = (range + '');
					var n = +(string.match(/\d+/) || NaN);
					var op = string.match(/^[<>]=?|/)[0];
					return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
				}

				// helper function which extracts params from arguments
				function getParams(args) {
					var params = slice.call(args);
					var length = params.length;
					if (length === 1 && is.array(params[0])) {    // support array
						params = params[0];
					}
					return params;
				}

				// Type checks
				/* -------------------------------------------------------------------------- */

				// is a given value Arguments?
				is.arguments = function(value) {    // fallback check is for IE
					return toString.call(value) === '[object Arguments]' ||
						(value != null && typeof value === 'object' && 'callee' in value);
				};

				// is a given value Array?
				is.array = Array.isArray || function(value) {    // check native isArray first
						return toString.call(value) === '[object Array]';
					};

				// is a given value Boolean?
				is.boolean = function(value) {
					return value === true || value === false || toString.call(value) === '[object Boolean]';
				};

				// is a given value Char?
				is.char = function(value) {
					return is.string(value) && value.length === 1;
				};

				// is a given value Date Object?
				is.date = function(value) {
					return toString.call(value) === '[object Date]';
				};

				// is a given object a DOM node?
				is.domNode = function(object) {
					return is.object(object) && object.nodeType > 0;
				};

				// is a given value Error object?
				is.error = function(value) {
					return toString.call(value) === '[object Error]';
				};

				// is a given value function?
				is['function'] = function(value) {    // fallback check is for IE
					return toString.call(value) === '[object Function]' || typeof value === 'function';
				};

				// is given value a pure JSON object?
				is.json = function(value) {
					return toString.call(value) === '[object Object]';
				};

				// is a given value NaN?
				is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
					return value !== value;
				};

				// is a given value null?
				is['null'] = function(value) {
					return value === null;
				};

				// is a given value number?
				is.number = function(value) {
					return is.not.nan(value) && toString.call(value) === '[object Number]';
				};

				// is a given value object?
				is.object = function(value) {
					return Object(value) === value;
				};

				// is a given value RegExp?
				is.regexp = function(value) {
					return toString.call(value) === '[object RegExp]';
				};

				// are given values same type?
				// prevent NaN, Number same type check
				is.sameType = function(value, other) {
					var tag = toString.call(value);
					if (tag !== toString.call(other)) {
						return false;
					}
					if (tag === '[object Number]') {
						return !is.any.nan(value, other) || is.all.nan(value, other);
					}
					return true;
				};
				// sameType method does not support 'all' and 'any' interfaces
				is.sameType.api = ['not'];

				// is a given value String?
				is.string = function(value) {
					return toString.call(value) === '[object String]';
				};

				// is a given value undefined?
				is.undefined = function(value) {
					return value === void 0;
				};

				// is a given value window?
				// setInterval method is only available for window object
				is.windowObject = function(value) {
					return value != null && typeof value === 'object' && 'setInterval' in value;
				};

				// Presence checks
				/* -------------------------------------------------------------------------- */

				//is a given value empty? Objects, arrays, strings
				is.empty = function(value) {
					if (is.object(value)) {
						var length = Object.getOwnPropertyNames(value).length;
						if (length === 0 || (length === 1 && is.array(value)) ||
							(length === 2 && is.arguments(value))) {
							return true;
						}
						return false;
					}
					return value === '';
				};

				// is a given value existy?
				is.existy = function(value) {
					return value != null;
				};

				// is a given value falsy?
				is.falsy = function(value) {
					return !value;
				};

				// is a given value truthy?
				is.truthy = not(is.falsy);

				// Arithmetic checks
				/* -------------------------------------------------------------------------- */

				// is a given number above minimum parameter?
				is.above = function(n, min) {
					return is.all.number(n, min) && n > min;
				};
				// above method does not support 'all' and 'any' interfaces
				is.above.api = ['not'];

				// is a given number decimal?
				is.decimal = function(n) {
					return is.number(n) && n % 1 !== 0;
				};

				// are given values equal? supports numbers, strings, regexes, booleans
				// TODO: Add object and array support
				is.equal = function(value, other) {
					// check 0 and -0 equity with Infinity and -Infinity
					if (is.all.number(value, other)) {
						return value === other && 1 / value === 1 / other;
					}
					// check regexes as strings too
					if (is.all.string(value, other) || is.all.regexp(value, other)) {
						return '' + value === '' + other;
					}
					if (is.all.boolean(value, other)) {
						return value === other;
					}
					return false;
				};
				// equal method does not support 'all' and 'any' interfaces
				is.equal.api = ['not'];

				// is a given number even?
				is.even = function(n) {
					return is.number(n) && n % 2 === 0;
				};

				// is a given number finite?
				is.finite = isFinite || function(n) {
						return is.not.infinite(n) && is.not.nan(n);
					};

				// is a given number infinite?
				is.infinite = function(n) {
					return n === Infinity || n === -Infinity;
				};

				// is a given number integer?
				is.integer = function(n) {
					return is.number(n) && n % 1 === 0;
				};

				// is a given number negative?
				is.negative = function(n) {
					return is.number(n) && n < 0;
				};

				// is a given number odd?
				is.odd = function(n) {
					return is.number(n) && n % 2 === 1;
				};

				// is a given number positive?
				is.positive = function(n) {
					return is.number(n) && n > 0;
				};

				// is a given number above maximum parameter?
				is.under = function(n, max) {
					return is.all.number(n, max) && n < max;
				};
				// least method does not support 'all' and 'any' interfaces
				is.under.api = ['not'];

				// is a given number within minimum and maximum parameters?
				is.within = function(n, min, max) {
					return is.all.number(n, min, max) && n > min && n < max;
				};
				// within method does not support 'all' and 'any' interfaces
				is.within.api = ['not'];

				// Regexp checks
				/* -------------------------------------------------------------------------- */
				// Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
				// Scott Gonzalez: Email address validation

				// dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
				// eppPhone match extensible provisioning protocol format
				// nanpPhone match north american number plan format
				// time match hours, minutes, and seconds, 24-hour clock
				var regexes = {
					affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
					alphaNumeric: /^[A-Za-z0-9]+$/,
					caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
					creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
					dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
					email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
					eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
					hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
					hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
					ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
					ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
					nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
					socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
					timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
					ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
					url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
					usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
				};

				function regexpCheck(regexp, regexes) {
					is[regexp] = function(value) {
						return regexes[regexp].test(value);
					};
				}

				// create regexp checks methods from 'regexes' object
				for (var regexp in regexes) {
					if (regexes.hasOwnProperty(regexp)) {
						regexpCheck(regexp, regexes);
					}
				}

				// simplify IP checks by calling the regex helpers for IPv4 and IPv6
				is.ip = function(value) {
					return is.ipv4(value) || is.ipv6(value);
				};

				// String checks
				/* -------------------------------------------------------------------------- */

				// is a given string or sentence capitalized?
				is.capitalized = function(string) {
					if (is.not.string(string)) {
						return false;
					}
					var words = string.split(' ');
					for (var i = 0; i < words.length; i++) {
						var word = words[i];
						if (word.length) {
							var chr = word.charAt(0);
							if (chr !== chr.toUpperCase()) {
								return false;
							}
						}
					}
					return true;
				};

				// is string end with a given target parameter?
				is.endWith = function(string, target) {
					if (is.not.string(string)) {
						return false;
					}
					target += '';
					var position = string.length - target.length;
					return position >= 0 && string.indexOf(target, position) === position;
				};
				// endWith method does not support 'all' and 'any' interfaces
				is.endWith.api = ['not'];

				// is a given string include parameter target?
				is.include = function(string, target) {
					return string.indexOf(target) > -1;
				};
				// include method does not support 'all' and 'any' interfaces
				is.include.api = ['not'];

				// is a given string all lowercase?
				is.lowerCase = function(string) {
					return is.string(string) && string === string.toLowerCase();
				};

				// is a given string palindrome?
				is.palindrome = function(string) {
					if (is.not.string(string)) {
						return false;
					}
					string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
					var length = string.length - 1;
					for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
						if (string.charAt(i) !== string.charAt(length - i)) {
							return false;
						}
					}
					return true;
				};

				// is a given value space?
				// horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
				is.space = function(value) {
					if (is.not.char(value)) {
						return false;
					}
					var charCode = value.charCodeAt(0);
					return (charCode > 8 && charCode < 14) || charCode === 32;
				};

				// is string start with a given target parameter?
				is.startWith = function(string, target) {
					return is.string(string) && string.indexOf(target) === 0;
				};
				// startWith method does not support 'all' and 'any' interfaces
				is.startWith.api = ['not'];

				// is a given string all uppercase?
				is.upperCase = function(string) {
					return is.string(string) && string === string.toUpperCase();
				};

				// Time checks
				/* -------------------------------------------------------------------------- */

				var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
				var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

				// is a given dates day equal given day parameter?
				is.day = function(date, day) {
					return is.date(date) && day.toLowerCase() === days[date.getDay()];
				};
				// day method does not support 'all' and 'any' interfaces
				is.day.api = ['not'];

				// is a given date in daylight saving time?
				is.dayLightSavingTime = function(date) {
					var january = new Date(date.getFullYear(), 0, 1);
					var july = new Date(date.getFullYear(), 6, 1);
					var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
					return date.getTimezoneOffset() < stdTimezoneOffset;
				};

				// is a given date future?
				is.future = function(date) {
					var now = new Date();
					return is.date(date) && date.getTime() > now.getTime();
				};

				// is date within given range?
				is.inDateRange = function(date, start, end) {
					if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
						return false;
					}
					var stamp = date.getTime();
					return stamp > start.getTime() && stamp < end.getTime();
				};
				// inDateRange method does not support 'all' and 'any' interfaces
				is.inDateRange.api = ['not'];

				// is a given date in last month range?
				is.inLastMonth = function(date) {
					return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
				};

				// is a given date in last week range?
				is.inLastWeek = function(date) {
					return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
				};

				// is a given date in last year range?
				is.inLastYear = function(date) {
					return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
				};

				// is a given date in next month range?
				is.inNextMonth = function(date) {
					return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
				};

				// is a given date in next week range?
				is.inNextWeek = function(date) {
					return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
				};

				// is a given date in next year range?
				is.inNextYear = function(date) {
					return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
				};

				// is the given year a leap year?
				is.leapYear = function(year) {
					return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
				};

				// is a given dates month equal given month parameter?
				is.month = function(date, month) {
					return is.date(date) && month.toLowerCase() === months[date.getMonth()];
				};
				// month method does not support 'all' and 'any' interfaces
				is.month.api = ['not'];

				// is a given date past?
				is.past = function(date) {
					var now = new Date();
					return is.date(date) && date.getTime() < now.getTime();
				};

				// is a given date in the parameter quarter?
				is.quarterOfYear = function(date, quarter) {
					return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
				};
				// quarterOfYear method does not support 'all' and 'any' interfaces
				is.quarterOfYear.api = ['not'];

				// is a given date indicate today?
				is.today = function(date) {
					var now = new Date();
					var todayString = now.toDateString();
					return is.date(date) && date.toDateString() === todayString;
				};

				// is a given date indicate tomorrow?
				is.tomorrow = function(date) {
					var now = new Date();
					var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
					return is.date(date) && date.toDateString() === tomorrowString;
				};

				// is a given date weekend?
				// 6: Saturday, 0: Sunday
				is.weekend = function(date) {
					return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
				};

				// is a given date weekday?
				is.weekday = not(is.weekend);

				// is a given dates year equal given year parameter?
				is.year = function(date, year) {
					return is.date(date) && is.number(year) && year === date.getFullYear();
				};
				// year method does not support 'all' and 'any' interfaces
				is.year.api = ['not'];

				// is a given date indicate yesterday?
				is.yesterday = function(date) {
					var now = new Date();
					var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
					return is.date(date) && date.toDateString() === yesterdayString;
				};

				// Environment checks
				/* -------------------------------------------------------------------------- */

				var freeGlobal = is.windowObject(typeof global == 'object' && global) && global;
				var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
				var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
				var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

				var document = freeSelf && freeSelf.document;
				var previousIs = root.is;

				// store navigator properties to use later
				var navigator = freeSelf && freeSelf.navigator;
				var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
				var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
				var vendor = (navigator && navigator.vendor || '').toLowerCase();

				// is current device android?
				is.android = function() {
					return /android/.test(userAgent);
				};
				// android method does not support 'all' and 'any' interfaces
				is.android.api = ['not'];

				// is current device android phone?
				is.androidPhone = function() {
					return /android/.test(userAgent) && /mobile/.test(userAgent);
				};
				// androidPhone method does not support 'all' and 'any' interfaces
				is.androidPhone.api = ['not'];

				// is current device android tablet?
				is.androidTablet = function() {
					return /android/.test(userAgent) && !/mobile/.test(userAgent);
				};
				// androidTablet method does not support 'all' and 'any' interfaces
				is.androidTablet.api = ['not'];

				// is current device blackberry?
				is.blackberry = function() {
					return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
				};
				// blackberry method does not support 'all' and 'any' interfaces
				is.blackberry.api = ['not'];

				// is current browser chrome?
				// parameter is optional
				is.chrome = function(range) {
					var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
					return match !== null && compareVersion(match[1], range);
				};
				// chrome method does not support 'all' and 'any' interfaces
				is.chrome.api = ['not'];

				// is current device desktop?
				is.desktop = function() {
					return is.not.mobile() && is.not.tablet();
				};
				// desktop method does not support 'all' and 'any' interfaces
				is.desktop.api = ['not'];

				// is current browser edge?
				// parameter is optional
				is.edge = function(range) {
					var match = userAgent.match(/edge\/(\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// edge method does not support 'all' and 'any' interfaces
				is.edge.api = ['not'];

				// is current browser firefox?
				// parameter is optional
				is.firefox = function(range) {
					var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// firefox method does not support 'all' and 'any' interfaces
				is.firefox.api = ['not'];

				// is current browser internet explorer?
				// parameter is optional
				is.ie = function(range) {
					var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// ie method does not support 'all' and 'any' interfaces
				is.ie.api = ['not'];

				// is current device ios?
				is.ios = function() {
					return is.iphone() || is.ipad() || is.ipod();
				};
				// ios method does not support 'all' and 'any' interfaces
				is.ios.api = ['not'];

				// is current device ipad?
				// parameter is optional
				is.ipad = function(range) {
					var match = userAgent.match(/ipad.+?os (\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// ipad method does not support 'all' and 'any' interfaces
				is.ipad.api = ['not'];

				// is current device iphone?
				// parameter is optional
				is.iphone = function(range) {
					// original iPhone doesn't have the os portion of the UA
					var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
					return match !== null && compareVersion(match[1] || 1, range);
				};
				// iphone method does not support 'all' and 'any' interfaces
				is.iphone.api = ['not'];

				// is current device ipod?
				// parameter is optional
				is.ipod = function(range) {
					var match = userAgent.match(/ipod.+?os (\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// ipod method does not support 'all' and 'any' interfaces
				is.ipod.api = ['not'];

				// is current operating system linux?
				is.linux = function() {
					return /linux/.test(appVersion);
				};
				// linux method does not support 'all' and 'any' interfaces
				is.linux.api = ['not'];

				// is current operating system mac?
				is.mac = function() {
					return /mac/.test(appVersion);
				};
				// mac method does not support 'all' and 'any' interfaces
				is.mac.api = ['not'];

				// is current device mobile?
				is.mobile = function() {
					return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
				};
				// mobile method does not support 'all' and 'any' interfaces
				is.mobile.api = ['not'];

				// is current state offline?
				is.offline = not(is.online);
				// offline method does not support 'all' and 'any' interfaces
				is.offline.api = ['not'];

				// is current state online?
				is.online = function() {
					return !navigator || navigator.onLine === true;
				};
				// online method does not support 'all' and 'any' interfaces
				is.online.api = ['not'];

				// is current browser opera?
				// parameter is optional
				is.opera = function(range) {
					var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// opera method does not support 'all' and 'any' interfaces
				is.opera.api = ['not'];

				// is current browser phantomjs?
				// parameter is optional
				is.phantom = function(range) {
					var match = userAgent.match(/phantomjs\/(\d+)/);
					return match !== null && compareVersion(match[1], range);
				};
				// phantom method does not support 'all' and 'any' interfaces
				is.phantom.api = ['not'];

				// is current browser safari?
				// parameter is optional
				is.safari = function(range) {
					var match = userAgent.match(/version\/(\d+).+?safari/);
					return match !== null && compareVersion(match[1], range);
				};
				// safari method does not support 'all' and 'any' interfaces
				is.safari.api = ['not'];

				// is current device tablet?
				is.tablet = function() {
					return is.ipad() || is.androidTablet() || is.windowsTablet();
				};
				// tablet method does not support 'all' and 'any' interfaces
				is.tablet.api = ['not'];

				// is current device supports touch?
				is.touchDevice = function() {
					return !!document && ('ontouchstart' in freeSelf ||
						('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
				};
				// touchDevice method does not support 'all' and 'any' interfaces
				is.touchDevice.api = ['not'];

				// is current operating system windows?
				is.windows = function() {
					return /win/.test(appVersion);
				};
				// windows method does not support 'all' and 'any' interfaces
				is.windows.api = ['not'];

				// is current device windows phone?
				is.windowsPhone = function() {
					return is.windows() && /phone/.test(userAgent);
				};
				// windowsPhone method does not support 'all' and 'any' interfaces
				is.windowsPhone.api = ['not'];

				// is current device windows tablet?
				is.windowsTablet = function() {
					return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
				};
				// windowsTablet method does not support 'all' and 'any' interfaces
				is.windowsTablet.api = ['not'];

				// Object checks
				/* -------------------------------------------------------------------------- */

				// has a given object got parameterized count property?
				is.propertyCount = function(object, count) {
					if (is.not.object(object) || is.not.number(count)) {
						return false;
					}
					var n = 0;
					for (var property in object) {
						if (hasOwnProperty.call(object, property) && ++n > count) {
							return false;
						}
					}
					return n === count;
				};
				// propertyCount method does not support 'all' and 'any' interfaces
				is.propertyCount.api = ['not'];

				// is given object has parameterized property?
				is.propertyDefined = function(object, property) {
					return is.object(object) && is.string(property) && property in object;
				};
				// propertyDefined method does not support 'all' and 'any' interfaces
				is.propertyDefined.api = ['not'];

				// Array checks
				/* -------------------------------------------------------------------------- */

				// is a given item in an array?
				is.inArray = function(value, array) {
					if (is.not.array(array)) {
						return false;
					}
					for (var i = 0; i < array.length; i++) {
						if (array[i] === value) {
							return true;
						}
					}
					return false;
				};
				// inArray method does not support 'all' and 'any' interfaces
				is.inArray.api = ['not'];

				// is a given array sorted?
				is.sorted = function(array, sign) {
					if (is.not.array(array)) {
						return false;
					}
					var predicate = comparator[sign] || comparator['>='];
					for (var i = 1; i < array.length; i++) {
						if (!predicate(array[i], array[i - 1])) {
							return false;
						}
					}
					return true;
				};

				// API
				// Set 'not', 'all' and 'any' interfaces to methods based on their api property
				/* -------------------------------------------------------------------------- */

				function setInterfaces() {
					var options = is;
					for (var option in options) {
						if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
							var interfaces = options[option].api || ['not', 'all', 'any'];
							for (var i = 0; i < interfaces.length; i++) {
								if (interfaces[i] === 'not') {
									is.not[option] = not(is[option]);
								}
								if (interfaces[i] === 'all') {
									is.all[option] = all(is[option]);
								}
								if (interfaces[i] === 'any') {
									is.any[option] = any(is[option]);
								}
							}
						}
					}
				}
				setInterfaces();

				// Configuration methods
				// Intentionally added after setInterfaces function
				/* -------------------------------------------------------------------------- */

				// change namespace of library to prevent name collisions
				// var preferredName = is.setNamespace();
				// preferredName.odd(3);
				// => true
				is.setNamespace = function() {
					root.is = previousIs;
					return this;
				};

				// set optional regexes to methods
				is.setRegexp = function(regexp, name) {
					for (var r in regexes) {
						if (hasOwnProperty.call(regexes, r) && (name === r)) {
							regexes[r] = regexp;
						}
					}
				};

				return is;
			}));

			/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

		/***/ }
	/******/ ]);
//# sourceMappingURL=script.js.map