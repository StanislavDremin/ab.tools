BX.JCCalendar.prototype.SaveValue = function () {
	if (this.popup_month)
		this.popup_month.close();
	if (this.popup_year)
		this.popup_year.close();

	var bSetValue = true;
	if (!!this.params.callback) {
		var res = this.params.callback.apply(this, [new Date(this.value.valueOf() + this.value.getTimezoneOffset() * 60000)]);
		if (res === false)
			bSetValue = false;
	}

	if (bSetValue) {
		var bTime = !!this.params.bTime && BX.hasClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');

		if (this.params.field) {
			this.params.field.value = BX.calendar.ValueToString(this.value, bTime, true);
			BX.fireEvent(this.params.field, 'change');
		}

		this.popup.close();

		if (!!this.params.callback_after) {
			this.params.callback_after.apply(this, [new Date(this.value.valueOf() + this.value.getTimezoneOffset() * 60000), bTime]);
		}
	}

	return this;
};

let isJS = is;
if(isJS === undefined || !isJS){
	isJS = require('is_js');
}

const is = isJS;
isJS = {};

class BXCalendar extends React.Component {
	constructor(props) {
		super(props);

		this.getCalendar = this.getCalendar.bind(this);
	}

	getCalendar(ev) {
		let link = ev.target;
		BX.calendar({node: link, field: link, bTime: false});
	}

	componentDidMount() {
		let $input = $(ReactDOM.findDOMNode(this));
		$input.on('change', (ev) => {
			if(is.function(this.props.changed)){
				this.props.changed(ev);
			}
		})
	}

	render() {
		return (
			<input {...this.props} onClick={this.getCalendar} />
		)
	}
}

export default BXCalendar;