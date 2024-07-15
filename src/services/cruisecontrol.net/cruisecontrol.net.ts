import cctray from 'services/cctray/cctray';
import { CIServiceDefinition, CIServiceSettings } from 'services/service-types';

export default {
    getInfo: (): CIServiceDefinition => ({
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
            updateInterval: 60,
        },
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'Example: http://server.com/XmlStatusReport.aspx',
            },
            { type: 'username' },
            { type: 'password' },
        ],
    }),
    getAll: (settings: CIServiceSettings) => {
        const url = new URL('XmlStatusReport.aspx', settings.url).href;
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings: CIServiceSettings) => {
        const url = new URL('XmlStatusReport.aspx', settings.url).href;
        return cctray.getLatest({ ...settings, ...{ url } });
    },
};
