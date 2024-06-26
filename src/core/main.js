import badgeController from 'core/badgeController';
import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cc from 'services/cruisecontrol/cruisecontrol';
import ccnet from 'services/cruisecontrol.net/cruisecontrol.net';
import ccrb from 'services/cruisecontrol.rb/cruisecontrol.rb';
import cctray from 'services/cctray/cctray';
import chromeListeners from 'core/chromeListeners';
import go from 'services/go/go';
import jenkins from 'services/jenkins/jenkins';
import logger from 'common/logger';
import notificationController from 'core/notifications/notificationController';
import passwordExpiredHandler from 'core/passwordExpiredHandler';
import poolingService from 'core/services/poolingService';
import serviceConfiguration from 'core/config/serviceConfiguration';
import serviceController from 'core/services/serviceController';
import serviceView from 'core/services/serviceView';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';
import viewConfiguration from 'core/config/viewConfiguration';
import serviceMonitor from 'services/service-monitor';
import messaging from 'service-worker/messaging';

serviceConfiguration.init();
viewConfiguration.init();
logger.init({ prefix: 'core', enableEvents: true });
badgeController.init();
notificationController.init({ configuration: viewConfiguration.changes });
serviceView.init();
chromeListeners.init();
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

serviceController.start(serviceConfiguration.changes);

// transitioning from background page to service worker
serviceMonitor.init();
messaging.init();
