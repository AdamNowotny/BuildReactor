import logger from "common/logger";

function RequestError(ex, options) {
    this.name = "RequestError";
    this.status = ex.status;
    this.message = ex.message ?? 'Connection failed';
    this.url = options.url;
}

function TimeoutError(ex, options) {
    this.name = "TimeoutError";
    this.status = null;
    this.message = ex.message;
    this.url = options.url;
}

function NotFoundError(response) {
    this.name = "NotFoundError";
    this.status = response?.status;
    this.message = `[${response?.status}] Not found`;
    this.url = response?.url;
}

function UnauthorisedError(response) {
    this.name = "UnauthorisedError";
    this.status = response?.status;
    this.message = `[${response?.status}] Unauthorised`;
    this.url = response?.url;
}

function create(ex, options) {
    logger.log('requestErrors.create', ex, options);
    if (ex.timeout) {
        return new TimeoutError(ex, options);
    }
    if (ex.response && ex.response.status === 404) {
        return new NotFoundError(ex.response, options);
    }
    if (ex.response && ([401, 403].includes(ex.response.status))) {
        return new UnauthorisedError(ex.response, options);
    }
    return new RequestError(ex, options);
}

export default {
    create
};
