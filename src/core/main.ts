import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cc from 'services/cruisecontrol/cruisecontrol';
import ccnet from 'services/cruisecontrol.net/cruisecontrol.net';
import ccrb from 'services/cruisecontrol.rb/cruisecontrol.rb';
import cctray from 'services/cctray/cctray';
import go from 'services/go/go';
import jenkins from 'services/jenkins/jenkins';
import logger from 'common/logger';
import notificationController from 'core/notifications/notificationController';
import passwordExpiredHandler from 'core/passwordExpiredHandler';
import poolingService from 'core/services/poolingService';
import serviceController from 'core/services/serviceController';
import serviceView from 'core/services/serviceView';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';
import serviceRepository from 'services/service-repository';
import messaging from 'service-worker/messaging';
import stateStorage from 'service-worker/state-storage';
import badge from 'service-worker/badge';
import viewConfigStorage from 'service-worker/view-config-storage';
import serviceConfig from 'service-worker/service-config';

void (async () => {
    // transitioning from background page to service worker
    logger.init({ prefix: 'core', enableEvents: true });
    await serviceConfig.init();
    await viewConfigStorage.init();
    await stateStorage.init();
    serviceRepository.init();
    messaging.init();
    badge.init();

    // background page modules
    notificationController.init();
    serviceView.init();
    passwordExpiredHandler.init();

    serviceController.clear();
    serviceController.registerType(poolingService.create(bamboo));
    serviceController.registerType(poolingService.create(buildbot));
    serviceController.registerType(poolingService.create(buildkite));
    serviceController.registerType(poolingService.create(cctray));
    serviceController.registerType(poolingService.create(cc));
    serviceController.registerType(poolingService.create(ccnet));
    serviceController.registerType(poolingService.create(ccrb));
    serviceController.registerType(poolingService.create(go));
    serviceController.registerType(poolingService.create(jenkins));
    serviceController.registerType(poolingService.create(teamcity));
    serviceController.registerType(poolingService.create(travis));

    serviceController.start();
})();