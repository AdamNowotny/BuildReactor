import cctray from 'services/cctray/cctray';
import { joinUrl } from 'common/utils';

export default {
    getInfo: () => ({
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
        const url = joinUrl(settings.url, 'cctray.xml');
        return cctray.getAll({ ...settings, ...{ url } });
    },
    getLatest: (settings) => {
        const url = joinUrl(settings.url, 'cctray.xml');
        return cctray.getLatest({ ...settings, ...{ url } });
    }
};
