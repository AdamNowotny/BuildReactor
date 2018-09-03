import updater from 'core/config/serviceConfigUpdater';

describe('core/config/serviceConfigUpdater', function() {

    it('should return empty array by default', function() {
        var updated = updater.update(undefined);

        expect(updated).toEqual([]);
    });

    it('should fix config by returning empty array if not array', function() {
        var updated = updater.update({});

        expect(updated).toEqual([]);
    });

    it('should fix config by returning empty array if not array of objects', function() {
        var updated = updater.update(["a", "b"]);

        expect(updated).toEqual([]);
    });

});
