/*
 * DC jQuery Vertical Accordion Menu - jQuery vertical accordion menu plugin
 * Copyright (c) 2011 Design Chemical
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 */

import Rest from 'preloader/RestService';

class ElementItem extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		id: '',
		className: '',
		DETAIL_URL: '',
		NAME: ''
	};

	render() {
		let className = this.props.className + ' ab_section_element';

		return (
			<li>
				<a href={this.props.DETAIL_URL} className={className}>{this.props.NAME}</a>
			</li>
		);
	}
}

class Elemetns extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		data: []
	}

	render() {
		return (
			<subItems>
				{this.props.data.map((el) => {
					return <ElementItem {...el} key={el.ID} />
				})}
			</subItems>
		);
	}
}


const dcAccordion = function () {
	return $.fn.extend({
		dcAccordion: function (options) {
			//set default options
			var defaults = {
				classParent: 'dcjq-parent',
				classActive: 'active',
				classArrow: 'dcjq-icon',
				classCount: 'dcjq-count',
				classExpand: 'dcjq-current-parent',
				classArrowClose: '',
				eventType: 'click',
				hoverDelay: 300,
				menuClose: true,
				autoClose: true,
				autoExpand: false,
				speed: 'slow',
				saveState: true,
				disableLink: true,
				showCount: false,
				cookie: 'dcjq-accordion',
				ajaxUrl: null,
			};
			//call in the default otions
			var options = $.extend(defaults, options);

			const Ajax = new Rest({
				baseURL: '/rest' + options.ajaxUrl
			});

			this.each(function (options) {
				var obj = this;
				setUpAccordion();
				if (defaults.saveState == true) {
					checkCookie(defaults.cookie, obj);
				}
				if (defaults.autoExpand == true) {
					$('li.' + defaults.classExpand + ' > a').addClass(defaults.classActive);
				}
				resetAccordion();
				if (defaults.eventType == 'hover') {
					var config = {
						sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
						interval: defaults.hoverDelay, // number = milliseconds for onMouseOver polling interval
						over: linkOver, // function = onMouseOver callback (REQUIRED)
						timeout: defaults.hoverDelay, // number = milliseconds delay before onMouseOut
						out: linkOut // function = onMouseOut callback (REQUIRED)
					};
					$('li a', obj).hoverIntent(config);
					var configMenu = {
						sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)
						interval: 1000, // number = milliseconds for onMouseOver polling interval
						over: menuOver, // function = onMouseOver callback (REQUIRED)
						timeout: 1000, // number = milliseconds delay before onMouseOut
						out: menuOut // function = onMouseOut callback (REQUIRED)
					};
					$(obj).hoverIntent(configMenu);
					// Disable parent links
					if (defaults.disableLink == true) {
						$('li a', obj).click(function (e) {
							if ($(this).siblings('ul').length > 0) {
								e.preventDefault();
							}
						});
					}
				} else {
					$('li a', obj).click(function (e) {

						let $activeLi = $(this).parent('li');
						let $parentsLi = $activeLi.parents('li');
						let $parentsUl = $activeLi.parents('ul');

						// Prevent browsing to link if has child links
						if (defaults.disableLink == true) {
							if ($(this).siblings('ul').length > 0) {
								e.preventDefault();
							}
						}
						// Auto close sibling menus
						if (defaults.autoClose == true) {
							autoCloseAccordion($parentsLi, $parentsUl);
						}

						if ($('> ul', $activeLi).is(':visible')) {
							$('ul', $activeLi).slideUp(defaults.speed);
							$('a', $activeLi).removeClass(defaults.classActive);

							if(defaults.classArrow.length > 0 && defaults.classArrowClose.length > 0){

								$activeLi.find('a .'  + defaults.classArrowClose.replace(' ', '.'))
									.removeClass(defaults.classArrowClose)
									.addClass(defaults.classArrow)
							}
						} else {
							$(this).siblings('ul').slideToggle(defaults.speed);
							$('> a', $activeLi).addClass(defaults.classActive);

							if(defaults.classArrow.length > 0 && defaults.classArrowClose.length > 0){

								$('> a .' + defaults.classArrow.replace(' ', '.'), $activeLi)
									.removeClass(defaults.classArrow)
									.addClass(defaults.classArrowClose)
							}

						}

						if ($activeLi.find('ul').length == 0 && defaults.ajaxUrl !== null && defaults.ajaxUrl.length > 0) {
							getElements($activeLi);
						}

						// Write cookie if save state is on
						if (defaults.saveState == true) {
							createCookie(defaults.cookie, obj);
						}
					});
				}
				// Set up accordion
				function setUpAccordion() {
					let $arrow = '<span class="' + defaults.classArrow + '"></span>';
					var classParentLi = defaults.classParent + '-li';
					$('> ul', obj).show();
					$('li', obj).each(function () {
						if ($('> ul', this).length > 0) {
							$(this).addClass(classParentLi);
							$('> a', this).addClass(defaults.classParent).append($arrow);
						}
					});
					$('> ul', obj).hide();
					if (defaults.showCount == true) {
						$('li.' + classParentLi, obj).each(function () {
							if (defaults.disableLink == true) {
								var getCount = parseInt($('ul a:not(.' + defaults.classParent + ')', this).length);
							} else {
								var getCount = parseInt($('ul a', this).length);
							}
							$('> a', this).append(' <span class="' + defaults.classCount + '">(' + getCount + ')</span>');
						});
					}
				}

				function linkOver() {

					let $activeLi = $(this).parent('li');
					let $parentsLi = $activeLi.parents('li');
					let $parentsUl = $activeLi.parents('ul');

					// Auto close sibling menus
					if (defaults.autoClose == true) {
						autoCloseAccordion($parentsLi, $parentsUl);
					}

					if ($('> ul', $activeLi).is(':visible')) {
						$('ul', $activeLi).slideUp(defaults.speed);
						$('a', $activeLi).removeClass(defaults.classActive);
					} else {
						$(this).siblings('ul').slideToggle(defaults.speed);
						$('> a', $activeLi).addClass(defaults.classActive);
					}

					// Write cookie if save state is on
					if (defaults.saveState == true) {
						createCookie(defaults.cookie, obj);
					}
				}

				function linkOut() {
				}

				function menuOver() {
				}

				function menuOut() {

					if (defaults.menuClose == true) {
						$('ul', obj).slideUp(defaults.speed);
						// Reset active links
						$('a', obj).removeClass(defaults.classActive);
						createCookie(defaults.cookie, obj);
					}
				}

				// Auto-Close Open Menu Items
				function autoCloseAccordion($parentsLi, $parentsUl) {
					$('ul', obj).not($parentsUl).slideUp(defaults.speed);
					// Reset active links
					$('a', obj).removeClass(defaults.classActive);
					$('> a', $parentsLi).addClass(defaults.classActive);
				}

				// Reset accordion using active links
				function resetAccordion() {
					$('ul', obj).hide();
					let $allActiveLi = $('a.' + defaults.classActive, obj);
					$allActiveLi.siblings('ul').show();
				}
			});
			// Retrieve cookie value and set active items
			function checkCookie(cookieId, obj) {
				// var cookieVal = $.cookie(cookieId);
				var cookieVal = BX.getCookie(cookieId);
				if (cookieVal != null) {
					// create array from cookie string
					var activeArray = cookieVal.split(',');
					let activeItem;
					$.each(activeArray, function (index, value) {
						var $cookieLi = $('li:eq(' + value + ')', obj);
						$('> a', $cookieLi).addClass(defaults.classActive);
						var $parentsLi = $cookieLi.parents('li');
						$('> a', $parentsLi).addClass(defaults.classActive);
						activeItem = $('> a.active', $parentsLi);
					});

					let $lastActive = $(activeItem[activeItem.length - 1]);

					let sectionId = BX.getCookie(defaults.cookie + '_SECTION');
					if(sectionId != null){
						getElements($lastActive.parent('li').find('[data-section="'+ sectionId +'"]'));
					}
				}
			}

			// Write cookie
			function createCookie(cookieId, obj) {
				var activeIndex = [];
				// Create array of active items index value
				$('li a.' + defaults.classActive, obj).each(function (i) {
					var $arrayItem = $(this).parent('li');
					var itemIndex = $('li', obj).index($arrayItem);
					activeIndex.push(itemIndex);
				});
				// Store in cookie
				BX.setCookie(cookieId, activeIndex, {path: '/'});
				// $.cookie(cookieId, activeIndex, {path: '/'});
			}

			function getElements($activeLi) {
				Ajax.get('/getElements', {params: {section: $activeLi.data('section')}}).then(res => {
					if (res.data.STATUS == 1 && res.data.DATA !== null) {
						$activeLi.append('<ul></ul>')
						let $subItemUL = $activeLi.find('ul');
						$subItemUL.slideToggle(defaults.speed);
						$('> a', $activeLi).addClass(defaults.classActive);
						ReactDOM.render(<Elemetns data={res.data.DATA} />, $subItemUL[0]);

						if (defaults.saveState == true) {
							BX.setCookie(defaults.cookie + '_SECTION', $activeLi.data('section'), {path: '/'});
						}
					}
				});
			}

			return this;
		}
	});
}(jQuery);

module.exports = dcAccordion;