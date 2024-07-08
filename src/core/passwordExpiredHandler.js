import events from 'core/events';
import serviceConfig from 'service-worker/service-config';

const init = () => {
    events.getByName('passwordExpired')
    .do((event) => serviceConfig.disableService(event.source))
    .subscribe();
};

export default {
    init
};
