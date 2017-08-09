import request from 'services/jsonRequest';

const projects = (settings) => request
    .get({
        url: settings.url,
        type: 'xml',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

export default {
    projects
};
