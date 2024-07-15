import cctray from 'services/cctray/cctray';
import { CIServiceDefinition, CIServiceSettings } from 'services/service-types';

export default {
    getInfo: (): CIServiceDefinition => ({
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
    getAll: (settings: CIServiceSettings) => {
        const url = new URL('cctray.xml', settings.url).href;
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings: CIServiceSettings) => {
        const url = new URL('cctray.xml', settings.url).href;
        return cctray.getLatest({ ...settings, ...{ url } });
    }
};
