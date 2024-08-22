export default [
    {
        typeName: 'Atlassian Bamboo',
        baseUrl: 'bamboo',
        icon: 'services/bamboo/icon.png',
        logo: 'services/bamboo/logo.png',
        fields: [
            {
                type: 'url',
                name: 'Server URL, e.g. http://ci.openmrs.org/',
                help: 'For Bamboo OnDemand use https://[your_account].atlassian.net/builds',
            },
            { type: 'token' },
        ],
        defaultConfig: {
            baseUrl: 'bamboo',
            name: '',
            pipelines: [],
            url: '',
            token: '',
        },
    },
    {
        typeName: 'BuildBot',
        baseUrl: 'buildbot',
        icon: 'services/buildbot/icon.png',
        logo: 'services/buildbot/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. https://build.webkit.org/' },
            { type: 'username' },
            { type: 'password' },
        ],
        defaultConfig: {
            baseUrl: 'buildbot',
            name: '',
            pipelines: [],
            url: '',
            username: '',
            password: '',
        },
    },
    {
        typeName: 'BuildKite',
        baseUrl: 'buildkite',
        icon: 'services/buildkite/icon.png',
        logo: 'services/buildkite/logo.svg',
        fields: [
            {
                type: 'token',
                help: 'Permissions needed: read_builds, read_organizations, read_pipelines',
            },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'buildkite',
            name: '',
            pipelines: [],
            token: '',
            branch: 'main',
        },
    },
    {
        typeName: 'CCTray XML',
        baseUrl: 'cctray',
        icon: 'services/cctray/icon.png',
        logo: 'services/cctray/logo.png',
        defaultConfig: {
            baseUrl: 'cctray',
            name: '',
            pipelines: [],
            url: '',
            username: '',
            password: '',
        },
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'More information at <a href="https://cctray.org/servers/" target="_blank">https://cctray.org/servers/</a>',
            },
            { type: 'username' },
            { type: 'password' },
        ],
    },
    {
        typeName: 'GitHub Actions',
        baseUrl: 'github',
        icon: 'services/github/icon.png',
        logo: 'services/github/logo.svg',
        fields: [
            {
                type: 'url',
                name: 'Github URL, f.e. https://github.com/AdamNowotny/BuildReactor',
            },
            {
                type: 'token',
                help: 'Create token at <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">https://github.com/settings/personal-access-tokens/new</a>',
            },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'github',
            url: '',
            name: '',
            pipelines: [],
            token: '',
        },
    },
    {
        typeName: 'Jenkins',
        baseUrl: 'jenkins',
        icon: 'services/jenkins/icon.png',
        logo: 'services/jenkins/logo.png',
        fields: [
            {
                type: 'url',
                name: 'Jenkins server or view URL, e.g. http://ci.jenkins-ci.org/',
            },
            { type: 'username' },
            { type: 'password' },
        ],
        defaultConfig: {
            baseUrl: 'jenkins',
            name: '',
            pipelines: [],
            url: '',
            username: '',
            password: '',
        },
    },
    {
        typeName: 'TeamCity',
        baseUrl: 'teamcity',
        icon: 'services/teamcity/icon.png',
        logo: 'services/teamcity/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. http://teamcity.jetbrains.com/' },
            { type: 'username' },
            { type: 'password' },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'teamcity',
            name: '',
            pipelines: [],
            url: '',
            username: '',
            password: '',
            branch: '',
        },
    },
];
