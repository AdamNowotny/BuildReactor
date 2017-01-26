const update = function(config = []) {
    return isValid(config) ? config : [];
};

const isValid = function(config) {
    const isArray = Boolean(config) && config.length > -1;
    return isArray && config.every((value) => typeof value === 'object');
};

export default {
    update
};
