/**
 * Created by dremin_s on 12.01.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o $ */
"use strict";
import Promise from 'promise';
import {animateCss} from 'Tools';

class ModalWrap extends React.Component {

	constructor(props) {
		super(props);

	}

	componentDidMount() {
		$('.modal_wrap').animateCss(this.props.effects.open);
	}

	render() {

		return (
			<div className="modal_place">
				<div className="modal_wrap">
					{this.props.children}
				</div>
			</div>
		);
	}
}


class Overlay extends React.Component {

	constructor(props) {
		super(props);

		this.clickOverlay = this.clickOverlay.bind(this);

		this.$modalNode = BX(this.props.modalId);
	}

	clickOverlay() {
		if (this.props.closeOverlay) {
			Dialog._remove(this.$modalNode);
		}
	}

	render() {
		return (
			<div className="overlay_wrap_modal" onClick={this.clickOverlay} />
		);
	}
}

export {Overlay};
export {ModalWrap};

class Modal extends React.Component {

	constructor(props) {
		super(props);

		this.$modalNode = BX(this.props.modalId);
	}

	remove() {
		let node = ReactDOM.findDOMNode(this.$modalNode);
		$(node).fadeOut(300, () => {
			ReactDOM.unmountComponentAtNode(node);
		});
	}

	addCloseEsc($node) {
		$node.bind('keydown', (ev) => {
			if (ev.keyCode == 27 && this.props.closeEsc != undefined) {
				Dialog._remove(this.$modalNode);
			}
		});
	}

	componentDidMount() {
		let $modal = $(this.$modalNode);
		this.addCloseEsc($modal);
		$modal.focus();
	}

	componentWillUnmount() {
		$(this.$modalNode).off('keydown');
	}

	render() {
		return (
			<div id={this.props.modalId} tabIndex="1">
				<ModalWrap {...this.props}>
					{this.props.children}
				</ModalWrap>
				<Overlay {...this.props} />
			</div>
		);
	}
}

class Dialog {
	constructor(params) {
		this.modal = {};
		this.params = params;
	}

	add(component, props = {}) {
		if (props.id == null) {
			throw Error('Нет ид окна params.modalId')
		}
		return new Promise((resolve, reject) => {
			let modalId = 'modal_' + props.id;
			let $modalWrapper = $('#' + modalId);
			if ($modalWrapper.length == 0) {
				$('body').append('<div id="' + modalId + '"></div>').addClass('modal-open');
			}

			props = {...props, modalId: modalId};
			this.params = props;

			try {
				this.modal = ReactDOM.render(React.createElement(component, props), BX(modalId));
			} catch (err) {
				console.error(err);
			}

			$('#wrap').addClass('blur');
			// $('html, body').scrollTop(0);

			resolve(this.modal);

		});
	}

	remove(ev) {
		Dialog._remove(BX(this.params.modalId));
	}

	static _close(node) {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(node));
	}

	static _remove(node) {
		$(node).fadeOut(150, () => {
			ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(node));
			$(node).remove();
			$('#wrap').removeClass('blur');
			$('body').removeClass('modal-open');
		});
	}
}

export {Dialog};

export default Modal;