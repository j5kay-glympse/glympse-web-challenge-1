define(['jquery', 'TimelineLite'], function($, TimelineLite) {
	var _hud = $('[data-hud]');



	function showToast(html){
		var timeout;
		var toast = $('<div class="toast"></div>');
		toast.append(html);
		_hud.append(toast);
		toast.on('click', function() {
			window.clearTimeout(timeout);
			_dismiss(toast);
		});
		var t = new TimelineLite();
		t.from(toast,1.25, {autoAlpha: 0, top: '-=30px', ease: 'Power4.easeOut'});
		timeout = window.setTimeout(function() {
			_dismiss(toast);
		}, 5000);
	}



	function _dismiss(el){
		var t = new TimelineLite({
			onComplete: function() {
				el.remove();
			}
		});
		t.to(el, .5, {autoAlpha: 0, top: '+=30px', ease: 'Power4.easeIn'});
	}



	return {
		showToast: showToast
	};
});
