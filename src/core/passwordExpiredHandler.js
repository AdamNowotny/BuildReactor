import events from 'core/events';
import serviceConfiguration from 'core/config/serviceConfiguration';

const init = () => {
    events.getByName('passwordExpired')
    .do((event) => serviceConfiguration.disableService(event.source))
    .subscribe();
};

export default {
    init
};
