import cctray from 'services/cctray/cctray';
import {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

export default {
    getInfo: (): CIServiceDefinition => ({
        typeName: 'GoCD',
        baseUrl: 'go',
        icon: 'services/go/icon.png',
        logo: 'services/go/logo.png',
        defaultConfig: {
            baseUrl: 'go',
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
                help: 'Example: http://server.com/cctray.xml',
            },
            { type: 'username' },
            { type: 'password' },
        ],
    }),
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> => {
        const url = new URL('cctray.xml', settings.url).href;
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> => {
        const url = new URL('cctray.xml', settings.url).href;
        return cctray.getLatest({ ...settings, ...{ url } });
    },
};
