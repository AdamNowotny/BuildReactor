import cctray from 'services/cctray/cctray';

export default {
    getInfo: () => ({
        typeName: 'CruiseControl.rb',
        baseUrl: 'cruisecontrol.rb',
        icon: 'services/cruisecontrol.rb/icon.png',
        logo: 'services/cruisecontrol.rb/logo.png',
        defaultConfig: {
            baseUrl: 'cruisecontrol.rb',
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
                help: 'Example: http://server.com/XmlStatusReport.aspx'
            },
            { type: 'username' },
            { type: 'password' }
        ]
    }),
    getAll: (settings) => {
        const url = new URL('XmlStatusReport.aspx', settings.url);
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings) => {
        const url = new URL('XmlStatusReport.aspx', settings.url);
        return cctray.getLatest({ ...settings, ...{ url } });
    }
};
