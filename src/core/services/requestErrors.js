function AjaxError(ex) {
    this.name = "AjaxError";
    this.status = ex.status;
    if (ex.response && ex.response.error) {
        this.message = ex.response.error.message;
        this.url = ex.response.error.url;
    }
    this.message = this.message || 'Connection failed';
    this.url = this.url || ex.url;
}

function TimeoutError(ex, options) {
    this.name = "TimeoutError";
    this.status = null;
    this.message = ex.message;
    this.url = options.url;
}

function NotFoundError(ex) {
    this.name = "NotFoundError";
    this.status = ex.status;
    this.message = ex.response.error.message;
    this.url = ex.response.error.url;
}

function UnauthorisedError(ex) {
    this.name = "UnauthorisedError";
    this.status = ex.status;
    this.message = ex.response.error.message;
    this.url = ex.response.error.url;
}

function create(ex, options = null) {
    if (ex.timeout) {
        return new TimeoutError(ex, options);
    }
    if (ex.response && ex.response.notFound) {
        return new NotFoundError(ex);
    }
    if (ex.response && (ex.response.unauthorized || ex.response.forbidden)) {
        return new UnauthorisedError(ex);
    }
    return new AjaxError(ex);
}

export default {
    create
};
