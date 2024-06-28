import 'rx/dist/rx.binding';
import Rx from 'rx';
import configStore from 'core/config/localStore';
import configUpdater from 'core/config/viewConfigUpdater';

var key = 'views';
var changes = new Rx.BehaviorSubject();

var init = function() {
    var config = configUpdater.update(configStore.getItem(key));
    configStore.setItem(key, config);
    changes.onNext(config);
};

var save = function(config) {
    if (typeof config !== 'object' || config === null) {
        throw new Error('view config has to be an object');
    }
    if (JSON.stringify(configStore.getItem(key)) !== JSON.stringify(config)) {
        configStore.setItem(key, config);
        changes.onNext(config);
    }
};

export default {
    init: init,
    save: save,
    changes: changes
};
