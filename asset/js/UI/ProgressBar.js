/**
 * Created by dremin_s on 27.01.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";
// import cn from 'classnames';

class ProgressBar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			percentStr: '0%',
			stepCount: 0, // количество шагов, за которое ползунок доползет до 100%  = Math.ceil(countItems/part)
			process: false,
			finish: false,
			onePercent: 0,
			offset: 0
		};
	}

	static defaultProps = {
		countItems: 0, // кол всех элементов
		part: 10, // элементов на шаг
		title: '',
		stepMsg: '',
		show: false,
		step: 1, // текущий шаг - счетчик
	};

	componentWillReceiveProps(nextProps){

		if(nextProps.countItems > 0 && this.state.step == 0 && this.state.stepCount == 0){
			let stepCount = Math.ceil(nextProps.countItems / nextProps.part);
			let onePercent = +(100/nextProps.countItems).toFixed(1);
			let offset = this.props.step * onePercent;

			this.setState({stepCount, onePercent, offset});

		} else if(nextProps.step > this.props.step){

			let onePercent = +(100/nextProps.countItems).toFixed(1);
			let offset = Math.round(nextProps.step * onePercent);

			this.setState({offset, percentStr: offset + '%', onePercent});
		}

		if((nextProps.step + 1) == this.props.countItems){
			this.setState({finish: true, percentStr: '100%'});
		}
	}

	render() {

		let style = {width: this.state.percentStr};
		if(this.state.finish === true){
			style = {width:'100%'};
		}
		let styleWrap = {display: 'none'};
		if(this.props.show === true){
			styleWrap['display'] = 'block';
		}

		return (
			<div className="progress_wrap" style={styleWrap}>
				{this.props.title.length > 0 && <div className="progress_title">{this.props.title}</div>}
				<div className="progress">
					<div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style={style}>
						<span>{this.state.percentStr} {this.props.stepMsg.length > 0 && this.props.stepMsg}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default ProgressBar;