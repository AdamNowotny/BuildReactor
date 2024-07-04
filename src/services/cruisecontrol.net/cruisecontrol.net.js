import cctray from 'services/cctray/cctray';
import { joinUrl } from 'common/utils';

export default {
    getInfo: () => ({
        typeName: 'CruiseControl.NET',
        baseUrl: 'cruisecontrol.net',
        icon: 'services/cruisecontrol.net/icon.png',
        logo: 'services/cruisecontrol.net/logo.png',
        defaultConfig: {
            baseUrl: 'cruisecontrol.net',
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
        const url = joinUrl(settings.url, 'XmlStatusReport.aspx');
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings) => {
        const url = joinUrl(settings.url, 'XmlStatusReport.aspx');
        return cctray.getLatest({ ...settings, ...{ url } });
    }
};
