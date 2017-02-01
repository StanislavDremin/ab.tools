/**
 * Created by dremin_s on 16.01.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";
import classNames from 'classnames';
import {animateCss} from 'Tools';

class TabItem extends React.Component {
	constructor(props) {
		super(props);

		this.$target = null;
	}

	componentWillReceiveProps(nextProps){
		if(this.props.active != '' && this.props.effectOut && this.$target !== null){
			this.$target.animateCss(this.props.effectOut);
		}
	}

	componentDidUpdate () {
		if(this.props.effect && this.props.active != '' && this.$target !== null){
			this.$target.animateCss(this.props.effect);
		}
	}

	componentDidMount () {
		if(this.$target === null){
			this.$target = $(ReactDOM.findDOMNode(this));
		}
	}

	render() {
		let classItem = classNames('tab_item_body', this.props.className, this.props.active);
		let styles = {
			display: this.props.active != '' ? 'block' : 'none'
		};

		return (
			<div style={styles} className={classItem} id={this.props.id}>{this.props.children}</div>
		);
	}
}

class TabLink extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		let title = this.props.title || 'Нет заголовка';
		let href = this.props.href || 'javascript:';
		let classLi = classNames('item_tab', this.props.className);
		let active = classNames({'item_active': this.props.active});

		return (<li className={classLi}><a onClick={this.props.click} className={active} href={href}>{title}</a></li>);
	}
}

export {TabItem};

class Tabs extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			activeTab: 0
		};

		this.changeTab = this.changeTab.bind(this);
	}

	changeTab(ev) {
		ev.preventDefault();
		let $target = $(ev.target);
		this.setState({activeTab: $target.attr('href')});
	};

	getTabId(postFix = '') {
		return '#' + this.props.id + postFix;
	}

	componentDidMount() {
		let activeTab = this.state.activeTab;

		React.Children.forEach(this.props.children, (el, k) => {
			if (el.type == TabItem) {
				if (el.props.active) {
					activeTab = this.getTabId(k);
				}
			}
		});

		if (activeTab == 0) {
			activeTab = this.getTabId(0);
		}

		if (activeTab != this.state.activeTab)
			this.setState({activeTab});
	}

	render() {

		if (this.props.id === undefined || this.props.id === false || this.props.id === '') {
			throw new Error('parameter "id" in Tabs component is not found or empty. For example <Tabs id="my_tab">....</Tabs>');
		}

		let links = React.Children.map(this.props.children, (el, k) => {
			let active = classNames({'active_link': this.state.activeTab === this.getTabId(k)});
			return (
				<TabLink
					title={el.props.title} key={'link_' + this.getTabId(k)} href={this.getTabId(k)}
					click={this.changeTab} active={active} />
			);
		});

		let items = React.Children.map(this.props.children, (el, k) => {
			let activeClass = classNames({'active_tab': this.getTabId(k) === this.state.activeTab});
			return (
				<TabItem {...el.props} id={this.getTabId(k)} active={activeClass}
					effect={classNames(this.props.effect)} effectOut={classNames(this.props.effectOut)}>
					{el.props.children}
				</TabItem>
			);
		});

		return (
			<div className="tabs_wrap" id={this.props.id}>
				<ul className="tabs_links_wrap">{links}</ul>
				<div className="tabs_body">
					{items}
				</div>
			</div>
		);
	}
}

Tabs.propTypes = {
	id: React.PropTypes.string.isRequired
};

export {Tabs};