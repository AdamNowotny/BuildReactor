import request from 'core/services/request';

export default {
    projects: (settings) => request
        .get({
            url: settings.url,
            type: 'xml',
            username: settings.username,
            password: settings.password
        })
        .select((response) => response.body)
};
