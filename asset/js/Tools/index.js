/** @var o React */
/** @var o ReactDOM */
/** @var o $ */

const print_r = (arr, level) => {
	let print_red_text = "";
	if (!level) level = 0;
	let level_padding = "";
	for (let j = 0; j < level + 1; j++) level_padding += "    ";
	if (typeof(arr) == 'object') {
		for (let item in arr) {
			let value = arr[item];
			if (typeof(value) == 'object') {
				print_red_text += level_padding + "'" + item + "' :\n";
				print_red_text += print_r(value, level + 1);
			}
			else
				print_red_text += level_padding + "'" + item + "' : \"" + value + "\"\n";
		}
	}

	else  print_red_text = "===>" + arr + "<===(" + typeof(arr) + ")";
	return print_red_text;
};
export {print_r};

class Print extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<code className={this.props.className}>
				<pre>{print_r(this.props.data)}</pre>
			</code>
		);
	}
}
export {Print};

const animateCss = function() {
	return $.fn.extend({
		animateCss: function (animationName) {
			let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function() {
				$(this).removeClass('animated ' + animationName);
			});

			return this;
		}
	});
}(jQuery);
export {animateCss};
