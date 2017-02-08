import {Component} from 'react';
import {render} from 'react-dom';
import InputAction from '../InputAction';

class MyInput extends React.Component {
	constructor(props) {
		super(props);

		this.save = this.save.bind(this);
	}

	save(newValue) {
		alert(newValue);
	}

	render() {
		return (
			<div>
				<h3>Тестируем новый инпут</h3>
				<InputAction value={100} validRegex="^[0-9]+$" error="Только числа" saved={this.save}>
					Изменить
				</InputAction>
			</div>
		)
	}
}

const div = document.createElement('div');
div.id = 'new_test_input';
setTimeout(() => {
	document.body.appendChild(div);
	render(<MyInput />, document.getElementById(div.id));
}, 100);
