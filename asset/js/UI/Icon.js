/**
 * Created by dremin_s on 26.01.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";
import cn from 'classnames';

class Icon extends React.Component {

	constructor(props) {
		super(props);

	}

	static defaultProps = {
		name: ''
	};

	render() {

		return (
			<i className={cn('fa', 'fa-'+ this.props.name, {[this.props.className]: this.props.className})}>&nbsp;&nbsp;</i>
		);
	}
}

export default Icon;