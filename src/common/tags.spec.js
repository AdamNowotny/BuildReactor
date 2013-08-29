define(['common/tags'], function (tags) {

	'use strict';

	describe('common/tags', function () {

		describe('contains', function () {

			it('should return true if tag exists', function () {
				var tagList = [{ name: 'tag1' }, { name: 'tag2' }];
				
				expect(tags.contains('tag1', tagList)).toBe(true);
			});

		});
	});

});
