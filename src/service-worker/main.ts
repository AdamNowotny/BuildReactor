import logger from 'common/logger';
import notificationController from 'core/notifications/notificationController';
import poolingService from 'core/services/poolingService';
import serviceController from 'core/services/serviceController';
import serviceView from 'core/services/serviceView';
import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cctray from 'services/cctray/cctray';
import ccnet from 'services/cruisecontrol.net/cruisecontrol.net';
import ccrb from 'services/cruisecontrol.rb/cruisecontrol.rb';
import cc from 'services/cruisecontrol/cruisecontrol';
import go from 'services/go/go';
import jenkins from 'services/jenkins/jenkins';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';
import serviceRepository from '../services/service-repository';
import badge from './badge';
import messaging from './messaging';
import serviceConfig from './storage/service-config';
import stateStorage from './storage/service-state';
import viewConfigStorage from './storage/view-config';
import serviceMonitor from 'services/service-monitor';
import passwordExpiredHandler from './events/password-expired';
import buildStartedHandler from './events/build-started';
import buildFinishedHandler from './events/build-finished';

void (async () => {
    logger.init({ prefix: 'service-worker', enableEvents: false });
    await serviceConfig.init();
    await viewConfigStorage.init();
    await stateStorage.init();
    serviceRepository.init();
    messaging.init();
    badge.init();
    serviceMonitor.init();
    passwordExpiredHandler.init();
    buildStartedHandler.init();
    buildFinishedHandler.init();

    // background page modules
    notificationController.init();
    serviceView.init();

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

    // serviceMonitor.start();
})();
