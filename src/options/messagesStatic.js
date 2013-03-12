define(function () {

	'use strict';

	var sendMessage = function (settings, callback) {
		switch (settings.name) {
		case 'initOptions':
			callback(JSON.parse('{"settings":[{"name":"BuildReactor","baseUrl":"cctray","url":"https://api.travis-ci.org/repos/AdamNowotny/BuildReactor/cc.xml","icon":"cctray/icon.png","updateInterval":60,"username":"","password":"","projects":["AdamNowotny/BuildReactor"],"disabled":false},{"name":"OpenMRS","baseUrl":"bamboo","url":"http://ci.openmrs.org","icon":"bamboo/icon.png","updateInterval":60,"username":"","password":"","projects":["FUNC-APPTEST","FUNC-BUILDPERF","FUNC-PERF","JU-CORE"],"disabled":true},{"name":"Jenkins","baseUrl":"jenkins","url":"http://ci.jenkins-ci.org","icon":"jenkins/icon.png","updateInterval":60,"username":"","password":"","projects":["config-provider-model","infra_main_svn_to_git","infra_plugin_changes_report","infra_plugins_svn_to_git","infra_svnsync"],"disabled":true},{"name":"T1","baseUrl":"teamcity","url":"http://teamcity.jetbrains.com/","icon":"teamcity/icon.png","updateInterval":60,"username":"","password":"","projects":["bt308"],"disabled":true},{"name":"T2","baseUrl":"teamcity","url":"http://teamcity.codebetter.com/","icon":"teamcity/icon.png","updateInterval":60,"username":"","password":"","projects":["bt607"],"disabled":true}],"serviceTypes":[{"typeName":"Atlassian Bamboo","baseUrl":"bamboo","icon":"bamboo/icon.png","logo":"bamboo/logo.png","projects":[],"url":"","urlHint":"https://ci.openmrs.org/","username":"","password":"","updateInterval":60},{"typeName":"CCTray Generic","baseUrl":"cctray","icon":"cctray/icon.png","logo":"cctray/logo.png","projects":[],"url":"","urlHint":"http://cruisecontrol.instance.com/cctray.xml","username":"","password":"","updateInterval":60},{"typeName":"CruiseControl","baseUrl":"cruisecontrol","icon":"cruisecontrol/icon.png","logo":"cruisecontrol/logo.png","projects":[],"url":"","urlHint":"http://cruisecontrol.instance.com/","username":"","password":"","updateInterval":60},{"typeName":"CruiseControl.NET","baseUrl":"cruisecontrol.net","icon":"cruisecontrol.net/icon.png","logo":"cruisecontrol.net/logo.png","projects":[],"url":"","urlHint":"http://build.nauck-it.de/","username":"","password":"","updateInterval":60},{"typeName":"CruiseControl.rb","baseUrl":"cruisecontrol.rb","icon":"cruisecontrol.rb/icon.png","logo":"cruisecontrol.rb/logo.png","projects":[],"url":"","urlHint":"http://cruisecontrolrb.thoughtworks.com/","username":"","password":"","updateInterval":60},{"typeName":"ThoughtWorks GO","baseUrl":"go","icon":"go/icon.png","logo":"go/logo.png","projects":[],"url":"","urlHint":"http://example-go.thoughtworks.com/","username":"","password":"","updateInterval":60},{"typeName":"Jenkins","baseUrl":"jenkins","icon":"jenkins/icon.png","logo":"jenkins/logo.png","projects":[],"url":"","urlHint":"http://ci.jenkins-ci.org/","username":"","password":"","updateInterval":60},{"typeName":"TeamCity","baseUrl":"teamcity","icon":"teamcity/icon.png","logo":"teamcity/logo.png","projects":[],"url":"","urlHint":"http://teamcity.jetbrains.com/","username":"","password":"","updateInterval":60},{"typeName":"Travis","baseUrl":"travis","icon":"travis/icon.png","logo":"travis/logo.png","projects":[],"username":""}]}'));
			break;
		case 'availableProjects':
			// OpenMRS
			callback(JSON.parse('{"projects":{"items":[{"id":"JAVADOC-BRANCH18X","name":"Publish 1.8.x Javadocs","group":"Javadocs","enabled":true,"selected":false},{"id":"JAVADOC-BRANCH19X","name":"Publish 1.9.x Javadocs","group":"Javadocs","enabled":true,"selected":false},{"id":"JAVADOC-TRUNK","name":"Publish Trunk Javadocs","group":"Javadocs","enabled":true,"selected":false},{"id":"JU-CORE","name":"OpenMRS Core","group":"JUnit","enabled":true,"selected":true},{"id":"FUNC-APPTEST","name":"Application Release Test","group":"Functional Tests","enabled":false,"selected":false},{"id":"FUNC-BUILDPERF","name":"Build and Deploy to Buea","group":"Functional Tests","enabled":true,"selected":false},{"id":"FUNC-LBR","name":"Liquibase Runner","group":"Functional Tests","enabled":true,"selected":false},{"id":"FUNC-PERF","name":"Performance Test","group":"Functional Tests","enabled":true,"selected":false},{"id":"NIGHTLY-BRANCH18X","name":"Deploy Nightly 1.8.x","group":"Nightly Builds","enabled":true,"selected":false},{"id":"NIGHTLY-BRANCH19X","name":"Deploy Nightly 1.9.x","group":"Nightly Builds","enabled":true,"selected":false},{"id":"NIGHTLY-TRUNK","name":"Deploy Nightly Trunk","group":"Nightly Builds","enabled":true,"selected":false},{"id":"BUNDLED-FORM","name":"Formentry Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-HTMLEXT","name":"Htmlformentry Extensions Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-HTML","name":"Htmlformentry Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-HTMLWIDGETS","name":"Htmlwidgets Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-LOGIC","name":"Logic Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-MDS","name":"Metadata Sharing","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-FLAG","name":"Patient Flags Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-REPORT","name":"Reporting","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-RPC","name":"Reporting Compatibility Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-RESTWS","name":"REST Web Services","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-SXS","name":"Serialization.xstream","group":"Bundled Modules","enabled":true,"selected":false},{"id":"BUNDLED-XFORMS","name":"XForms Module","group":"Bundled Modules","enabled":true,"selected":false},{"id":"DEMO-DEVTEST01","name":"Deploy Dev Test 01","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-DEVTEST01A","name":"Deploy Dev Test 01 Hibernate Search","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-LATEST","name":"Deploy Latest Demo","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-NIGHTLY","name":"Deploy Nightly Demo","group":"Demo Sites","enabled":true,"selected":false},{"id":"DEMO-DEMODB","name":"Reset Latest Demo DB","group":"Demo Sites","enabled":true,"selected":true},{"id":"APPT-APPT","name":"Appointment Module","group":"Appointment","enabled":true,"selected":false}]}}'));
			break;
		//case 'availableProjects':
		//	// Jenkins
		//	callback(JSON.parse('{"projects":{"items":[{"id":"config-provider-model","name":"config-provider-model","group":null,"enabled":true,"selected":true},{"id":"core_selenium-test","name":"core_selenium-test","group":null,"enabled":true,"selected":true},{"id":"fix-git-configuration-on-remote-slave-8","name":"fix-git-configuration-on-remote-slave-8","group":null,"enabled":true,"selected":false},{"id":"gerrit_master","name":"gerrit_master","group":null,"enabled":true,"selected":false},{"id":"infa_release.rss","name":"infa_release.rss","group":null,"enabled":true,"selected":false},{"id":"infra_backend-confluence-spam-remover","name":"infra_backend-confluence-spam-remover","group":null,"enabled":true,"selected":false},{"id":"infra_backend-merge-all-repo","name":"infra_backend-merge-all-repo","group":null,"enabled":true,"selected":false},{"id":"infra_backend-plugin-report-card","name":"infra_backend-plugin-report-card","group":null,"enabled":true,"selected":false},{"id":"infra_backend-war-size-tracker","name":"infra_backend-war-size-tracker","group":null,"enabled":true,"selected":false},{"id":"infra_changelog_refresh","name":"infra_changelog_refresh","group":null,"enabled":true,"selected":false},{"id":"infra_checkout_stats","name":"infra_checkout_stats","group":null,"enabled":true,"selected":false},{"id":"infra_drupalcron","name":"infra_drupalcron","group":null,"enabled":true,"selected":false},{"id":"infra_extension-indexer","name":"infra_extension-indexer","group":null,"enabled":true,"selected":false},{"id":"infra_github_repository_list","name":"infra_github_repository_list","group":null,"enabled":true,"selected":false},{"id":"infra_javadoc","name":"infra_javadoc","group":null,"enabled":true,"selected":false},{"id":"infra_jenkins-ci.org_webcontents","name":"infra_jenkins-ci.org_webcontents","group":null,"enabled":true,"selected":false},{"id":"infra_main_svn_to_git","name":"infra_main_svn_to_git","group":null,"enabled":false,"selected":false},{"id":"infra_mirroring","name":"infra_mirroring","group":null,"enabled":true,"selected":false},{"id":"infra_plugin-compat-tester","name":"infra_plugin-compat-tester","group":null,"enabled":true,"selected":false},{"id":"infra_plugin_changes_report","name":"infra_plugin_changes_report","group":null,"enabled":true,"selected":false},{"id":"infra_pluginmirror","name":"infra_pluginmirror","group":null,"enabled":true,"selected":false},{"id":"infra_plugins_svn_to_git","name":"infra_plugins_svn_to_git","group":null,"enabled":false,"selected":false},{"id":"infra_pull_m2repo","name":"infra_pull_m2repo","group":null,"enabled":true,"selected":false},{"id":"infra_pull_releases","name":"infra_pull_releases","group":null,"enabled":false,"selected":false},{"id":"infra_repo.jenkins-ci.org_maven_index","name":"infra_repo.jenkins-ci.org_maven_index","group":null,"enabled":true,"selected":false},{"id":"infra_statistics","name":"infra_statistics","group":null,"enabled":true,"selected":false},{"id":"infra_svnsync","name":"infra_svnsync","group":null,"enabled":false,"selected":false},{"id":"infra_update_center","name":"infra_update_center","group":null,"enabled":true,"selected":false},{"id":"infra_update_center_mirror","name":"infra_update_center_mirror","group":null,"enabled":true,"selected":false},{"id":"infra_update_center_stable","name":"infra_update_center_stable","group":null,"enabled":true,"selected":false},{"id":"infra_update_mave_site","name":"infra_update_mave_site","group":null,"enabled":true,"selected":false},{"id":"jenkins_lts_branch","name":"jenkins_lts_branch","group":null,"enabled":true,"selected":false},{"id":"jenkins_main_trunk","name":"jenkins_main_trunk","group":null,"enabled":true,"selected":false},{"id":"jenkins_pom","name":"jenkins_pom","group":null,"enabled":true,"selected":false},{"id":"jenkins_rc_branch","name":"jenkins_rc_branch","group":null,"enabled":true,"selected":false},{"id":"jenkins_ui-changes_branch","name":"jenkins_ui-changes_branch","group":null,"enabled":true,"selected":false},{"id":"junit-runtime-suite","name":"junit-runtime-suite","group":null,"enabled":true,"selected":false},{"id":"kohsuke_github-api","name":"kohsuke_github-api","group":null,"enabled":true,"selected":false},{"id":"lib-jenkins-maven-artifact-manager","name":"lib-jenkins-maven-artifact-manager","group":null,"enabled":true,"selected":false},{"id":"lib-jenkins-maven-embedder","name":"lib-jenkins-maven-embedder","group":null,"enabled":true,"selected":false},{"id":"lib-jira-api","name":"lib-jira-api","group":null,"enabled":true,"selected":false},{"id":"libs_core-js","name":"libs_core-js","group":null,"enabled":true,"selected":false},{"id":"libs_dom4j","name":"libs_dom4j","group":null,"enabled":true,"selected":false},{"id":"libs_htmlunit","name":"libs_htmlunit","group":null,"enabled":true,"selected":false},{"id":"libs_jelly","name":"libs_jelly","group":null,"enabled":true,"selected":false},{"id":"libs_jexl","name":"libs_jexl","group":null,"enabled":true,"selected":false},{"id":"libs_jmdns","name":"libs_jmdns","group":null,"enabled":true,"selected":false},{"id":"libs_json-lib","name":"libs_json-lib","group":null,"enabled":true,"selected":false},{"id":"libs_maven-jetty-plugin","name":"libs_maven-jetty-plugin","group":null,"enabled":true,"selected":false},{"id":"libs_netx","name":"libs_netx","group":null,"enabled":true,"selected":false},{"id":"libs_svnkit","name":"libs_svnkit","group":null,"enabled":true,"selected":false},{"id":"libs_trilead-ssh2","name":"libs_trilead-ssh2","group":null,"enabled":true,"selected":false},{"id":"libs_winstone","name":"libs_winstone","group":null,"enabled":true,"selected":false},{"id":"libs_xstream","name":"libs_xstream","group":null,"enabled":true,"selected":false},{"id":"maven-interceptors","name":"maven-interceptors","group":null,"enabled":true,"selected":false},{"id":"model-ant-project","name":"model-ant-project","group":null,"enabled":true,"selected":false},{"id":"model-ruby-project","name":"model-ruby-project","group":null,"enabled":true,"selected":false},{"id":"peripheral apps deactivation prevention","name":"peripheral apps deactivation prevention","group":null,"enabled":true,"selected":false},{"id":"plugin-compat-tester","name":"plugin-compat-tester","group":null,"enabled":true,"selected":false},{"id":"selenium-tests","name":"selenium-tests","group":null,"enabled":true,"selected":false},{"id":"test-matrix","name":"test-matrix","group":null,"enabled":true,"selected":false},{"id":"tools_maven-hpi-plugin","name":"tools_maven-hpi-plugin","group":null,"enabled":true,"selected":false},{"id":"tools_maven-hpi-plugin-maven-2.x","name":"tools_maven-hpi-plugin-maven-2.x","group":null,"enabled":true,"selected":false}],"primaryView":"All Failed","views":[{"name":"All","items":["config-provider-model","core_selenium-test","fix-git-configuration-on-remote-slave-8","gerrit_master","infa_release.rss","infra_backend-confluence-spam-remover","infra_backend-merge-all-repo","infra_backend-plugin-report-card","infra_backend-war-size-tracker","infra_changelog_refresh","infra_checkout_stats","infra_drupalcron","infra_extension-indexer","infra_github_repository_list","infra_javadoc","infra_jenkins-ci.org_webcontents","infra_main_svn_to_git","infra_mirroring","infra_plugin-compat-tester","infra_plugin_changes_report","infra_pluginmirror","infra_plugins_svn_to_git","infra_pull_m2repo","infra_pull_releases","infra_repo.jenkins-ci.org_maven_index","infra_statistics","infra_svnsync","infra_update_center","infra_update_center_mirror","infra_update_center_stable","infra_update_mave_site","jenkins_lts_branch","jenkins_main_trunk","jenkins_pom","jenkins_rc_branch","jenkins_ui-changes_branch","junit-runtime-suite","kohsuke_github-api","lib-jenkins-maven-artifact-manager","lib-jenkins-maven-embedder","lib-jira-api","libs_core-js","libs_dom4j","libs_htmlunit","libs_jelly","libs_jexl","libs_jmdns","libs_json-lib","libs_maven-jetty-plugin","libs_netx","libs_svnkit","libs_trilead-ssh2","libs_winstone","libs_xstream","maven-interceptors","model-ant-project","model-ruby-project","peripheral apps deactivation prevention","plugin-compat-tester","selenium-tests","test-matrix","tools_maven-hpi-plugin","tools_maven-hpi-plugin-maven-2.x"]},{"name":"All Disabled","items":["infra_main_svn_to_git","infra_plugins_svn_to_git","infra_pull_releases","infra_svnsync"]},{"name":"All Failed","items":["core_selenium-test","infra_extension-indexer","infra_github_repository_list","infra_plugin-compat-tester","infra_plugin_changes_report","infra_plugins_svn_to_git","infra_svnsync","jenkins_ui-changes_branch","junit-runtime-suite","libs_svnkit","selenium-tests"]},{"name":"All Unstable","items":["jenkins_rc_branch"]},{"name":"Infrastructure","items":["infra_backend-confluence-spam-remover","infra_backend-merge-all-repo","infra_backend-plugin-report-card","infra_backend-war-size-tracker","infra_changelog_refresh","infra_checkout_stats","infra_drupalcron","infra_extension-indexer","infra_github_repository_list","infra_javadoc","infra_jenkins-ci.org_webcontents","infra_main_svn_to_git","infra_mirroring","infra_plugin-compat-tester","infra_plugin_changes_report","infra_pluginmirror","infra_plugins_svn_to_git","infra_pull_m2repo","infra_pull_releases","infra_repo.jenkins-ci.org_maven_index","infra_statistics","infra_svnsync","infra_update_center","infra_update_center_mirror","infra_update_center_stable","infra_update_mave_site","peripheral apps deactivation prevention"]},{"name":"Jenkins core","items":["core_selenium-test","jenkins_lts_branch","jenkins_main_trunk","jenkins_pom","jenkins_rc_branch","jenkins_ui-changes_branch","selenium-tests"]},{"name":"Libraries","items":["config-provider-model","lib-jenkins-maven-artifact-manager","lib-jenkins-maven-embedder","lib-jira-api","libs_core-js","libs_dom4j","libs_htmlunit","libs_jelly","libs_jexl","libs_jmdns","libs_json-lib","libs_maven-jetty-plugin","libs_netx","libs_svnkit","libs_trilead-ssh2","libs_winstone","libs_xstream","maven-interceptors","tools_maven-hpi-plugin","tools_maven-hpi-plugin-maven-2.x"]},{"name":"Other Projects","items":["gerrit_master","junit-runtime-suite","lib-jenkins-maven-artifact-manager","lib-jenkins-maven-embedder","lib-jira-api","model-ant-project","model-ruby-project"]}]}}'));
		//	break;
		}
	};

	return {
		send: sendMessage
	};

});