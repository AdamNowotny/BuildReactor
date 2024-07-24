import cctray from 'services/cctray/cctray';
import type {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

export default {
    getInfo: (): CIServiceDefinition => ({
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
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> => {
        const url = new URL('XmlStatusReport.aspx', settings.url).href;
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> => {
        const url = new URL('XmlStatusReport.aspx', settings.url).href;
        return cctray.getLatest({ ...settings, ...{ url } });
    },
};
