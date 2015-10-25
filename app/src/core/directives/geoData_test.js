/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./geoData');
	require('angularMocks');

	var template = require('tpl!./geo-data.html');

	describe('geoData', function() {
		var compile, rootScope, document, mockGeoData;

		beforeEach(function() {
			module('app.core');
			module(function($provide) {
				$provide.value('geolocation', {
					observe: function(callback) {
						callback(mockGeoData);
					}
				});
			});
			inject(function($compile, $rootScope, $document, $templateCache) {
				compile = $compile;
				rootScope = $rootScope;
				document = $document;

				$templateCache.put('core/directives/geo-data.html', template);
			});
		});

		function generateScope(){
			var scope = rootScope.$new();
			var element = compile('<div geo-data></div>')(scope);
			scope.$digest();
			return element.isolateScope();
		}

		it('should populate accuracy if available', function() {
			mockGeoData = {
				coords: {
					accuracy: 10
				}
			};
			var scope = generateScope();
			expect(scope.accuracy).toEqual(10);
		});

		it('should populate elevation if available', function() {
			mockGeoData = {
				coords: {
					altitude: 10
				}
			};
			var scope = generateScope();
			expect(scope.altitude).toEqual(10);
		});

		it('should populate heading if available', function() {
			mockGeoData = {
				coords: {
					heading: 10
				}
			};
			var scope = generateScope();
			expect(scope.heading).toEqual(10);
		});

	});
});
