define(function() {
	return function($elem) {
		if ($elem.hasClass('is-active')){
			$elem.removeClass('is-active');
			setTimeout(function() {
				$elem.css('display', 'none');
			}, 300);
		}
	};
});
