import classNames from 'classnames';
export default class AutoComplete extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '', // значение input
			searchProfile: [], // найденные элементы
			suggestVisible: false, // показать подсказки
			index: -1, // начальное значение счетчика
			current: null // выбранные элемент подсказок
		};
		this.changeVal = this.changeVal.bind(this);
		this.pressItem = this.pressItem.bind(this);
		this.hoverItem = this.hoverItem.bind(this);

		this.$node = {};
		this.$nodeItems = {};

		this.selectedItem = this.selectedItem.bind(this);
	}

	selectedItem(val){
		if(typeof this.props.selectedItem == 'function'){
			this.props.selectedItem(val);
		}
	}

	/**
	 * Главный метод выбора эелмента-подсказки
	 * @param ev
	 */
	pressItem(ev) {
		if(is.empty(this.$nodeItems)){
			this.$nodeItems = this.$node.find('li');
		}
		let value = '', index = this.state.index; // запишем текущее положение индекса

		if (ev.type == 'keydown') { // если нажали клавишу

			this.$nodeItems.removeClass('active'); // грохнем все активные (выделенные) классы на подсказках
			switch (ev.keyCode) {
				case 40: // ArrowDown стрелка вниз
					if (index <= -1) { // если это вообще первое нажатие при поиске
						index = 0; // берем первый элемент массива
					} else {
						index++; // лил прибавим, ежели стрелку уже тыркали
					}
					if (index >= this.state.searchProfile.length) { // если дошли до конца списка, то закинемся на первый пункт
						index = 0;
					}

					value = this._getValueForItem(this.state.searchProfile[index]); // дернем значение массива для отображения в инпуте

					if (index < this.state.searchProfile.length) {
						// засандалим все состояния - текщий елемент, счетчик и значение для инпута
						this.setState({value: value, index: index, current: this.state.searchProfile[index]});
					}
					break;
				case 38: //ArrowUp стрелка вверх
					index--; // сразу выставляем пердыдущий элемент массива
					if (index <= -1) {
						// если после поиска, сразу нажали вверх, то перекинемся на последний эл. списка
						index = this.state.searchProfile.length - 1;
					}
					value = this._getValueForItem(this.state.searchProfile[index]); // дернем значние для подстановки в инпут

					// засандалим все состояния - текщий елемент, счетчик и значение для инпута
					this.setState({value: value, index: index, current: this.state.searchProfile[index]});

					break;
				case 13: //Enter
					// повесим глобальное событие - выбран какой-то элемент списка
					$(document).trigger('AC_' + this.props.input.id + '_SELECTED', this.state.current);
					this.selectedItem(this.state.current);
					this.setState({suggestVisible: false, index: -1}); // скрываем посказки
					break;
				case 27: //Esc
					this.setState({suggestVisible: false, index: -1});  // скрываем посказки
					break;
			}
		} else if (typeof ev !== 'object' && (typeof ev === 'string' || typeof ev === 'number')) {
			this.$nodeItems.removeClass('active');
			this.setState({value: ev, index: -1, suggestVisible: false, current: null});
			$(document).trigger('AC_' + this.props.input.id + '_SELECTED', this.state.current);
			this.selectedItem(this.state.current);
		} else {
			// опишем выбор пункта если по нему тыркнули мышкой
			value = this._getValueForItem(ev); // вернем значение для инпута
			index = this._getIndexForValue(ev); // вернем значение индекса массива, по которому тыркнули мышкой
			if (value !== undefined) { // если значение существует в принципе
				// засандалим все состояния - текщий елемент, счетчик и значение для инпута
				this.setState({
					value: value,
					index: -1,
					suggestVisible: false,
					current: this.state.searchProfile[index]
				});

				// повесим глобальное событие - выбран какой-то элемент списка
				$(document).trigger('AC_' + this.props.input.id + '_SELECTED', this.state.searchProfile[index]);
				this.selectedItem(this.state.searchProfile[index]);
			}
			this.$nodeItems.removeClass('active');
		}
	}

	_getValueForItem(item) {
		return this.props.label ? item[this.props.label] : item['label'];
	}

	/**
	 * Поиск индекса массива, если известен только выбранный пункт - this.state.searchProfile
	 * @param item
	 * @returns {*}
	 * @private
	 */
	_getIndexForValue(item) {
		let id = this.props.keyId ? this.props.keyId : 'ID', index = null;
		this.state.searchProfile.forEach((el, i) => {
			if (el[id] == item[id]) {
				index = i;
			}
		});

		return index;
	}

	/**
	 * hover на подсказке
	 * @param ev
	 */
	hoverItem(ev) {
		this.$nodeItems.removeClass('active'); // грохнем все активные желтые классы
		let $item = $(ev.target); // текущий элемент превратим в jQuery объект
		if (ev.type == 'mouseenter') { // мышка наехала на элемент
			$item.addClass('active');
		} else if (ev.type == 'mouseout') { // мышка уехала с элемента
			$item.removeClass('active');
		}
	}

	/**
	 * Отслеживание - что вписали в инпут
	 * @param ev
	 */
	changeVal(ev) {
		let searchData = this.props.data; // массив для поиска
		if (ev.target.value !== undefined) {
			let val = ev.target.value.toLowerCase(); // занчение к нижнему регистру
			let searchVal = this.props.search ? this.props.search : 'value', displayedContacts = [];
			displayedContacts = searchData.filter(function (el) { // ищем элемент
				let searchValue = el[searchVal].toLowerCase();
				return searchValue.indexOf(val) !== -1;
			});

			// засандалим в состояние найденные элементы
			let state = {
				value: ev.target.value,
				searchProfile: displayedContacts,
				suggestVisible: displayedContacts.length >= 1
			};
			if(ev.target.value === ''){
				state.current = null;
				$(document).trigger('AC_' + this.props.input.id + '_SELECTED', {ID: 0});
				this.selectedItem({ID: 0});
			}
			if(displayedContacts.length == 0){
				this.selectedItem({ID: 0});
			}

			this.setState(state);
		}
	}

	componentDidMount() {
		this.$node = $(ReactDOM.findDOMNode(this)).find('.suggestion');
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.searchProfile != null) {
			this.$nodeItems = this.$node.find('li'); // когда что-то начали искать в инпуте, забьем список найденных li в jQuery-объект
		}
	}

	render() {

		let type = this.props.input.type ? this.props.input.type : 'text';

		let suggest = []; // массив подсказок

		if (typeof this.state.searchProfile === 'object' && this.state.searchProfile.length > 0) {
			for (let i in this.state.searchProfile) { // собираем все подсказки
				if (this.state.searchProfile.hasOwnProperty(i)) {
					let item = this.state.searchProfile[i],
						classActive = '',
						label = this.props.label ? this.props.label : 'label',
						keyId = this.props.keyId && item[this.props.keyId] != undefined ? item[this.props.keyId] : i;
					if (i == 15) // чотб не было портянки, огарничим список подсказок до 15 элементов
						break;

					if (this.state.index == i) {
						classActive = 'active'; // если счетчик равен текущему эл. - подсветим его классом active
					}

					if (item[label]) {
						suggest.push(
							<li key={keyId}
								className={classActive}
								onClick={this.pressItem.bind(this, item)}
								onMouseEnter={this.hoverItem} onMouseOut={this.hoverItem}>{item[label]}</li>
						)
					}
				}
			}
		}

		let styleSuggest = {
			'display': this.state.suggestVisible ? 'block' : 'none'
		};

		let wrapClass = classNames({[this.props.wrapClass]: this.props.wrapClass != undefined});

		let error = this.props.error != undefined && this.props.error.show != undefined ? this.props.error : {show: false, msg: ''};

		return (
			<complete className={wrapClass}>
				{error.show ? <span className="error_city">{error.msg}</span> : false}
				<input {...this.props.input} type={type} value={this.state.value} onChange={this.changeVal} onKeyDown={this.pressItem} />
				<ul className="suggestion" style={styleSuggest}>{suggest}</ul>
			</complete>
		)
	}
}