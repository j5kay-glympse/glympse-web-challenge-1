define(function() {
	return function($elem) {
		$elem.css('display', 'block');
		$elem[0].clientHeight = $elem[0].clientHeight; // flush our cache
		$elem.addClass('is-active');	
	};
});
