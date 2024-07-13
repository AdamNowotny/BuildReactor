import cctray from 'services/cctray/cctray';

export default {
    getInfo: () => ({
        typeName: 'CruiseControl',
        baseUrl: 'cruisecontrol',
        icon: 'services/cruisecontrol/icon.png',
        logo: 'services/cruisecontrol/logo.png',
        defaultConfig: {
            baseUrl: 'cruisecontrol',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
            updateInterval: 60
        },
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'Example: http://server.com/cctray.xml'
            },
            { type: 'username' },
            { type: 'password' }
        ]
    }),
    getAll: (settings) => {
        const url = new URL('cctray.xml', settings.url).href;
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings) => {
        const url = new URL('cctray.xml', settings.url).href;
        return cctray.getLatest({ ...settings, ...{ url } });
    }
};
