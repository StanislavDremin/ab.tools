/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";
export default class Preloader extends React.Component {
	componentDidMount() {
		// let $loader = $(ReactDOM.findDOMNode(this)).find('#r_preloader_ajax');
		// if($loader.length > 0){
		// 	$loader.css({
		// 		'marginLeft': Number($loader.width() / 2) + 'px'
		// 	});
		// }
	}

	static defaultProps = {
		overlay: true
	};

	render() {
		let style = {
			display: 'none'
		};
		if (this.props.show) {
			style.display = 'inline-block';
		}
		return (
			<div style={style}>
				{this.props.overlay === true ? <div className="r_ajax_overlay" /> : null}
				<div id="r_preloader_ajax">
					<div className="loader">
						<div id="floatingBarsG" className="ajax_left">
							<div className="blockG" id="rotateG_01"></div>
							<div className="blockG" id="rotateG_02"></div>
							<div className="blockG" id="rotateG_03"></div>
							<div className="blockG" id="rotateG_04"></div>
							<div className="blockG" id="rotateG_05"></div>
							<div className="blockG" id="rotateG_06"></div>
							<div className="blockG" id="rotateG_07"></div>
							<div className="blockG" id="rotateG_08"></div>
						</div>
						<span className="load_text">{this.props.text ? this.props.text : 'Загрузка...'}</span>
					</div>
				</div>
			</div>
		);
	}
}

class Loader {
	constructor(params, node = null){
		this.props = params;
		this.node = node;

		return this.component();
	}

	render (){
		if(this.node !== null){
			ReactDOM.render(this.component(), BX(this.node));
		}
	}
	static component(props){
		return (<Preloader {...props } />);
	}
}

export {Loader};