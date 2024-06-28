/* eslint-disable sort-imports */
import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cc from 'services/cruisecontrol/cruisecontrol';
import ccnet from 'services/cruisecontrol.net/cruisecontrol.net';
import ccrb from 'services/cruisecontrol.rb/cruisecontrol.rb';
import cctray from 'services/cctray/cctray';
import go from 'services/go/go';
import jenkins from 'services/jenkins/jenkins';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';

import logger from "common/logger";
import serviceRepository from './service-repository';
import messaging from './messaging';

serviceRepository.registerType(bamboo);
serviceRepository.registerType(buildbot);
serviceRepository.registerType(buildkite);
serviceRepository.registerType(cc);
serviceRepository.registerType(ccnet);
serviceRepository.registerType(ccrb);
serviceRepository.registerType(cctray);
serviceRepository.registerType(go);
serviceRepository.registerType(jenkins);
serviceRepository.registerType(teamcity);
serviceRepository.registerType(travis);

logger.init({ prefix: 'service-worker', enableEvents: false });
messaging.init();
