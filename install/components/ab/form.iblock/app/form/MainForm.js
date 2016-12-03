import aService from '../aService';
import swal from 'sweetalert';

const Ajax = new aService({
	mainUrl: '/rest/AB/Feedback'
});

const MainForm = React.createClass({

	obForm: {},
	obFields: {},
	types: ['input','select','textarea'],

	validField(target){
		if(target.required && (target.value === false || target.value == '' || target.value === undefined)){
			this.obFields[target.name].addClass('ab_error_field');
			this.setValidForm(false);
		}
	},

	getInitialState () {
	    return {
	        Fields: {},
			Form: {
				valid: true,
				pristine: true,
			}
	    }
	},

	setValidForm(flag){
		let form = this.state.Form;
		form.valid = flag;
		this.setState({Form: form});
	},

	setPristineForm(flag){
		let form = this.state.Form;
		form.pristine = flag;
		this.setState({Form: form});
	},

	sendForm(ev){
		ev.preventDefault();

		this.setValidForm(true);

		$('.ab_error_field').removeClass('ab_error_field');

		$.each(this.obFields, function (name, field) {
			this.validField(field[0]);
		}.bind(this));

		if(this.state.Form.valid === true){
			this.request();
		}
	},

	request(){
		let post = {FIELDS: {}};
		$.each(this.state.Fields, function (k, target) {
			post['FIELDS'][target.name] = target.value;
		});

		if(this.props.arParams != undefined){
			post['PARAMS'] = this.props.arParams;
		}

		Ajax.action('/save').post(post).then(function (result) {
			let title = 'Все гуд', message = 'Замечательно? Замечаааательно)) Елки зеленые, калаш мне в зад!!!';
			if(result.STATUS == 1){
				if(typeof(this.props.GoodText) == 'object'){
					title = this.props.GoodText.title ? this.props.GoodText.title : 'Все гуд';
					message = this.props.GoodText.msg ? this.props.GoodText.msg : 'Замечательно? Замечаааательно)) Да!!!';
				}

				swal(title, message, "success");

				this.clearForm();
			}
		}.bind(this));
	},

	clearForm(){
		var Fields = this.state.Fields;
		$.each(this.obFields, function (name, field) {
			this.obFields[name].val('');
			delete Fields[name];
		}.bind(this));

		this.setState({Fields: Fields});
	},

	createFields($obForm){
		var obFields = {};
		this.types.map(function (type) {
			$obForm.find(type).each(function () {
				let field = $(this);
				field.$$data = {
					valid: false,
					pristine: true,
					dirty: false
				};
				obFields[field.attr('name')] = field;
			});
		}.bind(this));

		this.obFields = obFields;
	},

	watcher(ev) {
		this.obFields[ev.target.name].removeClass('ab_error_field');

		let form = this.state.Form;
		form.pristine = false;
		this.setState({Form: form});

		let Fields = this.state.Fields;
		Fields[ev.target.name] = ev.target;

		this.obFields[ev.target.name].$$data.pristine = false;
		this.obFields[ev.target.name].$$data.dirty = true;

		this.setState({Fields: Fields});
	},

	componentDidMount() {
		this.obForm = $('#'+ this.props.formId);
		this.createFields(this.obForm);
	},

	render(){

		let colSmLeft = 'col-sm-' + 3,
			colSmRight = 'col-sm-' + 9,
			colSmLabel = colSmLeft + ' ' + 'control-label',
			colSmOffset = 'col-sm-offset-3 col-sm-9';

		return (
			<div className="ab_form_wrap">
				<h3 className={colSmOffset}>Обратная связь</h3>
				<form className="form-horizontal" noValidate="noValidate" autoComplete="off" action=""
					method="POST" onSubmit={this.sendForm} id={this.props.formId}>
					<div className="form-group">
						<label for="FIELD_EMAIL" className={colSmLabel}>Email</label>
						<div className={colSmRight}>
							<input id="FIELD_EMAIL" type="text" required name="EMAIL" className="form-control" placeholder="Email"
								onChange={this.watcher}/>
						</div>
					</div>
					<div className="form-group">
						<label for="FIELD_PHONE" className={colSmLabel}>Телефон</label>
						<div className={colSmRight}>
							<input id="FIELD_PHONE" type="text" name="PHONE" className="form-control" placeholder="Телефон"
								onChange={this.watcher}/>
						</div>
					</div>
					<div className="form-group">
						<label for="FIELD_NAME" className={colSmLabel}>Имя</label>
						<div className={colSmRight}>
							<input id="FIELD_NAME" type="text" name="NAME"
								className="form-control" placeholder="Имя"
								onChange={this.watcher} />
						</div>
					</div>
					<div className="form-group">
						<label for="FIELD_PREVIEW_TEXT" className={colSmLabel}>Сообщение</label>
						<div className={colSmRight}>
							<textarea className="form-control" id="FIELD_PREVIEW_TEXT"
								name="PREVIEW_TEXT" rows="5" onChange={this.watcher} />
						</div>
					</div>
					<div className="form-group ab_btn_group_form">
						<div className={colSmOffset}>
							<button type="submit" className="btn btn-success">Отправить</button>
							<button type="button" className="btn btn-danger">Отменить</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = MainForm;

