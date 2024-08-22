export default [
    {
        name: 'BuildReactor long name',
        baseUrl: 'cctray',
        url: 'https://api.travis-ci.org/repos/AdamNowotny/BuildReactor/cc.xml',
        icon: 'cctray/icon.png',
        username: '',
        password: '',
        pipelines: ['AdamNowotny/BuildReactor'],
        isDisabled: false,
    },
    {
        name: 'OpenMRS',
        baseUrl: 'bamboo',
        url: 'http://ci.openmrs.org',
        icon: 'bamboo/icon.png',
        username: '',
        password: '',
        pipelines: ['FUNC-APPTEST', 'FUNC-BUILDPERF', 'FUNC-PERF', 'JU-CORE'],
        isDisabled: false,
    },
    {
        name: 'Jenkins',
        baseUrl: 'jenkins',
        url: 'http://ci.jenkins-ci.org',
        icon: 'jenkins/icon.png',
        username: '',
        password: '',
        pipelines: [
            'config-provider-model',
            'infra_main_svn_to_git',
            'infra_plugin_changes_report',
            'infra_plugins_svn_to_git',
            'infra_svnsync',
        ],
        isDisabled: false,
    },
    {
        name: 'T1',
        baseUrl: 'teamcity',
        url: 'http://teamcity.jetbrains.com/',
        icon: 'teamcity/icon.png',
        username: '',
        password: '',
        pipelines: ['bt308'],
        isDisabled: true,
        branch: '',
    },
    {
        name: 'T2',
        baseUrl: 'teamcity',
        url: 'http://teamcity.codebetter.com/',
        icon: 'teamcity/icon.png',
        username: '',
        password: '',
        pipelines: ['bt607'],
        isDisabled: false,
        branch: 'release',
    },
];
