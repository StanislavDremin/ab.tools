import ClassNames from 'classnames';

class InputAction extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mode: 'label',
			value: this.props.value,
			oldVal: '',
			error: false
		};

		this.editCLick = this.editCLick.bind(this);
		this.changeInput = this.changeInput.bind(this);
		this.saveInput = this.saveInput.bind(this);
		this.cancel = this.cancel.bind(this);
		this.keyPress = this.keyPress.bind(this);
	}

	changeInput(ev) {
		let val = ev.target.value,
			newState = {};

		if (this.props.validRegex !== '') {
			let rg = new RegExp(this.props.validRegex);
			if (!rg.test(val)) {
				val = '';
				if(this.props.error){
					newState.error = this.props.error;
				}
			}
		}
		newState.value = val;
		this.props.value = val;
		this.setState(newState);
	}

	editCLick() {
		let mode = this.state.mode === 'label' ? 'edit' : 'label';
		this.setState({mode: mode, oldVal: this.state.value, error: null});
	}

	saveInput() {
		let val = this.state.value;
		if(val === ''){
			val = this.state.oldVal;
		}
		this.setState({mode: 'label', value: val});
		if(typeof this.props.saved === 'function'){
			let nameInput = ClassNames({[this.props.name]: this.props.name != undefined});
			this.props.saved(val, nameInput);
		}
	}

	cancel(){
		if(this.props.value !== this.state.oldVal){
			this.props.value = this.state.oldVal;
		}
		this.setState({mode: 'label', value: this.state.oldVal})
	}

	keyPress(ev){
		switch(ev.keyCode){
			case 13:
				this.saveInput();
				break;
			case 27:
				this.cancel();
			break;
		}
	}

	getMode() {
		let inputClass = ClassNames({
			'form-control': !this.props.inputClass,
			[this.props.inputClass]: this.props.inputClass
		});
		let bntClass = ClassNames({
			'btn btn-warning btn-xs': !this.props.classNameBtn,
			[this.props.classNameBtn]: this.props.classNameBtn
		});
		let dopStyleEditBtn = {'marginLeft': '5px'};
		let errorStyle = {
			'color': '#a50000',
			'margin': '3px auto',
			'display': 'none'
		};
		if(this.state.error != null && this.state.error != ''){
			errorStyle['display'] = 'block';
		}
		if (this.state.mode == 'edit') {
			let nameInput = ClassNames({[this.props.name]: this.props.name != undefined});

			return (
				<div className="form-group">
					<input className={inputClass}
						value={this.props.value}
						onChange={this.changeInput}
						onKeyDown={this.keyPress} name={nameInput}/>

					<button type="button" onClick={this.saveInput} className="btn btn-success btn-xs" style={dopStyleEditBtn}>
						<i className="fa fa-check" />
					</button>

					<button type="button" onClick={this.cancel} className="btn btn-danger btn-xs" style={dopStyleEditBtn}>
						<i className="fa fa-undo" />
					</button>

					<span style={errorStyle}>{this.state.error}</span>
				</div>
			)
		} else {
			return (
				<div className="form-group">
					<p className="form-control-static">{this.props.value}</p>
					<button type="button" onClick={this.editCLick} className={bntClass}>
						{this.props.children}
					</button>
				</div>
			)
		}
	}

	render() {
		return (
			<div className="form-inline" ref="ab_input_button">
				{this.getMode()}
			</div>
		);
	}
}

export default InputAction;